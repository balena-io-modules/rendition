import * as React from 'react';

import styled from 'styled-components';
import { Theme } from '../../../index';
import { Coloring } from '../../../common-types';
import { Txt } from '../../Txt';
import { getThemeColoring } from '../../../utils';

import CaretButton from './CaretButton';

const Container = styled.div`
	font-size: 16px;
	font-weight: normal;
	color: #b3b6b9;
`;

const ItemNameHolder = styled(Txt)`
	font-size: 0.9em;
	white-space: normal;
	color: ${(prop) => prop.color || ''};
`;

interface CollectionSummaryProps extends Coloring {
	initiallyExpanded?: boolean;
	items: string[];
	itemsType: string;
	maxVisibleItemCount?: number;
	itemNameStyle?: React.CSSProperties;
}

export class CollectionSummary extends React.Component<
	CollectionSummaryProps,
	{
		isExpanded: boolean;
	}
> {
	constructor(props: CollectionSummaryProps) {
		super(props);

		this.state = {
			isExpanded: !!this.props.initiallyExpanded,
		};
	}

	public render() {
		const { items, itemsType, maxVisibleItemCount } = this.props;
		const itemNameColor = getThemeColoring(Theme, this.props, 'main');
		return (
			<Container>
				{items.length === 1 && <Txt color={itemNameColor}>{items[0]}</Txt>}
				{items.length > 1 && (
					<div>
						<CaretButton
							isExpanded={this.state.isExpanded}
							onClick={() =>
								this.setState({
									isExpanded: !this.state.isExpanded,
								})
							}
						>
							<span>{`${items.length} ${itemsType}`}</span>
						</CaretButton>
						{this.state.isExpanded && (
							<ItemNameHolder color={itemNameColor}>
								{maxVisibleItemCount && items.length > maxVisibleItemCount
									? `${items.slice(0, maxVisibleItemCount).join(', ')}, ...`
									: items.join(', ')}
							</ItemNameHolder>
						)}
					</div>
				)}
			</Container>
		);
	}
}
