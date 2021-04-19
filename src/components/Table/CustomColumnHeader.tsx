import * as React from 'react';
import styled from 'styled-components';
import { stopEvent } from '../../utils';
import { DropDownButton } from '../DropDownButton';
import { Txt } from '../Txt';
import { TableColumnState } from './TableColumnSelector';

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	white-space: nowrap;
`;

const Item = styled.div<
	{ disabled?: boolean } & React.HTMLProps<HTMLDivElement>
>`
	color: ${(props) =>
		props.disabled
			? props.theme.colors.text.light
			: props.theme.colors.text.main};
	font-weight: ${(props) => (props.disabled ? 'bold' : 'normal')};
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

interface CustomColumnHeaderProps<TC extends TableColumnState> {
	columnInfo: TC;
	items: string[];
	disabledItems: string[];
	label: string;
	setColumn: (column: TC, item: string) => void;
}

export const CustomColumnHeader = <TC extends TableColumnState>(
	props: CustomColumnHeaderProps<TC>,
) => {
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
							{`Choose ${props.label.toLowerCase()}`}
						</Txt>
					)}
				</Wrapper>
			}
			plain
			joined
			alignRight
			onClick={stopEvent}
		>
			{props.items.map((item) => {
				const disabled = props.disabledItems.includes(item);
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
