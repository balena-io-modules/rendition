import get = require('lodash/get');
import isPlainObject = require('lodash/isPlainObject');
import map = require('lodash/map');
import reverse = require('lodash/reverse');
import sortBy = require('lodash/sortBy');
import * as React from 'react';
import FaSort = require('react-icons/lib/fa/sort');
import styled from 'styled-components';

import theme from '../theme';
import Button from './Button';
import { Flex } from './Grid';

export interface TableDataRow {
	[key: string]: any;
}

type TableSortFunction = <T>(a: T, b: T) => number;

interface TableColumn {
	field: string;
	icon?: string;
	label?: string | JSX.Element;
	sortable?: boolean | TableSortFunction;
	render?: (value: any, row: any) => string | JSX.Element;
}

interface TableProps {
	columns: TableColumn[];
	data: TableDataRow[];
	// Optionally provide a key that should be used as a unique identifier for each row
	rowKey?: string;
}

const BaseTable = styled.table`
	width: 100%;
	border-spacing: 0;

	> thead {
		background-color: #f2f2f2;

		> tr > th {
			padding-left: 40px;
			padding-top: 10px;
			padding-bottom: 10px;
			font-size: 16px;
		}
	}

	> tbody {
		> tr {
			> td {
				font-size: 16px;
				padding-top: 14px;
				padding-bottom: 14px;
				padding-left: 40px;
			}

			&:nth-of-type(even) {
				background-color: #f8f8f8;
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
const renderField = (row: TableDataRow, column: TableColumn) => {
	const value = get(row, column.field);

	if (column.render) {
		return column.render(value, row);
	}

	return value == null ? '' : value;
};

export default class Table extends React.Component<
	TableProps,
	{
		sortColumn: null | string;
		reverse: boolean;
	}
> {
	constructor(props: TableProps) {
		super(props);

		this.state = {
			sortColumn: null,
			reverse: false,
		};
	}

	sortData(data: TableDataRow[]): TableDataRow[] {
		if (this.state.sortColumn === null) {
			return data;
		}

		const collection = (sortBy(data.slice(), item => {
			const sortableValue = item[this.state.sortColumn!];
			return isPlainObject(sortableValue)
				? (sortableValue as any).value
				: sortableValue;
		}) as any) as TableDataRow[];

		if (this.state.reverse) {
			reverse(collection);
		}

		return collection;
	}

	toggleSort(field: string) {
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
						return (
							<tr key={rowKey ? row[rowKey] : i}>
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
