import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../../components/Button';

const Container = styled.div`
	font-size: 16px;
	font-weight: normal;
`;

const ItemListContainer = styled.div`
	border: solid 1px;
	border-radius: 5px;
`;

const ItemList = styled.div`
	max-height: 100px;
	overflow-y: auto;
	margin: 1%;
`;

interface CollectionSummaryProps {
	items: string[];
	itemsType: string;
	maxVisibleItemCount?: number;
}

export const CollectionSummary = (props: CollectionSummaryProps) => {
	const { items, itemsType, maxVisibleItemCount = 0 } = props;
	const [showFullList, setShowFullList] = React.useState<boolean>(false);

	return (
		<Container>
			{!showFullList ? (
				<>
					{items.length} {itemsType}
					{': '}
					{items.slice(0, maxVisibleItemCount).join(', ')}
					{items.length > maxVisibleItemCount ? ', ...' : ''}
				</>
			) : (
				<ItemListContainer>
					<ItemList>
						{items.map((item) => (
							<div>{item}</div>
						))}
					</ItemList>
				</ItemListContainer>
			)}
			{items.length > maxVisibleItemCount && (
				<Button
					plain
					ml={showFullList ? 0 : 3}
					onClick={() => {
						setShowFullList(!showFullList);
					}}
				>
					Show {showFullList ? 'less' : 'all'}
				</Button>
			)}
		</Container>
	);
};
