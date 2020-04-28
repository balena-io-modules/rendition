import * as _ from 'lodash';
import * as React from 'react';
import { DropDownButton, Txt } from '../../';
import styled from 'styled-components';
import { TableColumnState } from '../TableColumnSelector';

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	white-space: nowrap;
`;

const Item = styled.div<
	{ disabled?: boolean } & React.HTMLProps<HTMLDivElement>
>`
	color: ${props =>
		props.disabled
			? props.theme.colors.text.light
			: props.theme.colors.text.main};
	font-weight: ${props => (props.disabled ? 'bold' : 'normal')};
	cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;

interface CustomColumnHeaderProps {
	columnInfo: TableColumnState;
	items: string[];
	disabledItems: string[];
	label: string;
	setColumn: (column: TableColumnState, item: string) => void;
}

const stopEvent = (e: React.MouseEvent<HTMLElement>) => {
	e.preventDefault();
	e.stopPropagation();
};

export const CustomColumnHeader = (props: CustomColumnHeaderProps) => {
	const configured = !!props.columnInfo.title;
	return (
		<DropDownButton
			label={
				<Wrapper>
					<Txt bold={!configured}>{props.label}:</Txt>
					{configured ? (
						<Txt m="0 3px" bold>
							{props.columnInfo.title}
						</Txt>
					) : (
						<Txt m="0 3px" color="text.light">
							Choose {props.label.toLowerCase()} ...
						</Txt>
					)}
				</Wrapper>
			}
			plain
			joined
			alignRight
			onClick={stopEvent}
		>
			{_.map(props.items, item => {
				const disabled = _.includes(props.disabledItems, item);
				return (
					<Item
						key={item}
						disabled={disabled}
						title={
							disabled
								? `This ${props.label.toLowerCase()} is already selected`
								: undefined
						}
						onClick={() => !disabled && props.setColumn(props.columnInfo, item)}
					>
						{item}
					</Item>
				);
			})}
		</DropDownButton>
	);
};
