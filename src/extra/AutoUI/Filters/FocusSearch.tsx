import React from 'react';
import { Txt } from '../../../components/Txt';
import { Checkbox } from '../../../components/Checkbox';
import reject from 'lodash/reject';
import groupBy from 'lodash/groupBy';
import styled from 'styled-components';
import { Box } from '../../../components/Box';
import { Flex } from '../../../components/Flex';
import { useHistory } from '../../../hooks/useHistory';
import { AutoUIContext } from '../schemaOps';
import { stopEvent } from '../../../utils';
import { AutoUIModel } from '..';

const Focus = styled(Box)`
	flex-basis: 500px;
	background-color: white;
	border: solid 1px ${(props) => props.theme.colors.quartenary.dark};
	max-height: 200px;
	position: absolute;
	width: 100%;
	z-index: 1;
	border-radius: 0 0 ${(props) => props.theme.global.drop.border.radius}
		${(props) => props.theme.global.drop.border.radius};
	overflow: hidden;
`;

const FocusContent = styled(Box)`
	max-height: 180px;
	overflow-y: auto;
	overflow-x: auto;
`;

const FocusItem = styled(Box)<{ hasGetBaseUrl: boolean }>`
	cursor: ${(props) => (props.hasGetBaseUrl ? 'pointer' : 'default')};
	&:hover {
		background: #dde1f0; // This is the background color Select uses for entities on hover. We do not have it in our theme
	}
`;

interface FocusSearchProps<T extends { id: number; [key: string]: any }> {
	searchTerm: string;
	filtered: T[];
	selected: T[];
	setSelected: (selected: T[]) => void;
	autouiContext: AutoUIContext<T>;
	model: AutoUIModel<T>;
	hasUpdateActions?: boolean;
}

export const FocusSearch = <T extends { id: number; [key: string]: any }>({
	searchTerm,
	filtered,
	selected,
	setSelected,
	autouiContext,
	model,
	hasUpdateActions,
}: FocusSearchProps<T>) => {
	const history = useHistory();

	const queryTerms = searchTerm.split(' ').map((x) => x.toLowerCase());

	const filteredById = groupBy(
		filtered.map((entity) => ({
			id: entity.id,
			searchTerms: Object.values(entity).filter(
				(val) => typeof val === 'number' || val?.length > 0,
			),
		})),
		(entity) => entity.id,
	);

	const filteredFittingSearchTerms = filtered.filter((entity) => {
		const { searchTerms } = filteredById[entity.id][0];

		return queryTerms.every((term) =>
			searchTerms.some(
				(field) =>
					typeof field !== 'function' && field.toString().includes(term),
			),
		);
	});

	if (!filteredFittingSearchTerms.length) {
		return (
			<Focus>
				<Flex justifyContent="space-around" py={2}>
					<em>no results</em>
				</Flex>
			</Focus>
		);
	}

	return (
		<Focus>
			<FocusContent>
				{filteredFittingSearchTerms.map((entity) => (
					<FocusItem
						px={1}
						py={2}
						key={entity.id}
						onClick={(e) => {
							e.preventDefault();
							if (autouiContext.getBaseUrl && history) {
								try {
									const url = new URL(autouiContext.getBaseUrl(entity));
									window.open(url.toString(), '_blank');
								} catch (err) {
									history.push?.(autouiContext.getBaseUrl(entity));
								}
							}
						}}
						hasGetBaseUrl={!!autouiContext.getBaseUrl}
					>
						<Flex flexDirection="row">
							{hasUpdateActions && (
								<Flex flexDirection="column" ml={1} mr={3} alignItems="center">
									<Checkbox
										onChange={() => {
											const isChecked = !!selected.find(
												(s) => s.id === entity.id,
											);
											const checkedItems = !isChecked
												? selected.concat(entity)
												: (reject(selected, {
														id: entity.id,
												  }) as unknown as Array<typeof entity>);
											setSelected(checkedItems);
										}}
										checked={!!selected.find((s) => s.id === entity.id)}
										onClick={stopEvent}
									/>
								</Flex>
							)}
							<Flex
								flexDirection="column"
								alignItems="center"
								ml={!hasUpdateActions ? 1 : undefined}
							>
								<Txt>{entity[model.priorities?.primary[0] ?? 'id']}</Txt>
							</Flex>
						</Flex>
					</FocusItem>
				))}
			</FocusContent>
		</Focus>
	);
};
