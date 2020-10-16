import React from 'react';
import styled from 'styled-components';
import { px } from '../../utils';

export interface DataGridProps<T> {
	items: T[];
	renderItem: (item: T) => React.ReactNode;
	getItemKey: (item: T) => string | number;
	itemMinWidth: number | string;
	itemMaxWidth?: number | string;
}

type MinMaxProps = Pick<DataGridProps<any>, 'itemMinWidth' | 'itemMaxWidth'>;

const BaseGrid = styled.div<MinMaxProps>`
	display: grid;
	justify-content: left;
	grid-gap: ${(props) => px(props.theme.space[4])};
	grid-template-columns: ${(props) =>
		`repeat(auto-fill, minmax(${props.itemMinWidth}, 1fr))`};
`;

const BaseItem = styled.div<MinMaxProps>`
	min-width: ${(props) => props.itemMinWidth};
	max-width: ${(props) => props.itemMaxWidth ?? '100%'};
`;

export const DataGrid = <T extends any>({
	itemMinWidth,
	itemMaxWidth,
	items,
	renderItem,
	getItemKey,
}: DataGridProps<T>) => {
	return (
		<BaseGrid itemMinWidth={itemMinWidth} itemMaxWidth={itemMaxWidth}>
			{items.map((item) => (
				<BaseItem
					key={getItemKey(item)}
					itemMinWidth={itemMinWidth}
					itemMaxWidth={itemMaxWidth}
				>
					{renderItem(item)}
				</BaseItem>
			))}
		</BaseGrid>
	);
};
