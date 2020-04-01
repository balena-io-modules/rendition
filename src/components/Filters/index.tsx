import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSONSchema6 } from 'json-schema';
import castArray from 'lodash/castArray';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import reject from 'lodash/reject';
import * as React from 'react';
import styled from 'styled-components';
import { Button, ButtonProps } from '../../';
import { DefaultProps } from '../../common-types';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { randomString } from '../../utils';
import { Box } from '../Box';
import { DropDownButtonProps } from '../DropDownButton';
import { Flex } from '../Flex';
import Search from '../Search';
import { FilterModal } from './FilterModal';
import * as SchemaSieve from './SchemaSieve';
import Summary from './Summary';
import ViewsMenu from './ViewsMenu';

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

const Filters = ({
	filters,
	views,
	schema,
	disabled,
	viewScopes,
	onFiltersUpdate,
	onViewsUpdate,
	addFilterButtonProps,
	viewsMenuButtonProps,
	renderMode,
	dark,
	compact,
}: FiltersProps) => {
	const flatSchema = SchemaSieve.flattenSchema(schema);
	console.log(schema, flatSchema, 'qui');
	const flatViews = flattenViews(views || []);
	const flatFilters = (filters || []).map(filter =>
		SchemaSieve.flattenSchema(filter),
	);
	const shouldHideLabel = useBreakpoint(compact || [false]);

	const [filtersState, setFiltersState] = React.useState<FiltersState>({
		showModal: false,
		searchString: '',
		editingFilter: null,
		filters: flatFilters,
		views: flatViews,
		schema: flatSchema,
		edit: [SchemaSieve.getCleanEditModel(flatSchema)],
		shouldParentUpdate: false,
	});
	// unfortunately we have to keep all these useEffects in order
	// to synchronize the state of this component with that of the parent
	React.useEffect(() => {
		if (filtersState.shouldParentUpdate && onFiltersUpdate) {
			onFiltersUpdate(
				filtersState.filters.map(filter => SchemaSieve.unflattenSchema(filter)),
			);
		}
	}, [filtersState.filters]);

	React.useEffect(() => onViewsUpdate && onViewsUpdate(filtersState.views), [
		filtersState.views,
	]);

	React.useEffect(() => {
		if (!isEqual(filtersState, flatFilters)) {
			setFiltersState(prevState => ({
				...prevState,
				filters: flatFilters,
				shouldParentUpdate: false,
			}));
		}
	}, [filters]);

	React.useEffect(() => {
		if (!isEqual(filtersState.views, flatViews)) {
			setFiltersState(prevState => ({
				...prevState,
				views: flatViews,
				shouldParentUpdate: false,
			}));
		}
	}, [views]);

	React.useEffect(() => {
		if (!isEqual(filtersState.schema, flatSchema)) {
			setFiltersState(prevState => ({
				...prevState,
				schema: flatSchema,
				shouldParentUpdate: false,
			}));
		}
	}, [schema]);

	const addFilter = (edit: EditModel[]) => {
		const newFilter = SchemaSieve.createFilter(schema, edit);
		const currentFilters: JSONSchema6[] = !!filtersState.editingFilter
			? filtersState.filters.map(filter =>
					filter.$id === filtersState.editingFilter ? newFilter : filter,
			  )
			: [...filtersState.filters, newFilter];
		setFiltersState(prevState => ({
			...prevState,
			filters: currentFilters,
			edit: [SchemaSieve.getCleanEditModel(filtersState.schema)],
			showModal: false,
			shouldParentUpdate: true,
			editingFilter: null,
		}));
	};

	const editFilter = (filter: JSONSchema6) => {
		console.log(filter, schema, filtersState.schema);
		const signatures = SchemaSieve.decodeFilter(schema, filter);
		console.log(signatures);
		setFiltersState(prevState => ({
			...prevState,
			edit: signatures as EditModel[],
			showModal: true,
			shouldParentUpdate: false,
			editingFilter: filter.$id as string,
		}));
	};

	const removeFilter = ({ $id, title }: JSONSchema6) => {
		setFiltersState(prevState => ({
			...prevState,
			searchString:
				title === SchemaSieve.FULL_TEXT_SLUG ? '' : prevState.searchString,
			filters: reject(prevState.filters, { $id }) as JSONSchema6[],
			shouldParentUpdate: true,
		}));
	};

	const clearAllFilters = () => {
		setFiltersState(prevState => ({
			...prevState,
			searchString: '',
			filters: [],
			shouldParentUpdate: true,
		}));
	};

	const saveView = (name: string, scope: string | null) => {
		const view: FiltersView = {
			id: randomString(),
			name,
			scope,
			filters: filtersState.filters,
		};
		setFiltersState(prevState => ({
			...prevState,
			views: [...prevState.views, view],
			shouldParentUpdate: true,
		}));
	};

	const deleteView = ({ id }: FiltersView) => {
		setFiltersState(prevState => ({
			...prevState,
			views: reject(prevState.views, { id }),
			shouldParentUpdate: true,
		}));
	};

	const setSimpleSearch = (term: string) => {
		const newFilters = term
			? SchemaSieve.upsertFullTextSearch(
					filtersState.schema,
					filtersState.filters,
					term,
			  )
			: SchemaSieve.removeFullTextSearch(filtersState.filters);

		setFiltersState(prevState => ({
			...prevState,
			filters: newFilters,
			searchString: term,
			shouldParentUpdate: true,
		}));
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
						onClick={() => {
							setFiltersState(prevState => ({
								...prevState,
								editingFilter: null,
								showModal: true,
								shouldParentUpdate: false,
							}));
						}}
						{...addFilterButtonProps}
						label={shouldHideLabel ? undefined : 'Add filter'}
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
						views={filtersState.views || flatViews}
						schema={schema}
						hasMultipleScopes={viewScopes && viewScopes.length > 1}
						setFilters={filters =>
							setFiltersState(prevState => ({
								...prevState,
								filters,
								shouldParentUpdate: true,
							}))
						}
						deleteView={view => deleteView(view)}
						renderMode={renderMode}
						shouldHideLabel={shouldHideLabel}
					/>
				)}
			</Flex>

			{filtersState.showModal && (
				<FilterModal
					addFilter={edit => addFilter(edit)}
					onClose={() =>
						setFiltersState(prevState => ({ ...prevState, showModal: false }))
					}
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
						views={filtersState.views}
						schema={filtersState.schema}
					/>
				)}
		</FilterWrapper>
	);
};

export interface FiltersState {
	showModal: boolean;
	searchString: string;
	editingFilter: string | null;
	filters: JSONSchema6[];
	views: FiltersView[];
	schema: JSONSchema6;
	edit: EditModel[];
	shouldParentUpdate: boolean;
}

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
