import every = require('lodash/every');
import get = require('lodash/get');
import includes = require('lodash/includes');
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
import { Flex } from './Grid';
import Input from './Input';

const highlightStyle = `
	background-color: ${theme.colors.info.light};
`;

const BaseTable = styled.table`
	width: 100%;
	border-spacing: 0;

	> thead {
		background-color: #f2f2f2;

		> tr > th {
			text-align: left;
			padding-left: 40px;
			padding-top: 10px;
			padding-bottom: 10px;
			font-size: 16px;
		}
	}

	> tbody {
		> tr {
			cursor: ${(props: any) => (!!props.onRowClick ? 'pointer' : 'auto')};

			> td {
				text-align: left;
				font-size: 14px;
				padding-top: 14px;
				padding-bottom: 14px;
				padding-left: 40px;
			}

			&:nth-of-type(even) {
				background-color: #f8f8f8;
			}

			&: hover {
				${highlightStyle};
			}

			&[data-checked='true'] {
				${highlightStyle} > td:first-child {
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
const renderField = <T extends {}>(
	row: T,
	column: TableColumn<T>,
): string | number | JSX.Element | null => {
	const value = get(row, column.field);

	if (column.render) {
		return column.render(value, row);
	}

	return value == null ? '' : value;
};

export default class Table<T> extends React.Component<
	TableProps<T>,
	{
		allChecked: boolean;
		reverse: boolean;
		checkedItems: T[];
		sortColumn: null | keyof T;
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

	isEachRowChecked(checkedItems: T[]): boolean {
		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return false;
		}

		const selectedKeys = map(checkedItems, rowKey);

		return every(this.props.data, x => includes(selectedKeys, x[rowKey]));
	}

	sortData(data: T[]): T[] {
		if (this.state.sortColumn === null) {
			return data;
		}

		const collection = sortBy<T>(data.slice(), item => {
			const sortableValue = item[this.state.sortColumn!] as any;
			return isPlainObject(sortableValue)
				? (sortableValue as any).value
				: sortableValue;
		});

		if (this.state.reverse) {
			reverse(collection);
		}

		return collection;
	}

	toggleAllChecked() {
		const allChecked = !this.state.allChecked;
		const checkedItems = allChecked ? this.props.data.slice() : [];

		if (this.props.onCheck) {
			this.props.onCheck(checkedItems);
		}

		this.setState({ allChecked, checkedItems });
	}

	toggleChecked(item: T) {
		const rowKey = this.props.rowKey;
		if (!rowKey) {
			return false;
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
	}

	toggleSort(field: keyof T) {
		if (this.state.sortColumn === field) {
			this.setState({ reverse: !this.state.reverse });
			return;
		}
		this.setState({
			sortColumn: field,
			reverse: false,
		});
	}

	render() {
		const { columns, data, rowKey, ...props } = this.props;

		return (
			<BaseTable {...props}>
				<thead>
					<tr>
						{this.props.onCheck && (
							<th>
								<Input
									checked={this.state.allChecked}
									onChange={() => this.toggleAllChecked()}
									type="checkbox"
								/>
							</th>
						)}
						{map(columns, item => {
							if (item.sortable) {
								return (
									<th key={item.field}>
										<HeaderButton
											plaintext
											primary={this.state.sortColumn === item.field}
											onClick={() => this.toggleSort(item.field)}
										>
											<Flex align="center">
												{item.label || item.field}
												&nbsp;
												<FaSort
													color={
														this.state.sortColumn === item.field
															? theme.colors.info.main
															: ''
													}
												/>
											</Flex>
										</HeaderButton>
									</th>
								);
							}
							return <th key={item.field}>{item.label}</th>;
						})}
					</tr>
				</thead>
				<tbody>
					{map(this.sortData(data), (row, i) => {
						const isChecked = this.props.onCheck ? this.isChecked(row) : false;
						return (
							<tr
								data-checked={isChecked}
								key={rowKey ? (row[rowKey] as any) : i}
								onClick={() =>
									this.props.onRowClick && this.props.onRowClick(row)
								}
							>
								{this.props.onCheck && (
									<td>
										<Input
											checked={isChecked}
											onChange={() => this.toggleChecked(row)}
											type="checkbox"
										/>
									</td>
								)}
								{map(columns, column => {
									return <td key={column.field}>{renderField(row, column)}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</BaseTable>
		);
	}
}
