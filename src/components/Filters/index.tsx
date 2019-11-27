import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSONSchema6 } from 'json-schema';
import castArray from 'lodash/castArray';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import reject from 'lodash/reject';
import * as React from 'react';
import styled from 'styled-components';
import { Button, ButtonProps } from '../../';
import { DefaultProps } from '../../common-types';
import * as utils from '../../utils';
import { Box } from '../Box';
import { getDataModel } from '../DataTypes';
import { DropDownButtonProps } from '../DropDownButton';
import { Flex } from '../Flex';
import Modal from '../Modal';
import Search from '../Search';
import Select from '../Select';
import Txt from '../Txt';
import * as SchemaSieve from './SchemaSieve';
import Summary from './Summary';
import ViewsMenu from './ViewsMenu';

const FilterInput = (props: FilterInputProps) => {
	const model = getDataModel(props.schema);

	if (!model) {
		return null;
	}

	const Edit = model.Edit as React.SFC<any>;

	return (
		<Edit
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

const DeleteButton = styled(Button)`
	color: rgba(0, 0, 0, 0.4);
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

	componentDidUpdate(prevProps: FiltersProps) {
		const newState: any = {};

		// If the schema prop updates, also update the internal 'flat' schema
		if (!isEqual(prevProps.schema, this.props.schema)) {
			newState.schema = SchemaSieve.flattenSchema(this.props.schema);
		}

		if (!isEqual(prevProps.filters, this.props.filters)) {
			const filters = this.props.filters || [];
			newState.filters = filters.map(filter =>
				SchemaSieve.flattenSchema(filter),
			);
		}

		if (!isEqual(prevProps.views, this.props.views)) {
			const views = this.props.views || [];
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

			if (subschema.oneOf) {
				value = (subschema.oneOf[0] as JSONSchema6).const || '';
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

	clearAllFilters = () => {
		this.setFilters([]);
		this.setState({
			searchString: '',
		});
	};

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
				<Flex justifyContent="space-between">
					{this.shouldRenderComponent('add') && (
						<Button
							mr={30}
							disabled={this.props.disabled}
							primary
							icon={<FontAwesomeIcon icon={faFilter} />}
							onClick={() =>
								this.setState({ showModal: true, editingFilter: null })
							}
							{...this.props.addFilterButtonProps}
						>
							Add filter
						</Button>
					)}

					{this.shouldRenderComponent('search') && (
						<SearchWrapper>
							<Search
								dark={this.props.dark}
								disabled={this.props.disabled}
								value={this.state.searchString}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									this.setSimpleSearch(e.target.value)
								}
							/>
						</SearchWrapper>
					)}

					{this.shouldRenderComponent('views') && (
						<ViewsMenu
							dark={this.props.dark}
							buttonProps={this.props.viewsMenuButtonProps}
							disabled={this.props.disabled}
							views={this.state.views || []}
							schema={this.props.schema}
							hasMultipleScopes={
								this.props.viewScopes && this.props.viewScopes.length > 1
							}
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
											<Box flex={1}>
												<Select<{ field: string; title: string }>
													options={map(
														this.state.schema.properties,
														(s: JSONSchema6, field) => ({
															field,
															title: s.title || field,
														}),
													)}
													valueKey="field"
													labelKey="title"
													// TODO: Remove this logic and pass the primitive value when this is fixed https://github.com/grommet/grommet/issues/3154
													value={
														this.state.schema.properties
															? {
																	field,
																	title:
																		(this.state.schema.properties[
																			field
																		] as JSONSchema6).title || field,
															  }
															: { field }
													}
													onChange={({ option }) =>
														this.setEditField(option.field, index)
													}
												/>
											</Box>
											{operators.length === 1 && (
												<Txt py={2} px={3} align="center">
													{operators[0].label}
												</Txt>
											)}
											{operators.length > 1 && (
												<Box flex={1} mx={1}>
													<Select<{ slug: string; label: any }>
														options={operators}
														valueKey="slug"
														labelKey="label"
														// TODO: Remove this logic and pass the primitive value when this is fixed: https://github.com/grommet/grommet/issues/3154
														value={operators.find(x => x.slug === operator)}
														onChange={({ option }) =>
															this.setEditOperator(option.slug, index)
														}
													/>
												</Box>
											)}
											<Box flex={1}>
												<FilterInput
													operator={operator}
													value={value}
													schema={
														this.state.schema.properties![field] as JSONSchema6
													}
													onUpdate={(v: any) => this.setEditValue(v, index)}
												/>
											</Box>
										</Flex>
										{index > 0 && (
											<DeleteButton
												plain
												fontSize={1}
												p={1}
												onClick={() => this.removeCompound(index)}
											>
												<FontAwesomeIcon icon={faTimes} />
											</DeleteButton>
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
							scopes={this.props.viewScopes}
							edit={(filter: JSONSchema6) => this.editFilter(filter)}
							delete={(filter: JSONSchema6) => this.removeFilter(filter)}
							saveView={(name, scope) => this.saveView(name, scope)}
							clearAllFilters={this.clearAllFilters}
							filters={filters}
							views={this.state.views || []}
							schema={this.state.schema}
						/>
					)}
			</FilterWrapper>
		);
	}
}

export interface EditModel {
	field: string;
	operator: string;
	value: string | number | { [k: string]: string };
}

export interface FilterInputProps {
	schema: JSONSchema6;
	value: any;
	operator: string;
	onUpdate: (value: any) => void;
}

export interface ViewScope {
	slug: string;
	name: string;
	label?: string;
}

export interface FiltersView {
	id: string;
	name: string;
	scope?: string | null;
	filters: JSONSchema6[];
}

export interface FilterSignature {
	field: string;
	operator: string;
	value: string | number | boolean | { [k: string]: string };
}

export type FilterRenderMode = 'all' | 'add' | 'search' | 'views' | 'summary';

export interface DataTypeModel {
	operators: {
		[key: string]: {
			getLabel: (schema: JSONSchema6) => string;
		};
	};
	decodeFilter(filter: JSONSchema6): null | FilterSignature;
	createFilter(
		field: string,
		operator: string,
		value: any,
		schema: JSONSchema6,
	): JSONSchema6;
	Edit(props: DataTypeEditProps): JSX.Element;
}

export interface DataTypeEditProps {
	schema: JSONSchema6;
	value?: any;
	onUpdate: (value: string | number | boolean) => void;
	operator: string;
	slim?: boolean;
}

export interface FiltersState {
	showModal: boolean;
	edit: EditModel[];
	editingFilter: string | null;
	searchString: string;
	filters: JSONSchema6[];
	views: FiltersView[];
	schema: JSONSchema6;
}

export interface FiltersProps extends DefaultProps {
	disabled?: boolean;
	filters?: JSONSchema6[];
	views?: FiltersView[];
	viewScopes?: ViewScope[];
	onFiltersUpdate?: (filters: JSONSchema6[]) => void;
	onViewsUpdate?: (views: FiltersView[]) => void;
	schema: JSONSchema6;
	addFilterButtonProps?: ButtonProps;
	viewsMenuButtonProps?: DropDownButtonProps;
	renderMode?: FilterRenderMode | FilterRenderMode[];
	dark?: boolean;
}

export default Filters;
