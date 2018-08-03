import { JSONSchema6 } from 'json-schema';
import castArray = require('lodash/castArray');
import cloneDeep = require('lodash/cloneDeep');
import findIndex = require('lodash/findIndex');
import includes = require('lodash/includes');
import isEmpty = require('lodash/isEmpty');
import isEqual = require('lodash/isEqual');
import map = require('lodash/map');
import reject = require('lodash/reject');
import * as React from 'react';
import { FaFilter } from 'react-icons/lib/fa';
import { FilterRenderMode, FiltersProps, FiltersView } from 'rendition';
import styled from 'styled-components';
import * as utils from '../../utils';
import Button from '../Button';
import { getDataModel } from '../DataTypes';
import DeleteBtn from '../DeleteButton';
import { Box, Flex } from '../Grid';
import Modal from '../Modal';
import Search from '../Search';
import Select from '../Select';
import Txt from '../Txt';
import * as SchemaSieve from './SchemaSieve';
import Summary from './Summary';
import ViewsMenu from './ViewsMenu';

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

const SearchWrapper = styled.div`
	flex-basis: 500px;
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
	schema: JSONSchema6;
}

class Filters extends React.Component<FiltersProps, FiltersState> {
	constructor(props: FiltersProps) {
		super(props);
		const { filters = [], schema, views = [] } = this.props;

		const flatSchema = SchemaSieve.flattenSchema(schema);
		const flatViews = this.flattenViews(views);
		const flatFilters = filters.map(filter =>
			SchemaSieve.flattenSchema(filter),
		);

		this.state = {
			showModal: false,
			searchString: '',
			editingFilter: null,
			filters: flatFilters,
			views: flatViews,
			schema: flatSchema,
			edit: [],
		};

		this.state.edit.push(this.getCleanEditModel());
	}

	componentWillReceiveProps(nextProps: FiltersProps) {
		const newState: any = {};

		// If the schema prop updates, also update the internal 'flat' schema
		if (!isEqual(nextProps.schema, this.props.schema)) {
			newState.schema = SchemaSieve.flattenSchema(nextProps.schema);
		}

		if (!isEqual(nextProps.filters, this.props.filters)) {
			const filters = nextProps.filters || [];
			newState.filters = filters.map(filter =>
				SchemaSieve.flattenSchema(filter),
			);
		}

		if (!isEqual(nextProps.views, this.props.views)) {
			const views = nextProps.views || [];
			newState.views = this.flattenViews(views);
		}

		if (!isEmpty(newState)) {
			this.setState(newState);
		}
	}

	flattenViews(views: FiltersView[]) {
		return views.map(({ filters, ...view }) => ({
			...view,
			filters: filters.map(filter => SchemaSieve.flattenSchema(filter)),
		}));
	}

	emitViewsUpdate() {
		if (!this.props.onViewsUpdate) {
			return;
		}

		this.props.onViewsUpdate(
			this.state.views.map(({ filters, ...view }) => ({
				...view,
				filters: filters.map(filter => SchemaSieve.unflattenSchema(filter)),
			})),
		);
	}

	getCleanEditModel(field?: string | null) {
		const schema = this.state.schema;
		if (!field) {
			field = Object.keys(schema.properties!).shift()!;
		}

		const fieldOperators = this.getOperators(field);
		if (!fieldOperators.length) {
			return {
				field,
				operator: '',
				value: '',
			};
		}

		const operator = fieldOperators.shift()!.slug;

		let value: any = '';
		const subschema = schema.properties![field];
		if (typeof subschema !== 'boolean') {
			if (subschema.enum) {
				value = subschema.enum[0] || '';
			}

			if (subschema.type === 'boolean') {
				value = true;
			}
		}

		return {
			field,
			operator,
			value,
		};
	}

	getOperators(field: string) {
		const schema = this.state.schema;
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

	emitFilterUpdate() {
		if (!this.props.onFiltersUpdate) {
			return;
		}

		this.props.onFiltersUpdate(
			this.state.filters.map(filter => SchemaSieve.unflattenSchema(filter)),
		);
	}

	addFilter() {
		const $id = this.state.editingFilter;
		const { schema } = this.state;
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
			() => this.emitFilterUpdate(),
		);
	}

	editFilter(filter: JSONSchema6) {
		const { schema } = this.state;

		const signatures = SchemaSieve.decodeFilter(schema, filter);

		this.setState({
			edit: signatures as EditModel[],
			editingFilter: filter.$id!,
			showModal: true,
		});
	}

	removeFilter({ $id, title }: JSONSchema6) {
		this.setState(
			prevState => {
				const newState = {
					...prevState,
					filters: reject(prevState.filters, { $id }),
				};

				if (title === SchemaSieve.FULL_TEXT_SLUG) {
					newState.searchString = '';
				}

				return newState;
			},
			() => this.emitFilterUpdate(),
		);
	}

	setFilters(filters: JSONSchema6[]) {
		this.setState({ filters }, () => this.emitFilterUpdate());
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
		this.setState(
			prevState => {
				const newFilters = term
					? SchemaSieve.upsertFullTextSearch(
							this.state.schema,
							prevState.filters,
							term,
						)
					: SchemaSieve.removeFullTextSearch(prevState.filters);

				return {
					searchString: term,
					filters: newFilters,
				};
			},
			() => this.emitFilterUpdate(),
		);
	}

	shouldRenderComponent(mode: FilterRenderMode): boolean {
		// If a render mode is not specified, render all components
		if (!this.props.renderMode) {
			return true;
		}

		const allowedModes = castArray(this.props.renderMode);

		if (includes(allowedModes, 'all')) {
			return true;
		}

		return includes(allowedModes, mode);
	}

	render() {
		const { filters } = this.state;

		return (
			<FilterWrapper mb={3}>
				<Flex justify="space-between">
					{this.shouldRenderComponent('add') && (
						<Button
							mr={30}
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
					)}

					{this.shouldRenderComponent('search') && (
						<SearchWrapper>
							<Search
								dark={this.props.dark}
								disabled={this.props.disabled}
								value={this.state.searchString}
								onChange={e => this.setSimpleSearch(e.target.value)}
							/>
						</SearchWrapper>
					)}

					{this.shouldRenderComponent('views') && (
						<ViewsMenu
							buttonProps={this.props.viewsMenuButtonProps}
							disabled={this.props.disabled}
							views={this.state.views || []}
							schema={this.props.schema}
							setFilters={filters => this.setFilters(filters)}
							deleteView={view => this.deleteView(view)}
							renderMode={this.props.renderMode}
						/>
					)}
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
													this.state.schema.properties,
													(s: JSONSchema6, field) => (
														<option key={field} value={field}>
															{s.title || field}
														</option>
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
														<option key={slug} value={slug}>
															{label}
														</option>
													))}
												</Select>
											)}

											<FilterInput
												operator={operator}
												value={value}
												schema={
													this.state.schema.properties![field] as JSONSchema6
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

				{this.shouldRenderComponent('summary') &&
					!!filters.length &&
					!this.props.disabled && (
						<Summary
							edit={(filter: JSONSchema6) => this.editFilter(filter)}
							delete={(filter: JSONSchema6) => this.removeFilter(filter)}
							saveView={(name, scope) => this.saveView(name, scope)}
							filters={filters}
							views={this.state.views || []}
							schema={this.state.schema}
							dark={!!this.props.dark}
						/>
					)}
			</FilterWrapper>
		);
	}
}

export default Filters;
