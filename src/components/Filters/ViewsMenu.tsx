import { faChartPie } from '@fortawesome/free-solid-svg-icons/faChartPie';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import * as React from 'react';
import styled from 'styled-components';
import { stopEvent } from '../../utils';
import { FilterRenderMode, FiltersView } from '.';
import { Box } from '../Box';
import { Button } from '../Button';
import { DropDownButton, DropDownButtonProps } from '../DropDownButton';
import FilterDescription from './FilterDescription';
import { Flex } from '../Flex';
import theme from '../../theme';

const PlainPanel = styled.div`
	border-radius: 2px;
	background-color: #ffffff;
	box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
	border: solid 1px #9b9b9b;
`;

const Preview = styled(PlainPanel)`
	display: none;
	position: absolute;
	right: 230px;
	width: 300px;
	right: 100%;
	margin-right: 3px;
	top: 2px;
	padding: 15px 15px 5px;
`;

const ViewsMenu = ({
	views,
	renderMode,
	compact,
	deleteView,
	setFilters,
	disabled,
	dark,
	buttonProps,
}: ViewsMenuProps) => {
	const loadView = (view: FiltersView) => {
		const filters = cloneDeep(view.filters);
		setFilters(filters);
	};

	const hasViews = views.length > 0;

	const memoizedItems = React.useMemo(
		() =>
			!hasViews
				? [[{ content: "You haven't created any views yet" }]]
				: [
						views.map((view, index) => ({
							content: (
								<Flex
									flexDirection="row"
									justifyContent="space-between"
									alignItems="center"
									key={index}
								>
									<Flex flexDirection="column" mr={3}>
										<Flex flexDirection="column">{view.name}</Flex>
										<Flex flexDirection="row" color={theme.colors.gray}>
											{view.filters.length} filter
											{view.filters.length > 1 && 's'}
										</Flex>
									</Flex>
									<Flex flexDirection="column">
										<Button
											plain
											onClick={(e) => {
												deleteView(view);
												stopEvent(e);
											}}
										>
											<FontAwesomeIcon icon={faTrash} />
										</Button>
									</Flex>
									<Preview>
										{view.filters.map((filter) => (
											<Box mb={10} key={filter.$id}>
												<FilterDescription filter={filter} />
											</Box>
										))}
									</Preview>
								</Flex>
							),
							onClick: () => loadView(view),
						})),
				  ],
		[views, deleteView],
	);

	return (
		<DropDownButton
			mx={typeof renderMode === 'string' || renderMode?.length === 1 ? 0 : 1}
			disabled={disabled}
			quartenary
			light={dark}
			outline
			joined
			alignRight={typeof renderMode === 'string' || renderMode?.length === 1}
			noListFormat
			icon={<FontAwesomeIcon icon={faChartPie} />}
			label="Views"
			compact={compact}
			{...buttonProps}
			items={memoizedItems}
		/>
	);
};

export interface ViewsMenuProps {
	buttonProps?: DropDownButtonProps;
	disabled?: boolean;
	dark?: boolean;
	views: FiltersView[];
	schema: JSONSchema;
	setFilters: (filters: JSONSchema[]) => void;
	deleteView: (view: FiltersView) => any;
	renderMode?: FilterRenderMode | FilterRenderMode[];
	compact?: boolean[];
}

export default ViewsMenu;
