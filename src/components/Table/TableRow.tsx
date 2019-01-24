import get = require('lodash/get');
import isFunction = require('lodash/isFunction');
import map = require('lodash/map');
import * as React from 'react';
import { TableColumn } from 'rendition';

/*
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

export interface TableRowProps<T> {
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

export class TableRow<T> extends React.PureComponent<TableRowProps<T>, {}> {
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
