import cloneDeep = require('lodash/cloneDeep');
import * as React from 'react';
import { FaPieChart, FaTrash } from 'react-icons/lib/fa';
import {
	DropDownButtonProps,
	FilterRule,
	FilterViewScope,
	Schema,
	SingleFilterView
} from 'rendition';
import styled from 'styled-components';
import DropDownButton from '../DropDownButton';
import { Box } from '../Grid';
import Txt from '../Txt';
import FilterDescription from './FilterDescription';
import { SIMPLE_SEARCH_NAME } from './SchemaSieve';
import { isValidRule } from './Summary';

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

const ViewListItem = styled.li`
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

interface ViewsMenuProps {
	buttonProps?: DropDownButtonProps;
	disabled?: boolean;
	rules: FilterRule[];
	views: FilterViewScope[];
	schema: Schema;
	setRules: (rules: FilterRule[]) => void;
	deleteView: (view: SingleFilterView, scopeKey: string) => any;
}

interface ViewsMenuState {
	showViewsMenu: boolean;
}

class ViewsMenu extends React.Component<ViewsMenuProps, ViewsMenuState> {
	constructor(props: ViewsMenuProps) {
		super(props);

		this.state = {
			showViewsMenu: false,
		};
	}

	loadView(view: SingleFilterView) {
		const rules = cloneDeep(view.rules);
		this.props.setRules(rules);
		this.setState({ showViewsMenu: false });
	}

	render() {
		const { views } = this.props;
		const hasViews =
			views.length > 0 &&
			views.reduce((sum, item) => sum + item.data.length, 0) > 0;
		return (
			<Wrapper>
				<DropDownButton
					disabled={this.props.disabled}
					primary
					outline
					joined
					alignRight
					noListFormat
					label={
						<span>
							<FaPieChart style={{ marginRight: 10 }} />
							Views
						</span>
					}
					{...this.props.buttonProps}
				>
					<Box py={1}>
						{!hasViews && (
							<Box py={2} px={3}>
								{"You haven't created any views yet"}
							</Box>
						)}
						{hasViews &&
							views.map(scope => {
								if (!scope.data || !scope.data.length) {
									return;
								}
								return (
									<Box key={scope.key}>
										{!!scope.title && (
											<Txt fontSize={13} ml={20} mb={2} mt={2} color="#aaa">
												{scope.title}
											</Txt>
										)}
										<UnstyledList>
											{scope.data.map(view => {
												const rules = view.rules.filter(
													rule =>
														isValidRule(rule) ||
														rule.name === SIMPLE_SEARCH_NAME,
												);
												return (
													<ViewListItem key={view.name}>
														<ViewListItemLabel
															m={0}
															onClick={() => this.loadView(view)}
														>
															{view.name}
															<br />
															<Txt m={0} fontSize={12} color="#aaa">
																{rules.length} filter{rules.length > 1 && 's'}
															</Txt>
														</ViewListItemLabel>
														<button
															onClick={() =>
																this.props.deleteView(view, scope.key)
															}
														>
															<FaTrash name="trash" />
														</button>
														<Preview>
															{rules.map(rule => (
																<Box mb={10} key={rule.id}>
																	<FilterDescription
																		schema={this.props.schema[rule.name]}
																		rule={rule}
																	/>
																</Box>
															))}
														</Preview>
													</ViewListItem>
												);
											})}
										</UnstyledList>
									</Box>
								);
							})}
					</Box>
				</DropDownButton>
			</Wrapper>
		);
	}
}

export default ViewsMenu;
