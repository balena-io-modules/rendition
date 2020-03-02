import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSONSchema6 } from 'json-schema';
import castArray from 'lodash/castArray';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import includes from 'lodash/includes';
import reject from 'lodash/reject';
import * as React from 'react';
import styled from 'styled-components';
import { Button, ButtonProps } from '../../';
import { DefaultProps } from '../../common-types';
import { randomString } from '../../utils';
import { Box } from '../Box';
import { DropDownButtonProps } from '../DropDownButton';
import { Flex } from '../Flex';
import Search from '../Search';
import * as SchemaSieve from './SchemaSieve';
import Summary from './Summary';
import ViewsMenu from './ViewsMenu';
import { FilterModal } from './FilterModal';

const SearchWrapper = styled.div`
	flex-basis: 500px;
`;

const FilterWrapper = styled(Box)`
	position: relative;
`;

const flattenViews = (views: FiltersView[]) => {
	return views.map(({ filters, ...view }) => ({
		...view,
		filters: filters.map(filter => SchemaSieve.flattenSchema(filter)),
	}));
};

const Filters = ({
	filters = [],
	schema,
	views = [],
	disabled,
	viewScopes,
	onFiltersUpdate,
	onViewsUpdate,
	addFilterButtonProps,
	viewsMenuButtonProps,
	renderMode,
	dark,
}: FiltersProps) => {
	const flatSchema = SchemaSieve.flattenSchema(schema);
	const flatViews = flattenViews(views);
	const flatFilters = filters.map(filter => SchemaSieve.flattenSchema(filter));

	const [filtersState, setFiltersState] = React.useState<FiltersState>({
		showModal: false,
		searchString: '',
		editingFilter: null,
		filters: flatFilters,
		views: flatViews,
		schema: flatSchema,
		edit: [],
	});

	React.useEffect(() => {
		filtersState.edit.push(SchemaSieve.getCleanEditModel(filtersState.schema));
	}, []);

	React.useEffect(() => {
		setFiltersState({
			...filtersState,
			schema: SchemaSieve.flattenSchema(schema),
		});
	}, [schema]);

	React.useEffect(() => {
		setFiltersState({
			...filtersState,
			filters: filters.map(filter => SchemaSieve.flattenSchema(filter)),
		});
	}, [filters.length]);

	React.useEffect(() => {
		setFiltersState({
			...filtersState,
			views: flattenViews(views),
		});
	}, [views.length]);

	React.useEffect(() => {
		if (!onFiltersUpdate) {
			return;
		}

		onFiltersUpdate(
			filtersState.filters.map(filter => SchemaSieve.unflattenSchema(filter)),
		);
	}, [filtersState.filters.length]);

	React.useEffect(() => {
		return onViewsUpdate && onViewsUpdate(filtersState.views);
	}, [filtersState.views.length]);

	const addFilter = (edit: EditModel[]) => {
		const $id = filtersState.editingFilter;
		const { schema } = filtersState;
		const filter = SchemaSieve.createFilter(schema, edit);
		const currentFilters = filtersState.filters;

		let filters: JSONSchema6[];

		if (!!$id) {
			const matchIndex = findIndex(currentFilters, { $id });
			currentFilters.splice(matchIndex, 1, filter);
			filters = currentFilters.slice();
		} else {
			filters = currentFilters.concat(filter);
		}

		setFiltersState({
			...filtersState,
			filters,
			edit: [SchemaSieve.getCleanEditModel(filtersState.schema)],
			showModal: false,
			editingFilter: null,
		});
	};

	const editFilter = (filter: JSONSchema6) => {
		const { schema } = filtersState;

		const signatures = SchemaSieve.decodeFilter(schema, filter);

		setFiltersState({
			...filtersState,
			edit: signatures as EditModel[],
			editingFilter: filter.$id!,
			showModal: true,
		});
	};

	const removeFilter = ({ $id, title }: JSONSchema6) => {
		const newState = {
			...filtersState,
			filters: reject(filtersState.filters, { $id }),
		};

		if (title === SchemaSieve.FULL_TEXT_SLUG) {
			newState.searchString = '';
		}
		setFiltersState(newState);
	};

	const clearAllFilters = () => {
		setFiltersState({
			...filtersState,
			filters: [],
			searchString: '',
		});
	};

	const saveView = (name: string, scope: string | null) => {
		const view: FiltersView = {
			id: randomString(),
			name,
			scope,
			filters: cloneDeep(filtersState.filters),
		};

		setFiltersState({
			...filtersState,
			views: [...filtersState.views, view],
		});
	};

	const deleteView = ({ id }: FiltersView) => {
		setFiltersState({
			...filtersState,
			views: reject(filtersState.views, { id }),
		});
	};

	const setSimpleSearch = (term: string) => {
		const newFilters = term
			? SchemaSieve.upsertFullTextSearch(
					filtersState.schema,
					filtersState.filters,
					term,
			  )
			: SchemaSieve.removeFullTextSearch(filtersState.filters);
		setFiltersState({
			...filtersState,
			searchString: term,
			filters: newFilters,
		});
	};

	const shouldRenderComponent = (
		mode: FilterRenderMode,
		renderMode?: FilterRenderMode | FilterRenderMode[],
	): boolean => {
		// If a render mode is not specified, render all components
		if (!renderMode) {
			return true;
		}

		const allowedModes = castArray(renderMode);

		if (includes(allowedModes, 'all')) {
			return true;
		}

		return includes(allowedModes, mode);
	};

	return (
		<FilterWrapper mb={3}>
			<Flex justifyContent="space-between">
				{shouldRenderComponent('add', renderMode) && (
					<Button
						mr={30}
						disabled={disabled}
						primary
						icon={<FontAwesomeIcon icon={faFilter} />}
						onClick={() =>
							setFiltersState({
								...filtersState,
								showModal: true,
								editingFilter: null,
							})
						}
						{...addFilterButtonProps}
						label={'Add filter'}
					></Button>
				)}

				{shouldRenderComponent('search', renderMode) && (
					<SearchWrapper>
						<Search
							dark={dark}
							disabled={disabled}
							value={filtersState.searchString}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setSimpleSearch(e.target.value)
							}
						/>
					</SearchWrapper>
				)}

				{shouldRenderComponent('views', renderMode) && (
					<ViewsMenu
						dark={dark}
						buttonProps={viewsMenuButtonProps}
						disabled={disabled}
						views={filtersState.views || []}
						schema={schema}
						hasMultipleScopes={viewScopes && viewScopes.length > 1}
						setFilters={filters =>
							setFiltersState({ ...filtersState, filters })
						}
						deleteView={view => deleteView(view)}
						renderMode={renderMode}
						shouldShowLabel={true}
					/>
				)}
			</Flex>

			{filtersState.showModal && (
				<FilterModal
					addFilter={edit => addFilter(edit)}
					onClose={() => setFiltersState({ ...filtersState, showModal: false })}
					schema={filtersState.schema}
					edit={filtersState.edit}
				/>
			)}

			{shouldRenderComponent('summary', renderMode) &&
				!!filtersState.filters.length &&
				!disabled && (
					<Summary
						scopes={viewScopes}
						edit={(filter: JSONSchema6) => editFilter(filter)}
						delete={(filter: JSONSchema6) => removeFilter(filter)}
						saveView={(name, scope) => saveView(name, scope)}
						clearAllFilters={clearAllFilters}
						filters={filtersState.filters}
						views={filtersState.views || []}
						schema={filtersState.schema}
					/>
				)}
		</FilterWrapper>
	);
};

export interface EditModel {
	field: string;
	operator: string;
	value: string | number | { [k: string]: string };
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
	compact?: boolean[];
}

export default Filters;
