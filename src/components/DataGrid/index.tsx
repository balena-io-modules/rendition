import React from 'react';
import styled from 'styled-components';
import { px } from '../../utils';

const Base = styled.div<MinMaxProps>`
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

const BaseDataGrid = <T extends any>({
	itemMinWidth,
	itemMaxWidth,
	items,
	renderItem,
	getItemKey,
}: DataGridProps<T>) => {
	return (
		<Base itemMinWidth={itemMinWidth} itemMaxWidth={itemMaxWidth}>
			{items.map((item) => (
				<BaseItem
					key={getItemKey(item)}
					itemMinWidth={itemMinWidth}
					itemMaxWidth={itemMaxWidth}
				>
					{renderItem(item)}
				</BaseItem>
			))}
		</Base>
	);
};

export interface DataGridProps<T> {
	/** An array of data items that will be displayed in the grid */
	items: T[];
	/** A function that returns a react node to render for each item */
	renderItem: (item: T) => React.ReactNode;
	/** A function that returns an item key for each item */
	getItemKey: (item: T) => string | number;
	/** The minimum width of each grid item */
	itemMinWidth: number | string;
	/** The maximum width of each grid item */
	itemMaxWidth?: number | string;
}

type MinMaxProps = Pick<DataGridProps<any>, 'itemMinWidth' | 'itemMaxWidth'>;

/**
 * A component that renders the data in a grid layout, usually using a card per item. For the best results, and in order to avoid large gaps between grid items, make sure your card item is responsive, and can handle double the minimum width (You should set `itemMaxWidth={itemMinWidth * 2}`).
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/DataGrid/DataGrid.stories.tsx)
 */
export const DataGrid = BaseDataGrid;
