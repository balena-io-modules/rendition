import { faChartPie } from '@fortawesome/free-solid-svg-icons/faChartPie';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSONSchema6 } from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import * as React from 'react';
import styled from 'styled-components';
import { FilterRenderMode, FiltersView } from '.';
import { Box } from '../Box';
import DropDownButton, { DropDownButtonProps } from '../DropDownButton';
import Txt from '../Txt';
import FilterDescription from './FilterDescription';

const Wrapper = styled.div``;

const UnstyledList = styled.ul`
	list-style: none;
	padding: 0 !important;
	margin: 0;
`;

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

export const ViewListItem = styled.li`
	position: relative;
	padding: 7px 40px 7px 20px;
	&:hover {
		background-color: #f3f3f3;
	}
	& > p {
		padding-right: 20px;
	}
	& > button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 2px;
		padding: 8px;
		background: none;
		border: none;
		display: none;
		cursor: pointer;
	}
	&:hover > button {
		display: block;
		opacity: 0.7;
	}
	> button:hover {
		opacity: 1;
	}
	&:hover ${Preview} {
		display: block;
	}
`;

const ViewListItemLabel = styled(Txt)`
	cursor: pointer;
`;

class ViewsMenu extends React.Component<ViewsMenuProps, ViewsMenuState> {
	constructor(props: ViewsMenuProps) {
		super(props);

		this.state = {
			showViewsMenu: false,
		};
	}

	loadView(view: FiltersView) {
		const filters = cloneDeep(view.filters);
		this.props.setFilters(filters);
		this.setState({ showViewsMenu: false });
	}

	render() {
		const { views, renderMode, hasMultipleScopes } = this.props;
		const hasViews = views.length > 0;
		const groupedViews = groupBy(views, item => item.scope || 'Unscoped');

		let soloRender = false;
		if (renderMode) {
			const mode = Array.isArray(renderMode) ? renderMode : [renderMode];
			soloRender = mode.length === 1 && mode[0] === 'views';
		}

		return (
			<Wrapper>
				<DropDownButton
					ml={soloRender ? 0 : 30}
					disabled={this.props.disabled}
					quartenary={!this.props.dark}
					light={this.props.dark}
					outline
					joined
					alignRight={!soloRender}
					noListFormat
					icon={<FontAwesomeIcon icon={faChartPie} />}
					label="Views"
					{...this.props.buttonProps}
				>
					<Box py={1}>
						{!hasViews && (
							<Box py={2} px={3}>
								{"You haven't created any views yet"}
							</Box>
						)}
						{hasViews &&
							map(groupedViews, (views: FiltersView[], scope) => (
								<Box key={scope}>
									{hasMultipleScopes && (
										<Txt fontSize={13} ml={20} mb={2} mt={2} color="#aaa">
											{scope}
										</Txt>
									)}
									<UnstyledList>
										{views.map(view => (
											<ViewListItem key={view.name}>
												<ViewListItemLabel
													m={0}
													onClick={() => this.loadView(view)}
												>
													{view.name}
													<br />
													<Txt m={0} fontSize={12} color="#aaa">
														{view.filters.length} filter
														{view.filters.length > 1 && 's'}
													</Txt>
												</ViewListItemLabel>
												<button onClick={() => this.props.deleteView(view)}>
													<FontAwesomeIcon icon={faTrash} />
												</button>
												<Preview>
													{view.filters.map(filter => (
														<Box mb={10} key={filter.$id}>
															<FilterDescription filter={filter} />
														</Box>
													))}
												</Preview>
											</ViewListItem>
										))}
									</UnstyledList>
								</Box>
							))}
					</Box>
				</DropDownButton>
			</Wrapper>
		);
	}
}

export interface ViewsMenuProps {
	buttonProps?: DropDownButtonProps;
	disabled?: boolean;
	dark?: boolean;
	views: FiltersView[];
	schema: JSONSchema6;
	hasMultipleScopes?: boolean;
	setFilters: (filters: JSONSchema6[]) => void;
	deleteView: (view: FiltersView) => any;
	renderMode?: FilterRenderMode | FilterRenderMode[];
}

interface ViewsMenuState {
	showViewsMenu: boolean;
}

export default ViewsMenu;
