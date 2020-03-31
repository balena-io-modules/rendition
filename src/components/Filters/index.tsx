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
	const flatViews = flattenViews(views || []);
	const flatFilters = (filters || []).map(filter =>
		SchemaSieve.flattenSchema(filter),
	);
	const shouldHideLabel = useBreakpoint(compact || [false]);

	const [showModal, setshowModal] = React.useState<boolean>(false);
	const [searchString, setSearchString] = React.useState<string>('');
	const [editingFilter, setEditingFilter] = React.useState<string | null>();
	const [filtersState, setFiltersState] = React.useState<JSONSchema6[]>(
		flatFilters,
	);
	const [viewsState, setViewsState] = React.useState<FiltersView[]>(flatViews);
	const [schemaState, setschemaState] = React.useState<JSONSchema6>(flatSchema);
	const [edit, setEdit] = React.useState<EditModel[]>([
		SchemaSieve.getCleanEditModel(flatSchema),
	]);

	// unfortunately we have to keep all these useEffects in order
	// to synchronize the state of this component with that of the parent
	React.useEffect(
		() =>
			onFiltersUpdate &&
			onFiltersUpdate(
				filtersState.map(filter => SchemaSieve.unflattenSchema(filter)),
			),
		[filtersState, searchString],
	);

	React.useEffect(() => onViewsUpdate && onViewsUpdate(viewsState), [
		viewsState,
	]);

	React.useEffect(() => {
		if (!isEqual(filtersState, flatFilters)) {
			setFiltersState(flatFilters);
		}
	}, [filters]);

	React.useEffect(() => {
		if (!isEqual(viewsState, flatViews)) {
			setViewsState(flatViews);
		}
	}, [views]);

	React.useEffect(() => {
		if (!isEqual(schemaState, flatSchema)) {
			setschemaState(flatSchema);
		}
	}, [schema]);

	const addFilter = (edit: EditModel[]) => {
		const newFilter = SchemaSieve.createFilter(schema, edit);
		const currentFilters: JSONSchema6[] = !!editingFilter
			? filtersState.map(filter =>
					filter.$id === editingFilter ? newFilter : filter,
			  )
			: [...filtersState, newFilter];

		setFiltersState(currentFilters);
		setEdit([SchemaSieve.getCleanEditModel(schemaState)]);
		setshowModal(false);
		setEditingFilter(null);
	};

	const editFilter = (filter: JSONSchema6) => {
		const signatures = SchemaSieve.decodeFilter(schemaState, filter);
		setEdit(signatures as EditModel[]);
		setEditingFilter(filter.$id);
		setshowModal(true);
	};

	const removeFilter = ({ $id, title }: JSONSchema6) => {
		if (title === SchemaSieve.FULL_TEXT_SLUG) {
			setSearchString('');
		}
		setFiltersState(reject(filtersState, { $id }));
	};

	const clearAllFilters = () => {
		setFiltersState([]);
		setSearchString('');
	};

	const saveView = (name: string, scope: string | null) => {
		const view: FiltersView = {
			id: randomString(),
			name,
			scope,
			filters: filtersState,
		};
		setViewsState(prevViews => [...prevViews, view]);
	};

	const deleteView = ({ id }: FiltersView) => {
		setViewsState(reject(viewsState, { id }));
	};

	const setSimpleSearch = (term: string) => {
		const newFilters = term
			? SchemaSieve.upsertFullTextSearch(schemaState, filtersState, term)
			: SchemaSieve.removeFullTextSearch(filtersState);

		setSearchString(term);
		setFiltersState(newFilters);
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
							setshowModal(true);
							setEditingFilter(null);
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
							value={searchString}
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
						views={viewsState || flatViews}
						schema={schema}
						hasMultipleScopes={viewScopes && viewScopes.length > 1}
						setFilters={filters => setFiltersState(filters)}
						deleteView={view => deleteView(view)}
						renderMode={renderMode}
						shouldHideLabel={shouldHideLabel}
					/>
				)}
			</Flex>

			{showModal && (
				<FilterModal
					addFilter={edit => addFilter(edit)}
					onClose={() => setshowModal(false)}
					schema={schemaState}
					edit={edit}
				/>
			)}

			{shouldRenderComponent('summary', renderMode) &&
				!!filtersState.length &&
				!disabled && (
					<Summary
						scopes={viewScopes}
						edit={(filter: JSONSchema6) => editFilter(filter)}
						delete={(filter: JSONSchema6) => removeFilter(filter)}
						saveView={(name, scope) => saveView(name, scope)}
						clearAllFilters={clearAllFilters}
						filters={filtersState}
						views={viewsState}
						schema={schemaState}
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
