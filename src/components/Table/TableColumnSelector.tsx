import * as _ from 'lodash';
import * as React from 'react';
import { FaCheck } from 'react-icons/lib/fa';
import { CustomColumnSelectorItemProps, TableColumn } from 'rendition';
import styled, { StyledFunction } from 'styled-components';

import { stopEvent } from '../../utils';
import Divider from '../Divider';
import DropDownButtonBase from '../DropDownButton';

const TableColumnSelectorSizer = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	align-items: center;
	padding: 4px 5px;
	background-color: #f2f2f2;
	box-shadow: -6px 0 1px -1px #f2f2f2;
`;

const DropDownButton = styled(DropDownButtonBase)`
	& > button {
		height: 30px;
		width: 30px;
		min-width: auto;
		border-color: ${props => props.theme.colors.gray.main};
	}
`;

const Item = (styled.div as StyledFunction<
	{ light?: boolean; disabled?: boolean } & React.HTMLProps<HTMLDivElement>
>)`
	display: flex;
	align-items: center;
	justify-content: stretch;
	cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
	color: ${props =>
		props.light || props.disabled ? props.theme.colors.text.light : 'inherit'};
`;

const ItemIcon = styled.span`
	display: flex;
	height: 14px;
	width: 14px;
	margin-right: ${props => props.theme.space[2]}px;
	font-size: 14px;
`;

export interface TableColumnSelectorProps<T> {
	columns: Array<TableColumn<T>>;
	hiddenColumnFields: Array<keyof T>;
	customColumnSelectorItems?: CustomColumnSelectorItemProps[];
	theme: any;
	onColumnFilterClick: (columnField: keyof T) => void;
}

export const TableColumnSelector = function<T>({
	onColumnFilterClick,
	hiddenColumnFields,
	customColumnSelectorItems,
	columns,
	theme,
}: TableColumnSelectorProps<T>) {
	const columnItems = _.filter(columns, col => !col.locked).map(col => {
		const isHidden = hiddenColumnFields.indexOf(col.field) >= 0;

		return (
			<Item
				key={col.field}
				light={isHidden}
				onClick={e => {
					onColumnFilterClick(col.field);
					stopEvent(e);
				}}
			>
				<ItemIcon>{isHidden ? null : <FaCheck />}</ItemIcon>
				{col.label || col.field}
			</Item>
		);
	});

	return (
		<TableColumnSelectorSizer>
			<DropDownButton joined alignRight>
				{columnItems}

				{customColumnSelectorItems &&
					customColumnSelectorItems.length > 0 && (
						<Divider
							key="divider"
							m="8px 0"
							style={{ height: 1 }}
							color={theme.colors.gray.main}
						/>
					)}

				{customColumnSelectorItems &&
					customColumnSelectorItems.map((columnSelector: any) => {
						return (
							<Item
								key={columnSelector.label}
								disabled={columnSelector.disabled}
								title={columnSelector.label}
								onClick={columnSelector.onClick}
							>
								<ItemIcon>{columnSelector.icon}</ItemIcon>
								{columnSelector.label}
							</Item>
						);
					})}
			</DropDownButton>
		</TableColumnSelectorSizer>
	);
};
