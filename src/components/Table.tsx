import every = require('lodash/every');
import filter = require('lodash/filter');
import find = require('lodash/find');
import get = require('lodash/get');
import includes = require('lodash/includes');
import isArray = require('lodash/isArray');
import isEqual = require('lodash/isEqual');
import isFunction = require('lodash/isFunction');
import isPlainObject = require('lodash/isPlainObject');
import map = require('lodash/map');
import reject = require('lodash/reject');
import reverse = require('lodash/reverse');
import some = require('lodash/some');
import sortBy = require('lodash/sortBy');
import * as React from 'react';
import FaSort = require('react-icons/lib/fa/sort');
import { TableColumn, TableProps } from 'rendition';
import styled from 'styled-components';

import theme from '../theme';
import Button from './Button';
import Pager from './Pager';

const highlightStyle = `
	background-color: ${theme.colors.info.light};
`;

const BaseTableWrapper = styled.div`
	overflow-x: auto;
	max-width: 100%;
`;

const BaseTable = styled.div`
	display: table;
	width: 100%;
	border-spacing: 0;

	> [data-display='table-head'] {
		display: table-header-group;
		background-color: #f2f2f2;

		> [data-display='table-row'] {
			display: table-row;

			> [data-display='table-cell'] {
				display: table-cell;
				text-align: left;
				padding-left: 40px;
				padding-top: 10px;
				padding-bottom: 10px;
				font-size: 16px;
			}
		}
	}

	> [data-display='table-body'] {
		display: table-row-group;

		> [data-display='table-row'] {
			display: table-row;
			text-decoration: none;
			color: inherit;

			> [data-display='table-cell'] {
				display: table-cell;
				font-size: 14px;
				text-align: left;
				padding-top: 14px;
				padding-bottom: 14px;
				padding-left: 40px;
				text-decoration: none;
				color: inherit;
			}

			> a[data-display='table-cell'] {
				cursor: ${(props: any) =>
					!!props.onRowClick || !!props.getRowHref ? 'pointer' : 'auto'};
			}

			&:nth-of-type(even) {
				background-color: #f8f8f8;
			}

			&: hover {
				text-decoration: none;
				color: inherit;
				${(props: any) =>
					!!props.onRowClick || !!props.getRowHref || !!props.onCheck
						? highlightStyle
						: ''};
			}

			&[data-highlight='true'] {
				${highlightStyle} > [data-display="table-cell"]:first-child {
					box-shadow: inset 3px 0px 0 ${theme.colors.info.main};
				}
			}
		}
	}
`;

const HeaderButton = styled(Button)`
	display: block;
`;

/**
 * Get the value specified by the `field` value
 * If a `render` function is available, use it to get the display value.
 */
const renderField = <T extends {}>(row: T, column: TableColumn<T>): any => {
	const value = get(row, column.field);

	if (column.render) {
		return column.render(value, row);
	}

	return value == null ? '' : value;
};

interface TableRowProps<T> {
	className?: string;
	isChecked: boolean;
	isHighlighted: boolean;
	keyAttribute: string | number;
	onRowClick: (e: any) => void;
	toggleChecked: (e: any) => void;
	showCheck: boolean;
	columns: Array<TableColumn<T>>;
	href?: string;
	data: T;
	attributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
	checkboxAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
}

class TableRow<T> extends React.Component<TableRowProps<T>, {}> {
	shouldComponentUpdate(nextProps: TableRowProps<T>) {
		const update = !isEqual(nextProps, this.props);

		return update;
	}

	render() {
		const {
			attributes,
			checkboxAttributes,
			columns,
			className,
			data,
			href,
			keyAttribute,
			isChecked,
			isHighlighted,
			showCheck,
		} = this.props;

		return (
			<div
				data-display="table-row"
				data-highlight={isChecked || isHighlighted}
				className={className}
			>
				{showCheck && (
					<span data-display="table-cell">
						<input
							checked={isChecked}
							data-key={keyAttribute}
							onChange={this.props.toggleChecked}
							{...checkboxAttributes}
							type="checkbox"
						/>
					</span>
				)}
				{map(columns, column => {
					const cellAttributes = isFunction(column.cellAttributes)
						? column.cellAttributes(data, get(data, column.field))
						: column.cellAttributes || {};
					return (
						<a
							{...attributes}
							href={href}
							data-display="table-cell"
							data-key={keyAttribute}
							onClick={this.props.onRowClick}
							{...cellAttributes}
							key={column.field}
						>
							{renderField(data, column)}
						</a>
					);
				})}
			</div>
		);
	}
}

export default class Table<T> extends React.Component<
	TableProps<T>,
	{
		allChecked: boolean;
		reverse: boolean;
		checkedItems: T[];
		sortColumn: null | keyof T;
		page: number;
	}
> {
	constructor(props: TableProps<T>) {
		super(props);

		if (props.onCheck && !props.rowKey) {
			throw new Error(
				'A `rowKey` property must be provided if using `onCheck` with a Table component',
			);
		}

		this.state = {
			allChecked: false,
			reverse: false,
			checkedItems: [],
			sortColumn: null,
			page: 0,
		};
	}

	isChecked(item: T) {
		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return false;
		}

		const identifier = item[rowKey];
		return some(this.state.checkedItems, { [rowKey]: identifier });
	}

	isHighlighted(item: T) {
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

	isEachRowChecked(checkedItems: T[]): boolean {
		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return false;
		}

		const selectedKeys = map(checkedItems, rowKey);

		return every(this.props.data, x => includes(selectedKeys, x[rowKey]));
	}

	sortData(data: T[]): T[] {
		const { sortColumn } = this.state;
		if (sortColumn === null) {
			return data;
		}
		const column = find(this.props.columns, { field: sortColumn });

		if (!column) {
			return data;
		}

		let collection;

		if (isFunction(column.sortable)) {
			collection = data.slice().sort(column.sortable);
		} else {
			collection = sortBy<T>(data.slice(), item => {
				const sortableValue = item[sortColumn];
				return isPlainObject(sortableValue)
					? (sortableValue as any).value
					: sortableValue;
			});
		}

		if (this.state.reverse) {
			reverse(collection);
		}

		return collection;
	}

	setRowSelection = (selectedRows: T[]): void => {
		const { rowKey, data } = this.props;

		if (!rowKey) {
			return;
		}

		if (selectedRows.length === 0) {
			this.setState({ allChecked: false, checkedItems: [] });
			return;
		}

		const selectedRowsIds = map(selectedRows, rowKey);

		let checkedItems: T[] = [];
		let allChecked = false;

		if (data) {
			checkedItems = filter(this.props.data, x =>
				includes(selectedRowsIds, x[rowKey]),
			);
			allChecked = data.length > 0 && checkedItems.length === data.length;
		}

		this.setState({ allChecked, checkedItems });
	};

	toggleAllChecked = () => {
		const { data } = this.props;

		const allChecked = !this.state.allChecked;
		const checkedItems = allChecked ? (data || []).slice() : [];

		if (this.props.onCheck) {
			this.props.onCheck(checkedItems);
		}

		this.setState({ allChecked, checkedItems });
	};

	toggleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			: reject(this.state.checkedItems, { [rowKey]: identifier });

		if (this.props.onCheck) {
			this.props.onCheck(checkedItems);
		}

		this.setState({
			allChecked: this.isEachRowChecked(checkedItems),
			checkedItems,
		});
	};

	toggleSort = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { field } = e.currentTarget.dataset;

		if (!field) {
			return;
		}

		if (this.state.sortColumn === field) {
			this.setState({ reverse: !this.state.reverse });
			return;
		}
		this.setState({
			sortColumn: field as keyof T,
			reverse: false,
		});
	};

	getElementFromKey(key: string) {
		const { data, rowKey } = this.props;
		if (!data) {
			return;
		}

		if (rowKey) {
			// Normalize the key value to a string for comparison, because data
			// attributes on elements are always strings
			return find(data, element => `${element[rowKey]}` === key);
		}

		return data[Number(key)];
	}

	onRowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

	resetPager = () => {
		this.setState({ page: 0 });
	};

	incrementPage = () => {
		this.setState({ page: this.state.page + 1 });
	};

	decrementPage = () => {
		this.setState({ page: this.state.page - 1 });
	};

	render() {
		const {
			columns,
			data,
			usePager,
			itemsPerPage,
			pagerPosition,
			rowAnchorAttributes,
			rowKey,
			...props
		} = this.props;

		const { getRowHref, getRowClass } = props;

		const { page } = this.state;
		const items = data || [];
		const totalItems = items.length;

		const _itemsPerpage = itemsPerPage || 50;
		const _pagerPosition = pagerPosition || 'top';

		const lowerBound = usePager ? page * _itemsPerpage : 0;
		const upperBound = usePager
			? Math.min((page + 1) * _itemsPerpage, totalItems)
			: totalItems;

		const sortedData = this.sortData(items).slice(lowerBound, upperBound);

		return (
			<>
				{!!usePager &&
					(_pagerPosition === 'top' || _pagerPosition === 'both') && (
						<Pager
							totalItems={totalItems}
							itemsPerPage={_itemsPerpage}
							page={page}
							nextPage={this.incrementPage}
							prevPage={this.decrementPage}
							mb={2}
						/>
					)}

				<BaseTableWrapper>
					<BaseTable {...props}>
						<div data-display="table-head">
							<div data-display="table-row">
								{this.props.onCheck && (
									<div data-display="table-cell">
										<input
											checked={this.state.allChecked}
											onChange={this.toggleAllChecked}
											type="checkbox"
										/>
									</div>
								)}
								{map(columns, item => {
									if (item.sortable) {
										return (
											<div data-display="table-cell" key={item.field}>
												<HeaderButton
													data-field={item.field}
													plaintext
													primary={this.state.sortColumn === item.field}
													onClick={this.toggleSort}
												>
													{item.label || item.field}
													&nbsp;
													<FaSort
														style={{ display: 'inline-block' }}
														color={
															this.state.sortColumn === item.field
																? theme.colors.info.main
																: ''
														}
													/>
												</HeaderButton>
											</div>
										);
									}
									return (
										<div data-display="table-cell" key={item.field}>
											{item.label || item.field}
										</div>
									);
								})}
							</div>
						</div>
						<div data-display="table-body">
							{this.props.tbodyPrefix}
							{map(sortedData, (row, i) => {
								const isChecked = this.props.onCheck
									? this.isChecked(row)
									: false;
								const isHighlighted = this.isHighlighted(row);
								const key = rowKey ? (row[rowKey] as any) : i;
								const href = !!getRowHref ? getRowHref(row) : undefined;
								const classNamesList = isFunction(getRowClass)
									? getRowClass(row)
									: [];
								const className = isArray(classNamesList)
									? classNamesList.join(' ')
									: '';
								return (
									<TableRow
										isChecked={isChecked}
										isHighlighted={isHighlighted}
										key={key}
										keyAttribute={key}
										href={href}
										data={row}
										showCheck={!!this.props.onCheck}
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
					</BaseTable>
				</BaseTableWrapper>

				{!!usePager &&
					(_pagerPosition === 'bottom' || _pagerPosition === 'both') && (
						<Pager
							totalItems={totalItems}
							itemsPerPage={_itemsPerpage}
							page={page}
							nextPage={this.incrementPage}
							prevPage={this.decrementPage}
							mb={2}
						/>
					)}
			</>
		);
	}
}
