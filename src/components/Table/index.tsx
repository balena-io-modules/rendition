import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import every from 'lodash/every';
import filter from 'lodash/filter';
import find from 'lodash/find';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import map from 'lodash/map';
import reject from 'lodash/reject';
import reverse from 'lodash/reverse';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from '../Button';

// TODO: Remove explicit import and depend on provider instead.
import theme from '../../theme';
import { px } from '../../utils';
import { Checkbox, CheckboxProps } from '../Checkbox';
import { Pager } from '../Pager';
import { CheckboxWrapper, TableColumn, TableRow } from './TableRow';

const highlightStyle = `
	background-color: ${theme.colors.info.light};
`;

const BaseTableWrapper = styled.div`
	overflow-x: auto;
	max-width: 100%;
`;

interface BaseTableProps {
	hasCheckbox: boolean;
	hasRowClick: boolean;
	hasGetRowRef: boolean;
}

const Base = styled.div<BaseTableProps>`
	display: table;
	width: 100%;
	border-spacing: 0;
	border-bottom: 1px solid ${(props) => props.theme.colors.quartenary.main};

	> [data-display='table-head'] {
		display: table-header-group;
		background-color: ${(props) => props.theme.colors.quartenary.light};

		> [data-display='table-row'] {
			display: table-row;

			> [data-display='table-cell'] {
				display: table-cell;
				border-bottom: 1px solid
					${(props) => props.theme.colors.quartenary.main};
				text-align: left;
				vertical-align: middle;
				padding: 10px 20px;
				font-size: ${(props) => px(props.theme.fontSizes[2])};
			}

			> [data-display='table-cell']:first-child {
				padding-left: ${(props) => (props.hasCheckbox ? '20px' : '40px')};
				${(props) => (props.hasCheckbox ? 'width: 60px' : '')};
			}

			> [data-display='table-cell']:last-child {
				padding-right: 40px;
			}
		}
	}

	> [data-display='table-body'] {
		display: table-row-group;

		> [data-display='table-row'] {
			display: table-row;
			text-decoration: none;
			color: ${(props) => props.theme.colors.secondary.main};
			font-size: ${(props) => px(props.theme.fontSizes[2])};

			> [data-display='table-cell'] {
				display: table-cell;
				text-align: left;
				vertical-align: middle;
				padding: 14px 20px;
				text-decoration: none;
				color: inherit;
			}

			> [data-display='table-cell']:first-child {
				padding-left: ${(props) => (props.hasCheckbox ? '20px' : '40px')};
				${(props) => (props.hasCheckbox ? 'width: 60px' : '')};
			}

			> [data-display='table-cell']:last-child {
				padding-right: 40px;
			}

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

const HeaderButton = styled(Button)`
	display: block;
`;

interface TableState<T> {
	allChecked: boolean;
	sort: {
		reverse: boolean;
		field: null | keyof T;
	};
	checkedItems: T[];
	page: number;
}

/**
 * A component used to generate a styled table.
 *
 * ## Columns
 *
 * The `columns` property defines what columns the table should display, how they
 * are rendered and whether or not the column is sortable.
 *
 * The `columns` property should be an array of objects with the following properties:
 *
 * | Name          | Type      | Required | Description                                          |
 * | ------------- | --------- | -------- | ---------------------------------------------------- |
 * | field         | `keyof T`  | ✓ | The name of the field this column should render, this should correspond to a key on the objects passed to the `data` property of the `Table` component |
 * | key | `string` | - | Custom key for React to use instead of the field name above |
 * | cellAttributes | <code>object &#124; (value: any, row: T) => object</code> | - | Attributes that are passed to each cell in this column. This can also be a function, which will be called with the value of the `field` provided and the row data (`T`) |
 * | label | <code>string &#124; JSX.Element</code> | - | A string or JSX element that will be used to display the name of the column. If this property is not provided, the `field` property will be used instead |
 * | render | <code>(value: any, row: T) => string &#124; number &#124; number &#124; JSX.Element &#124; null</code> | - | Use a custom render function to display the value in each column cell. This function will be called with the value of the `field` provided and the row data (`T`) |
 * | sortable | <code>boolean &#124; (a: T, b: T) => number</code> | - | If true, the column will be sortable using an alphanumeric sort, alternatively a function can be provided allowing finer grained control over sorting |
 *
 * ## Notes
 *
 * For performance reasons table rows are only re-rendered if the row properties
 * have changed. For this reason, rows **will not** re-render if their properties
 * are mutated: you should clone the item instead, for example:
 *
 * ```js
 * update (index) {
 *   const newData = this.state.data
 *   const element = newData[index]
 *   newData[index] = Object.assign({}, element, { active: !element.active })
 *   this.setState({ data: newData })
 * }
 * ```
 *
 * See the **Updating data in a table** story for an example of how this can be
 * done using a high order component.
 *
 * Additionally, because of this rendering behaviour the `render()` functions in
 * the `Table` component's `columns` property should only use values provided to
 * the render function.
 * When `render()` functions are provided, they must act like pure functions with
 * respect to their props. They should only rely on their arguments to generate
 * their output and not use any context variables. If you are using a context
 * variable in your `render()` function, then changes to that variable will not
 * cause a re-render of the component and will not be reflected on the table.
 *
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Table/Table.stories.tsx)
 */
export class Table<T> extends React.Component<TableProps<T>, TableState<T>> {
	constructor(props: TableProps<T>) {
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
			...this.getSelectedRows(props.checkedItems),
		};
	}

	public componentDidUpdate(prevProps: TableProps<T>) {
		if (this.props.sort && !isEqual(prevProps.sort, this.props.sort)) {
			this.setState({
				sort: this.props.sort,
			});
		}

		if (
			this.props.checkedItems &&
			prevProps.checkedItems !== this.props.checkedItems
		) {
			this.setRowSelection(this.props.checkedItems);
		}

		const totalItems = this.props.data?.length ?? 0;
		const itemsPerPage = this.props.itemsPerPage ?? 50;
		if (this.state.page !== 0 && totalItems <= this.state.page * itemsPerPage) {
			this.resetPager();
		}
	}

	public isChecked(item: T) {
		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return false;
		}

		const identifier = item[rowKey];
		return some(this.state.checkedItems, { [rowKey]: identifier });
	}

	public isHighlighted(item: T) {
		if (
			!this.props.highlightedRows ||
			this.props.highlightedRows.length === 0
		) {
			return false;
		}

		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return false;
		}

		const identifier = item[rowKey];
		return includes(this.props.highlightedRows, identifier);
	}

	public isDisabled(item: T) {
		if (!this.props.disabledRows || this.props.disabledRows.length === 0) {
			return false;
		}

		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return false;
		}

		const identifier = item[rowKey];
		return includes(this.props.disabledRows, identifier);
	}

	public isEachRowChecked(checkedItems: T[]): boolean {
		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return false;
		}

		const selectedKeys = map(checkedItems, rowKey);

		return every(this.props.data, (x) => includes(selectedKeys, x[rowKey]));
	}

	public sortData(data: T[]): T[] {
		const { sort } = this.state;
		if (!sort || sort.field === null) {
			return data;
		}

		const column = find(this.props.columns, { field: sort.field });

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
			reverse(collection);
		}

		return collection;
	}

	private getSelectedRows = (selectedRows: T[] | undefined) => {
		const { rowKey, data } = this.props;

		if (!rowKey || selectedRows?.length === 0) {
			return { checkedItems: [], allChecked: false };
		}

		const selectedRowsIds = map(selectedRows, rowKey);

		let checkedItems: T[] = [];
		let allChecked = false;

		if (data) {
			checkedItems = filter(this.props.data, (x) =>
				includes(selectedRowsIds, x[rowKey]),
			);
			allChecked = data.length > 0 && checkedItems.length === data.length;
		}

		return { checkedItems, allChecked };
	};

	public setRowSelection = (selectedRows: T[]): void => {
		this.setState(this.getSelectedRows(selectedRows));
	};

	public toggleAllChecked = () => {
		const { data } = this.props;

		const allChecked = !this.state.allChecked;
		const checkedItems = allChecked
			? (data || []).slice().filter((r) => !this.isDisabled(r))
			: [];

		if (this.props.onCheck) {
			this.props.onCheck(checkedItems);
		}

		this.setState({ allChecked, checkedItems });
	};

	public toggleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rowKey = this.props.rowKey;
		const { key } = e.currentTarget.dataset;
		if (!rowKey || !key) {
			return false;
		}

		const item = this.getElementFromKey(key);

		if (!item) {
			return;
		}

		const identifier = item[rowKey];

		const isChecked = !this.isChecked(item);
		const checkedItems = isChecked
			? this.state.checkedItems.concat(item)
			: ((reject(this.state.checkedItems, {
					[rowKey]: identifier,
			  }) as unknown) as Array<typeof item>);

		if (this.props.onCheck) {
			this.props.onCheck(checkedItems);
		}

		this.setState({
			allChecked: this.isEachRowChecked(checkedItems),
			checkedItems,
		});
	};

	public toggleSort = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { field } = e.currentTarget.dataset;
		const { sort } = this.state;
		if (!field) {
			return;
		}

		let nextSort = {
			field: field as keyof T,
			reverse: false,
		};

		if (sort.field === field) {
			nextSort = { field: sort.field, reverse: !sort.reverse };
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
			return find(data, (element) => `${element[rowKey]}` === key);
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

	public setPage = (change: any) => {
		if (this.props.onPageChange) {
			this.props.onPageChange(change);
		}

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
			itemsPerPage,
			pagerPosition,
			rowAnchorAttributes,
			rowKey,
			onCheck,
			onRowClick,
			getRowHref,
			getRowClass,
			...props
		} = this.props;

		const { page, sort } = this.state;
		const items = data || [];
		const totalItems = items.length;

		const _itemsPerPage = itemsPerPage || 50;
		const _pagerPosition = pagerPosition || 'top';

		const lowerBound = usePager ? page * _itemsPerPage : 0;
		const upperBound = usePager
			? Math.min((page + 1) * _itemsPerPage, totalItems)
			: totalItems;

		const sortedData = this.sortData(items).slice(lowerBound, upperBound);

		const shouldShowPaper = !!usePager && totalItems > 0;

		return (
			<>
				{shouldShowPaper &&
					(_pagerPosition === 'top' || _pagerPosition === 'both') && (
						<Pager
							totalItems={totalItems}
							itemsPerPage={_itemsPerPage}
							page={page}
							nextPage={this.incrementPage}
							prevPage={this.decrementPage}
							mb={2}
						/>
					)}

				<BaseTableWrapper>
					<Base
						{...props}
						hasRowClick={!!onRowClick}
						hasGetRowRef={!!getRowHref}
						hasCheckbox={!!onCheck}
					>
						<div data-display="table-head">
							<div data-display="table-row">
								{onCheck && (
									<CheckboxWrapper data-display="table-cell">
										<Checkbox
											checked={this.state.allChecked}
											onChange={this.toggleAllChecked}
										/>
									</CheckboxWrapper>
								)}
								{map(columns, (item) => {
									if (item.sortable) {
										return (
											<div
												data-display="table-cell"
												key={item.key || (item.field as string)}
											>
												<HeaderButton
													data-field={item.field}
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
												</HeaderButton>
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
							{map(sortedData, (row, i) => {
								const isChecked = onCheck ? this.isChecked(row) : false;
								const isHighlighted = this.isHighlighted(row);
								const isDisabled = this.isDisabled(row);
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

				{shouldShowPaper &&
					(_pagerPosition === 'bottom' || _pagerPosition === 'both') && (
						<Pager
							totalItems={totalItems}
							itemsPerPage={_itemsPerPage}
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
}

export interface TableProps<T> {
	/** An array of column objects, as described above */
	columns: Array<TableColumn<T>>;
	/** An array of objects that will be displayed in the table */
	data?: T[] | null;
	/** If provided, it will make the checked rows a controlled aspect of the table */
	checkedItems?: T[];
	/** If provided, each row in the table will be a clickable link, this function is used to create the link href */
	getRowHref?: (row: T) => string;
	/** If provided, each row will begin with a checkbox. This function is called with every checked row every time a checkbox is toggled on or off. This property requires that you have provided a `rowKey` property */
	onCheck?: (checkedItems: T[]) => void;
	/** A function that is called when a row is clicked. This property requires that you have provided a `rowKey` property */
	onRowClick?: (row: T, event: React.MouseEvent<HTMLAnchorElement>) => void;
	/** A function that is called when a column is sorted */
	onSort?: (sort: TableSortOptions<T>) => void;
	/** A function that is called when the page is incremented, decremented and reset */
	onPageChange?: (page: number) => void;
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
	/** The number of items to be shown per page. Only used if `usePager` is true. Defaults to 50. */
	itemsPerPage?: number;
	/** Sets whether the pager is displayed at the top of the table, the bottom of the table or in both positions. Only used if `usePager` is true. Defaults to `top`. */
	pagerPosition?: 'top' | 'bottom' | 'both';
}

export { TableColumn, TableRow };
