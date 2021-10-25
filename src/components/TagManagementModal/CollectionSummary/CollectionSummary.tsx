import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	font-size: 16px;
	font-weight: normal;
`;

const ItemListContainer = styled.div`
	border: solid 1px;
	border-radius: 5px;
`;

const ItemList = styled.div`
	max-height: 150px;
	overflow-y: auto;
	margin: 1%;
`;

interface CollectionSummaryProps {
	items: string[];
	itemsType: string;
}

export const CollectionSummary = (props: CollectionSummaryProps) => {
	const { items, itemsType } = props;

	return (
		<Container>
			Affected {itemsType}
			{': '}
			<ItemListContainer>
				<ItemList>
					{items.map((item) => (
						<div>{item}</div>
					))}
				</ItemList>
			</ItemListContainer>
		</Container>
	);
};
