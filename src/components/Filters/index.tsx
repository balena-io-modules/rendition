import cloneDeep = require('lodash/cloneDeep');
import findIndex = require('lodash/findIndex');
import map = require('lodash/map');
import reject = require('lodash/reject');
import * as React from 'react';
import { FaFilter, FaSearch } from 'react-icons/lib/fa';
import { FiltersProps, FiltersView } from 'rendition';
import styled from 'styled-components';
import Theme from '../../theme';
import * as utils from '../../utils';
import Button from '../Button';
import { getDataModel } from '../DataTypes';
import DeleteBtn from '../DeleteButton';
import { Box, Flex } from '../Grid';
import Modal from '../Modal';
import Select from '../Select';
import Txt from '../Txt';
import * as SchemaSieve from './SchemaSieve';
import ViewsMenu from './ViewsMenu';

import { JSONSchema6 } from 'json-schema';

import Summary from './Summary';

interface FilterInputProps {
	schema: JSONSchema6;
	value: any;
	operator: string;
	onUpdate: (value: any) => void;
}

const FilterInput = (props: FilterInputProps) => {
	const model = getDataModel(props.schema);

	if (!model) {
		return null;
	}

	return (
		<model.Edit
			schema={props.schema}
			value={props.value}
			operator={props.operator}
			onUpdate={props.onUpdate}
			slim
		/>
	);
};

const RelativeBox = styled(Box)`
	position: relative;
`;

const ExtraRuleDeleteBtn = styled(DeleteBtn)`
	position: absolute;
	bottom: 7px;
	right: -35px;
`;

const SimpleSearchBox = styled.div`
	position: relative;
	width: 500px;
	border-bottom: 2px solid ${Theme.colors.gray.main};
	padding-left: 20px;
	padding-top: 3px;
	margin-left: 30px;
	margin-right: 30px;

	.search-icon {
		position: absolute;
		top: 7px;
		left: 0;
		color: ${Theme.colors.gray.main};
	}

	input {
		background: transparent;
		box-shadow: none;
		border: none;
		width: 100%;
		font-size: inherit;
		padding: 5px;
		::placeholder {
			font-style: italic;
			color: ${Theme.colors.gray.main};
		}
	}
`;

const FilterWrapper = styled(Box)`
	position: relative;
`;

interface EditModel {
	field: string;
	operator: string;
	value: string | number | { [k: string]: string };
}

interface FiltersState {
	showModal: boolean;
	edit: EditModel[];
	editingFilter: string | null;
	searchString: string;
	filters: JSONSchema6[];
	views: FiltersView[];
}

class Filters extends React.Component<FiltersProps, FiltersState> {
	constructor(props: FiltersProps) {
		super(props);
		const { filters, views } = this.props;

		this.state = {
			showModal: false,
			searchString: '',
			edit: [this.getCleanEditModel()],
			editingFilter: null,
			filters: filters || [],
			views: views || [],
		};

		// Clean exsting rules on load
	}

	getCleanEditModel(field?: string) {
		const { schema } = this.props;
		if (!field) {
			field = Object.keys(schema.properties!).shift()!;
		}
		const operator = this.getOperators(field).shift()!.slug;
		return {
			field,
			operator,
			value: '',
		};
	}

	getOperators(field: string) {
		const { schema } = this.props;
		return SchemaSieve.getOperators(schema, field);
	}

	setEditField(field: string, index: number) {
		const currentEdit = this.state.edit.slice();
		currentEdit.splice(index, 1, this.getCleanEditModel(field));
		this.setState({
			edit: currentEdit,
		});
	}

	setEditOperator(operator: string, index: number) {
		const currentEdit = this.state.edit.slice();
		const item = currentEdit[index];
		currentEdit.splice(index, 1, { ...item, operator });
		this.setState({
			edit: currentEdit,
		});
	}

	setEditValue(value: string, index: number) {
		const currentEdit = this.state.edit.slice();
		const item = currentEdit[index];
		currentEdit.splice(index, 1, { ...item, value });
		this.setState({
			edit: currentEdit,
		});
	}

	addFilter() {
		const $id = this.state.editingFilter;
		const { schema } = this.props;
		const filter = SchemaSieve.createFilter(schema, this.state.edit);
		const currentFilters = this.state.filters;

		let filters: JSONSchema6[];

		if (!!$id) {
			const matchIndex = findIndex(currentFilters, { $id });
			currentFilters.splice(matchIndex, 1, filter);
			filters = currentFilters.slice();
		} else {
			filters = currentFilters.concat(filter);
		}

		this.setState(
			{
				filters,
				edit: [this.getCleanEditModel()],
				showModal: false,
				editingFilter: null,
			},
			() =>
				this.props.onFiltersUpdate &&
				this.props.onFiltersUpdate(this.state.filters),
		);
	}

	editFilter(filter: JSONSchema6) {
		const { schema } = this.props;

		const signatures = SchemaSieve.decodeFilter(schema, filter);

		this.setState({
			edit: signatures as EditModel[],
			editingFilter: filter.$id!,
			showModal: true,
		});
	}

	removeFilter({ $id }: JSONSchema6) {
		this.setState(
			prevState => ({
				filters: reject(prevState.filters, { $id }),
			}),
			() =>
				this.props.onFiltersUpdate &&
				this.props.onFiltersUpdate(this.state.filters),
		);
	}

	setFilters(filters: JSONSchema6[]) {
		this.setState(
			{ filters },
			() =>
				this.props.onFiltersUpdate &&
				this.props.onFiltersUpdate(this.state.filters),
		);
	}

	addCompound() {
		this.setState(prevState => ({
			edit: prevState.edit.concat(this.getCleanEditModel()),
		}));
	}

	removeCompound(index: number) {
		const edit = this.state.edit.slice();
		edit.splice(index, 1);
		this.setState({
			edit,
		});
	}

	saveView(name: string, scope: string | null) {
		const view: FiltersView = {
			id: utils.randomString(),
			name,
			scope,
			filters: cloneDeep(this.state.filters),
		};

		this.setState(
			prevState => ({
				views: prevState.views.concat(view),
			}),
			() =>
				this.props.onViewsUpdate && this.props.onViewsUpdate(this.state.views),
		);
	}

	deleteView({ id }: FiltersView) {
		this.setState(
			prevState => ({
				views: reject(prevState.views, { id }),
			}),
			() =>
				this.props.onViewsUpdate && this.props.onViewsUpdate(this.state.views),
		);
	}

	setSimpleSearch(term: string) {
		this.setState(prevState => {
			const newFilters = term
				? SchemaSieve.upsertFullTextSearch(
						this.props.schema,
						prevState.filters,
						term,
					)
				: SchemaSieve.removeFullTextSearch(prevState.filters);

			return {
				searchString: term,
				filters: newFilters,
			};
		}, () => this.props.onFiltersUpdate && this.props.onFiltersUpdate(this.state.filters));
	}

	render() {
		const { filters } = this.state;

		return (
			<FilterWrapper mb={3}>
				<Flex justify="space-between">
					<Button
						disabled={this.props.disabled}
						primary
						onClick={() =>
							this.setState({ showModal: true, editingFilter: null })
						}
						{...this.props.addFilterButtonProps}
					>
						<FaFilter style={{ marginRight: 10 }} />
						Add filter
					</Button>

					<SimpleSearchBox>
						<input
							style={{ color: this.props.dark ? '#fff' : undefined }}
							disabled={this.props.disabled}
							placeholder="Search entries..."
							value={this.state.searchString}
							onChange={e => this.setSimpleSearch(e.target.value)}
						/>
						<FaSearch className="search-icon" name="search" />
					</SimpleSearchBox>

					<ViewsMenu
						buttonProps={this.props.viewsMenuButtonProps}
						disabled={this.props.disabled}
						views={this.state.views || []}
						schema={this.props.schema}
						setFilters={filters => this.setFilters(filters)}
						deleteView={view => this.deleteView(view)}
					/>
				</Flex>

				{this.state.showModal && (
					<div>
						<Modal
							title="Filter by"
							cancel={() => this.setState({ showModal: false })}
							done={() => this.addFilter()}
							action="Save"
						>
							{map(this.state.edit, ({ field, operator, value }, index) => {
								const operators = this.getOperators(field);

								return (
									<RelativeBox key={index}>
										{index > 0 && <Txt my={2}>OR</Txt>}
										<Flex>
											<Select
												value={field}
												onChange={(v: any) =>
													this.setEditField(v.target.value, index)
												}
											>
												{map(
													this.props.schema.properties,
													(s: JSONSchema6, field) => (
														<option value={field}>{s.title || field}</option>
													),
												)}
											</Select>

											{operators.length === 1 && (
												<Txt mx={1} p="7px 20px 0">
													{operators[0].label}
												</Txt>
											)}

											{operators.length > 1 && (
												<Select
													ml={1}
													value={operator}
													onChange={(v: any) =>
														this.setEditOperator(v.target.value, index)
													}
												>
													{map(operators, ({ slug, label }) => (
														<option value={slug}>{label}</option>
													))}
												</Select>
											)}

											<FilterInput
												operator={operator}
												value={value}
												schema={
													this.props.schema.properties![field] as JSONSchema6
												}
												onUpdate={(v: any) => this.setEditValue(v, index)}
											/>
										</Flex>
										{index > 0 && (
											<ExtraRuleDeleteBtn
												onClick={() => this.removeCompound(index)}
											/>
										)}
									</RelativeBox>
								);
							})}
							<Button
								mb={2}
								mt={4}
								primary
								underline
								onClick={() => this.addCompound()}
							>
								Add alternative
							</Button>
						</Modal>
					</div>
				)}

				{!!filters.length &&
					!this.props.disabled && (
						<Summary
							edit={(filter: JSONSchema6) => this.editFilter(filter)}
							delete={(filter: JSONSchema6) => this.removeFilter(filter)}
							saveView={(name, scope) => this.saveView(name, scope)}
							filters={filters}
							views={this.state.views || []}
							schema={this.props.schema}
							dark={!!this.props.dark}
						/>
					)}
			</FilterWrapper>
		);
	}
}

export default Filters;
