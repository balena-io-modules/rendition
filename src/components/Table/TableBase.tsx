import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import sortBy from 'lodash/sortBy';
import memoizee from 'memoizee';
import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../Button';

// TODO: Remove explicit import and depend on provider instead.
import theme from '../../theme';
import { px } from '../../utils';
import { CheckboxProps, Checkbox } from '../Checkbox';
import { Pager } from '../Pager';
import { CheckboxWrapper, TableBaseColumn, TableRow } from './TableRow';

const highlightStyle = `
	background-color: ${theme.colors.info.light};
`;

const BaseTableWrapper = styled.div`
	overflow-x: auto;
	max-width: 100%;
	border-bottom: 1px solid ${(props) => props.theme.colors.quartenary.main};
`;
export const DEFAULT_ITEMS_PER_PAGE = 50;
export type Pagination = { itemsPerPage?: number } & (
	| { serverSide?: undefined }
	| {
			serverSide: true;
			currentPage: number;
			totalItems: number;
	  }
);

interface InternalTableBaseProps {
	hasCheckbox: boolean;
	hasRowClick: boolean;
	hasGetRowRef: boolean;
}

const Base = styled.div<InternalTableBaseProps>`
	display: table;
	width: 100%;
	border-spacing: 0;

	> [data-display='table-head'] {
		display: table-header-group;
		background-color: ${(props) => props.theme.colors.quartenary.semilight};

		> [data-display='table-row'] {
			display: table-row;

			> [data-display='table-cell'] {
				display: table-cell;
				border-bottom: 1px solid
					${(props) => props.theme.colors.quartenary.main};
				text-align: left;
				vertical-align: middle;
				padding: 5px 20px;
				font-size: ${(props) => px(props.theme.fontSizes[2])};
				font-weight: normal;
				white-space: nowrap;
			}

			${(props) =>
				props.hasCheckbox
					? `
					> [data-display='table-cell']:first-child {
						width: 60px;
					}`
					: `
					> [data-display='table-cell']:first-child {
						padding-left: 40px;
					}
					> [data-display='table-cell']:last-child {
						padding-right: 40px;
					}`};
		}
	}

	> [data-display='table-body'] {
		display: table-row-group;

		> [data-display='table-row'] {
			display: table-row;
			text-decoration: none;
			color: ${(props) => props.theme.colors.secondary.main};
			background-color: #fff;
			font-size: ${(props) => px(props.theme.fontSizes[2])};

			> [data-display='table-cell'] {
				display: table-cell;
				text-align: left;
				vertical-align: middle;
				padding: 5px 20px;
				text-decoration: none;
				color: inherit;
			}

			${(props) =>
				props.hasCheckbox
					? `
					> [data-display='table-cell']:first-child {
						width: 60px;
					}`
					: `
					> [data-display='table-cell']:first-child {
						padding-left: 40px;
					}
					> [data-display='table-cell']:last-child {
						padding-right: 40px;
					}`};

			> a[data-display='table-cell'] {
				cursor: ${(props) =>
					props.hasRowClick || props.hasGetRowRef ? 'pointer' : 'auto'};
			}

			&:nth-of-type(even) {
				background-color: ${(props) => props.theme.colors.quartenary.light};
			}

			&:hover {
				text-decoration: none;
				${(props) =>
					props.hasRowClick || props.hasGetRowRef || props.hasCheckbox
						? highlightStyle
						: ''};
			}

			&[data-highlight='true'] {
				${highlightStyle} > [data-display="table-cell"]:first-child {
					box-shadow: inset 3px 0px 0 ${(props) => props.theme.colors.info.main};
				}
			}
		}
	}
`;

export type CheckedState = 'none' | 'some' | 'all';

interface TableBaseState<T> {
	checkedState: CheckedState;
	checkedItems: T[] | undefined;
	sort: {
		reverse: boolean;
		field: null | keyof T;
	};
	page: number;
	lastSelected: T[keyof T] | null;
}

export class TableBase<T extends {}> extends React.Component<
	TableBaseProps<T>,
	TableBaseState<T>
> {
	constructor(props: TableBaseProps<T>) {
		super(props);

		if (props.onCheck && !props.rowKey) {
			throw new Error(
				'A `rowKey` property must be provided if using `onCheck` with a Table component',
			);
		}

		const sortState = props.sort || {
			reverse: false,
			field: null,
		};

		this.state = {
			sort: sortState,
			page: 0,
			lastSelected: null,
			...this.getSelectedRows(props.checkedItems ?? []),
		};
	}

	public componentDidUpdate(prevProps: TableBaseProps<T>) {
		const { sort, checkedItems, data, pagination, rowKey } = this.props;
		const serverSide = pagination?.serverSide;
		if (sort && !isEqual(prevProps.sort, sort)) {
			this.setState({
				sort,
			});
		}

		if (
			checkedItems &&
			(prevProps.checkedItems !== checkedItems ||
				prevProps.rowKey !== rowKey ||
				data !== prevProps.data)
		) {
			this.setRowSelection(checkedItems);
		}

		const totalItems = serverSide ? pagination?.totalItems : data?.length ?? 0;
		const currentPage = serverSide ? pagination?.currentPage : this.state.page;
		const itemsPerPage = this.props.itemsPerPage ?? pagination?.itemsPerPage;
		if (
			currentPage !== 0 &&
			totalItems <= currentPage * (itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE)
		) {
			this.resetPager();
		}
	}

	protected $getSelectedIdentifiersSet = memoizee(
		(selectedRows: T[] | undefined, rowKey: keyof T | undefined) => {
			if (!rowKey) {
				return new Set<unknown>();
			}
			return new Set<unknown>((selectedRows ?? []).map((x) => x[rowKey]));
		},
		{ max: 1 },
	);

	protected getCheckedRowIdentifiers() {
		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return new Set();
		}

		return this.$getSelectedIdentifiersSet(this.state.checkedItems, rowKey);
	}

	/** @deprecated */
	public isChecked(item: T) {
		return (
			this.props.rowKey &&
			this.getCheckedRowIdentifiers().has(item[this.props.rowKey])
		);
	}

	protected $getHighlightedRowIdentifiers = memoizee(
		(highlightedRows: NonNullable<TableBaseProps<T>['highlightedRows']>) =>
			new Set(highlightedRows),
		{ max: 1 },
	);

	protected getHighlightedRowIdentifiers() {
		if (!this.props.highlightedRows || !this.props.rowKey) {
			return new Set();
		}
		return this.$getHighlightedRowIdentifiers(this.props.highlightedRows);
	}

	/** @deprecated */
	public isHighlighted(item: T) {
		return (
			this.props.rowKey &&
			this.getHighlightedRowIdentifiers().has(item[this.props.rowKey])
		);
	}

	protected $getDisabledRowIdentifiers = memoizee(
		(disabledRows: NonNullable<TableBaseProps<T>['disabledRows']>) =>
			new Set(disabledRows),
		{ max: 1 },
	);

	protected getDisabledRowIdentifiers() {
		if (!this.props.disabledRows || !this.props.rowKey) {
			return new Set();
		}
		return this.$getDisabledRowIdentifiers(this.props.disabledRows);
	}

	/** @deprecated */
	public isDisabled(item: T) {
		return (
			this.props.rowKey &&
			this.getDisabledRowIdentifiers().has(item[this.props.rowKey])
		);
	}

	public componentWillUnmount() {
		this.$getHighlightedRowIdentifiers.clear();
		this.$getDisabledRowIdentifiers.clear();
		this.$getSelectedIdentifiersSet.clear();
		this.$getValidatedCheckedItems.clear();
	}

	public howManyRowsChecked(checkedItems: T[]): CheckedState {
		const { rowKey, data, pagination } = this.props;

		if (!rowKey || !data) {
			return 'none';
		}

		return (pagination?.serverSide &&
			checkedItems.length === pagination.totalItems) ||
			(!pagination?.serverSide && data.length === checkedItems.length)
			? 'all'
			: checkedItems.length > 0
			? 'some'
			: 'none';
	}

	public sortData(data: T[]): T[] {
		const { sort } = this.state;
		if (!sort || sort.field === null) {
			return data;
		}

		const column = this.props.columns.find((c) => c.field === sort.field);

		if (!column) {
			return data;
		}

		let collection;

		const columnAny = column || ({} as any);

		if ('sortable' in columnAny && typeof columnAny.sortable === 'function') {
			collection = data.slice().sort(columnAny.sortable);
		} else {
			collection = sortBy<T>(data.slice(), (item) => {
				const sortableValue = item[sort.field as keyof T];
				return isPlainObject(sortableValue)
					? (sortableValue as any).value
					: sortableValue;
			});
		}

		if (sort.reverse) {
			collection.reverse();
		}

		return collection;
	}

	private $getValidatedCheckedItems = memoizee(
		(
			data: T[] | null | undefined,
			selectedKeys: Set<unknown>,
			rowKey: keyof T | undefined,
			checkedItems: T[],
		) => {
			const newCheckedItems =
				!data || !rowKey || selectedKeys.size === 0
					? []
					: data.filter((x) => selectedKeys.has(x[rowKey]));
			// shallow equality check
			for (
				let i = 0;
				i < Math.max(checkedItems.length, newCheckedItems.length);
				i++
			) {
				if (checkedItems[i] !== newCheckedItems[i]) {
					return newCheckedItems;
				}
			}
			return checkedItems;
		},
		{ max: 1 },
	);

	private getSelectedRows = (selectedRows: T[]) => {
		const { rowKey, data, pagination } = this.props;
		let checkedItems;
		if (!pagination?.serverSide) {
			const selectedKeys = this.$getSelectedIdentifiersSet(
				selectedRows,
				rowKey,
			);
			checkedItems = this.$getValidatedCheckedItems(
				data,
				selectedKeys,
				rowKey,
				selectedRows,
			);
		} else {
			checkedItems = selectedRows;
		}
		const checkedState = this.howManyRowsChecked(checkedItems);

		return { checkedItems, checkedState };
	};

	public setRowSelection = (selectedRows: T[]): void => {
		const newState = this.getSelectedRows(selectedRows);
		const hasCheckedItemsChanged =
			newState.checkedItems !== this.state.checkedItems;
		this.setState(newState);
		if (this.props.onCheck && hasCheckedItemsChanged) {
			this.props.onCheck(newState.checkedItems, this.state.checkedState);
		}
	};

	private toggleCheckedState = (checkedState: CheckedState) => {
		return checkedState === 'none' ? 'all' : 'none';
	};

	public toggleAllChecked = () => {
		const { data, onCheck, rowKey, pagination } = this.props;

		let checkedItems: T[] | undefined = !pagination?.serverSide
			? []
			: undefined;

		if (
			data &&
			this.state.checkedItems?.length === 0 &&
			!pagination?.serverSide
		) {
			const disabledRowsSet = this.getDisabledRowIdentifiers();
			checkedItems =
				rowKey && disabledRowsSet.size > 0
					? data.filter((r) => !disabledRowsSet.has(r[rowKey]))
					: data.slice();
		}

		this.setState(({ checkedState }) => {
			const newCheckedState = pagination?.serverSide
				? this.toggleCheckedState(checkedState)
				: this.howManyRowsChecked(checkedItems!);
			onCheck?.(checkedItems, newCheckedState);
			return {
				lastSelected: null,
				checkedState: newCheckedState,
				checkedItems,
			};
		});
	};

	public toggleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { rowKey, data, pagination } = this.props;
		const { key } = e.currentTarget.dataset;
		if (!rowKey || !key || !data) {
			return false;
		}
		const sortedData = this.sortData(data);

		const item = this.getElementFromKey(key);

		if (!item) {
			return;
		}

		const identifier = item[rowKey];
		let newIsChecked;

		let storedCheckedItems =
			(this.props.checkedItems || this.state.checkedItems) ?? [];

		if (pagination?.serverSide && this.state.checkedState === 'all') {
			storedCheckedItems = sortedData;
			newIsChecked = false;
		} else {
			newIsChecked = !this.getCheckedRowIdentifiers().has(identifier);
		}

		const checkedItemsMap = new Map(
			storedCheckedItems.map((item) => [item[rowKey], item]),
		);
		let keysToFind = [identifier];
		if (
			this.state.lastSelected != null &&
			(e.nativeEvent as MouseEvent).shiftKey
		) {
			keysToFind.push(this.state.lastSelected);
		}
		for (
			let index = 0;
			index < sortedData.length && !!keysToFind.length;
			index++
		) {
			let foundKey = false;
			const currentItemKey = sortedData[index][rowKey];
			if (keysToFind.includes(currentItemKey)) {
				keysToFind = keysToFind.filter(
					(keyToFind) => keyToFind !== currentItemKey,
				);
				foundKey = true;
			}
			if (
				foundKey ||
				((e.nativeEvent as MouseEvent).shiftKey &&
					keysToFind.length === 1 &&
					this.state.lastSelected != null)
			) {
				const itemIsChecked = checkedItemsMap.has(currentItemKey);
				if (newIsChecked && !itemIsChecked) {
					checkedItemsMap.set(currentItemKey, sortedData[index]);
				} else if (!newIsChecked && itemIsChecked) {
					checkedItemsMap.delete(currentItemKey);
				}
			}
		}

		const checkedItems = Array.from(checkedItemsMap.values());

		if (this.props.onCheck) {
			this.props.onCheck(checkedItems, this.state.checkedState);
		}

		this.setState({
			lastSelected: identifier,
			checkedState: this.howManyRowsChecked(checkedItems),
			checkedItems,
		});
	};

	public toggleSort = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { field, refScheme } = e.currentTarget.dataset;
		const { sort } = this.state;
		if (!field) {
			return;
		}

		let nextSort = {
			field: field as keyof T,
			refScheme,
			reverse: false,
		};

		if (sort.field === field) {
			nextSort = { field: sort.field, refScheme, reverse: !sort.reverse };
		}

		this.setState({ sort: nextSort });

		if (this.props.onSort) {
			this.props.onSort(nextSort);
		}
	};

	public getElementFromKey(key: string) {
		const { data, rowKey } = this.props;
		if (!data) {
			return;
		}

		if (rowKey) {
			// Normalize the key value to a string for comparison, because data
			// attributes on elements are always strings
			return data.find((element) => `${element[rowKey]}` === key);
		}

		return data[Number(key)];
	}

	public onRowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!this.props.onRowClick) {
			return;
		}

		if (!this.props.rowKey) {
			return console.warn(
				'onRowClick requires that you provide a `rowKey` property',
			);
		}

		const { key } = e.currentTarget.dataset;

		if (!key) {
			return console.warn('onRowClick called on an element without a key set');
		}
		const row = this.getElementFromKey(key);

		if (row) {
			this.props.onRowClick(row, e);
		}
	};

	public setPage = (change: number) => {
		const { pagination } = this.props;
		const itemsPerPage = this.props.itemsPerPage ?? pagination?.itemsPerPage;
		this.props.onPageChange?.(change, itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE);
		this.setState({ page: change });
	};

	public resetPager = () => {
		this.setPage(0);
	};

	public incrementPage = () => {
		this.setPage(this.state.page + 1);
	};

	public decrementPage = () => {
		this.setPage(this.state.page - 1);
	};

	public render() {
		const {
			columns,
			data,
			usePager,
			pagerPosition,
			rowAnchorAttributes,
			rowKey,
			onCheck,
			onRowClick,
			getRowHref,
			getRowClass,
			className,
			fuzzyPager,
			pagination,
		} = this.props;

		const { page, sort } = this.state;
		const serverSide = pagination?.serverSide;
		const items = data || [];
		const totalItems = serverSide ? pagination?.totalItems : items.length;
		const itemsPerPage =
			this.props.itemsPerPage ??
			pagination?.itemsPerPage ??
			DEFAULT_ITEMS_PER_PAGE;
		const _pagerPosition = pagerPosition || 'top';
		let sortedData = items;

		if (!serverSide) {
			const lowerBound = page * itemsPerPage;
			const upperBound = Math.min((page + 1) * itemsPerPage, items.length);
			sortedData = this.sortData(items).slice(lowerBound, upperBound);
		}

		const shouldShowPager = !!usePager && totalItems > 0;
		const checkedRowIdentifiers = this.getCheckedRowIdentifiers();
		const highlightedRowIdentifiers = this.getHighlightedRowIdentifiers();
		const disabledRowIdentifiers = this.getDisabledRowIdentifiers();
		const selectedItemCount =
			this.state.checkedState === 'all'
				? totalItems
				: this.state.checkedItems?.length;

		return (
			<>
				{shouldShowPager &&
					(_pagerPosition === 'top' || _pagerPosition === 'both') && (
						<Pager
							fuzzy={fuzzyPager}
							totalItems={totalItems}
							itemsPerPage={itemsPerPage}
							page={serverSide ? pagination?.currentPage : page}
							nextPage={this.incrementPage}
							prevPage={this.decrementPage}
							mb={2}
						/>
					)}
				<BaseTableWrapper>
					<Base
						className={className}
						hasRowClick={!!onRowClick}
						hasGetRowRef={!!getRowHref}
						hasCheckbox={!!onCheck}
					>
						<div data-display="table-head">
							<div data-display="table-row">
								{onCheck && (
									<CheckboxWrapper
										data-display="table-cell"
										tooltip={
											selectedItemCount != null
												? `Selected: ${selectedItemCount}`
												: undefined
										}
									>
										<Checkbox
											checked={this.state.checkedState === 'all'}
											indeterminate={this.state.checkedState === 'some'}
											onChange={this.toggleAllChecked}
										/>
									</CheckboxWrapper>
								)}
								{columns.map((item) => {
									if (item.sortable) {
										return (
											<div
												data-display="table-cell"
												key={item.key || (item.field as string)}
											>
												<Button
													data-field={item.field}
													data-ref-scheme={item.refScheme}
													plain
													primary={sort.field === item.field}
													onClick={this.toggleSort}
												>
													{item.label || item.field}
													&nbsp;
													<FontAwesomeIcon
														icon={faSort}
														color={
															sort.field === item.field
																? theme.colors.info.main
																: ''
														}
													/>
												</Button>
											</div>
										);
									}
									return (
										<div
											data-display="table-cell"
											key={item.key || (item.field as string)}
										>
											{item.label || item.field}
										</div>
									);
								})}
							</div>
						</div>
						<div data-display="table-body">
							{this.props.tbodyPrefix}
							{sortedData.map((row, i) => {
								let isChecked = false;
								let isHighlighted = false;
								let isDisabled = false;
								if (rowKey) {
									const identifier = row[rowKey];
									isChecked =
										this.state.checkedState === 'all' ||
										(!!onCheck && checkedRowIdentifiers.has(identifier));
									isHighlighted = highlightedRowIdentifiers.has(identifier);
									isDisabled = disabledRowIdentifiers.has(identifier);
								}
								const key = rowKey ? (row[rowKey] as any) : i;
								const href = !!getRowHref ? getRowHref(row) : undefined;
								const classNamesList =
									typeof getRowClass === 'function' ? getRowClass(row) : [];
								const className = Array.isArray(classNamesList)
									? classNamesList.join(' ')
									: '';
								return (
									<TableRow
										isChecked={isChecked}
										isHighlighted={isHighlighted}
										isDisabled={isDisabled}
										key={key}
										keyAttribute={key}
										href={href}
										data={row}
										showCheck={!!onCheck}
										columns={columns}
										attributes={rowAnchorAttributes}
										checkboxAttributes={this.props.rowCheckboxAttributes}
										toggleChecked={this.toggleChecked}
										onRowClick={this.onRowClick}
										className={className}
									/>
								);
							})}
						</div>
					</Base>
				</BaseTableWrapper>

				{shouldShowPager &&
					(_pagerPosition === 'bottom' || _pagerPosition === 'both') && (
						<Pager
							fuzzy={fuzzyPager}
							totalItems={totalItems}
							itemsPerPage={itemsPerPage}
							page={page}
							nextPage={this.incrementPage}
							prevPage={this.decrementPage}
							mt={2}
						/>
					)}
			</>
		);
	}
}

export interface TableSortOptions<T> {
	reverse: boolean;
	field: keyof T | null;
	refScheme?: string;
}

export interface TableBaseProps<T> {
	/** An array of column objects, as described above */
	columns: Array<TableBaseColumn<T>>;
	/** An array of objects that will be displayed in the table */
	data?: T[] | null;
	/** The amount of selected items in the original list of checked (selected) items */
	checkedItems?: T[];
	/** If provided, each row in the table will be a clickable link, this function is used to create the link href */
	getRowHref?: (row: T) => string;
	/** If provided, each row will begin with a checkbox. This function is called with every checked row every time a checkbox is toggled on or off. This property requires that you have provided a `rowKey` property */
	onCheck?: (checkedItems: T[] | undefined, checkStatus: CheckedState) => void;
	/** A function that is called when a row is clicked. This property requires that you have provided a `rowKey` property */
	onRowClick?: (row: T, event: React.MouseEvent<HTMLAnchorElement>) => void;
	/** A function that is called when a column is sorted */
	onSort?: (sort: TableSortOptions<T>) => void;
	/** A function that is called when the page is incremented, decremented and reset */
	onPageChange?: (page: number, itemsPerPage: number) => void;
	/** sort options to be used both as a default sort, and on subsequent renders if the passed sort changes */
	sort?: TableSortOptions<T>;
	/** Attributes to pass to the anchor element used in a row */
	rowAnchorAttributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
	/** Attributes to pass to the checkbox element used in a row */
	rowCheckboxAttributes?: CheckboxProps;
	/** A field on a row that contains a unique identifier, can help speed up render performance and is required for the onCheck property */
	rowKey?: keyof T;
	/** JSX element(s) to display at the top of the table body */
	tbodyPrefix?: JSX.Element | JSX.Element[];
	/** Highlights one or more rows. This property requires that you have provided a rowKey property: the row with a `rowKey` property that matches one of these values is highlighted. */
	highlightedRows?: any;
	/** Disable one or more rows. This property requires that you have provided a rowKey property: the row with a `rowKey` property that matches one of these values is disabled. */
	disabledRows?: Array<T[keyof T]>;
	/** If provided each row will have classes based on some conditions. Should return a className string */
	getRowClass?: (row: T) => string[];
	/** If true, a pager will be used when displaying items. */
	usePager?: boolean;
	/** If true, the total number of items shown on the page will be indicated as being approximate. Useful for when you don't now the full size of your dataset. Only used if `usePager` is true. */
	fuzzyPager?: boolean;
	/** The number of items to be shown per page. Only used if `usePager` is true. Defaults to 50. */
	/** @deprecated use pagination.itemsPerPage */
	itemsPerPage?: number;
	/** Information from a server side pagination */
	pagination?: Pagination;
	/** Sets whether the pager is displayed at the top of the table, the bottom of the table or in both positions. Only used if `usePager` is true. Defaults to `top`. */
	pagerPosition?: 'top' | 'bottom' | 'both';
	className?: string;
}
