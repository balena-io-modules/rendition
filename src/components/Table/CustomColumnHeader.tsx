import * as React from 'react';
import styled from 'styled-components';
import { stopEvent } from '../../utils';
import { Box } from '../Box';
import { DropDownButton } from '../DropDownButton';
import { Txt } from '../Txt';
import { TableColumnState } from './TableColumnSelector';

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	white-space: nowrap;
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
	const { columnInfo, items, disabledItems, label, setColumn } = props;
	const configured = !!columnInfo.title;
	const memoizedItems = React.useMemo(
		() => [
			items.map((item) => {
				const disabled = disabledItems.includes(item);
				return {
					content: <Box key={item}>{item}</Box>,
					disabled,
					tooltip: disabled
						? `This ${label.toLowerCase()} is already selected`
						: undefined,
					actionFn: () => setColumn(columnInfo, item),
				};
			}),
		],
		[items, disabledItems, label, setColumn, columnInfo],
	);
	return (
		<DropDownButton // TODO: This should probably be a Select
			label={
				<Wrapper>
					<Txt bold={!configured}>{label}:</Txt>
					{configured ? (
						<Txt m="0 3px" bold>
							{columnInfo.title}
						</Txt>
					) : (
						<Txt m="0 3px" color="text.light">
							{`Choose ${label.toLowerCase()}`}
						</Txt>
					)}
				</Wrapper>
			}
			plain
			joined
			alignRight
			onClick={stopEvent}
			items={memoizedItems}
		/>
	);
};
