import React from 'react';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import { Button, ButtonProps } from '../Button';
import { DropDownButtonProps } from '../DropDownButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import ViewsMenu from './ViewsMenu';
import styled from 'styled-components';
import { Box } from '../Box';
import { Search } from '../Search';
import { Flex } from '../Flex';
import { FilterModal } from './FilterModal';
import { Summary } from './Summary';
import { onClickOutOrEsc, randomString } from '../../utils';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import {
	createFullTextSearchFilter,
	Operator,
	OperatorSlugs,
} from './SchemaSieve';

const SearchWrapper = styled(Box)`
	width: 100%;
	flex-basis: 100%;
	position: relative;
	margin-right: 4px;
	padding: 0 4px;
	align-self: center;
`;

export interface FilterSignature {
	title: string | undefined;
	field: string;
	operator: Operator<OperatorSlugs>;
	value: any;
	refScheme?: string;
}

export interface FilterFieldOption {
	field: string;
	title: string;
}

export type FilterFieldCompareFn = (
	a: FilterFieldOption,
	b: FilterFieldOption,
) => number;

export type FilterRenderMode = 'all' | 'add' | 'search' | 'views' | 'summary';

export interface FiltersView {
	id: string;
	name: string;
	filters: JSONSchema[];
}

export interface FiltersProps {
	/** If true, disable the entire `Filters` interface */
	disabled?: boolean;
	/** An array of json schemas to be displayed as the currently selected filters, typically used when loading filters from storage */
	filters?: JSONSchema[];
	/** An array of views, as described above, typically used when loading views from storage */
	views?: FiltersView[];
	/** A function that is called when filters are updated */
	onFiltersUpdate?: (filters: JSONSchema[]) => void;
	/** A function that is called when views are updated */
	onViewsUpdate?: (views: FiltersView[]) => void;
	/** A function that is called when pressing serach on searchbar */
	onSearch?: (searchTerm: string) => React.ReactElement | null;
	/** A json schema describing the shape of the objects you want to filter */
	schema: JSONSchema;
	/** Properties that are passed to the "Add filter" button, these are the same props used for the [`Button`](#button) component */
	addFilterButtonProps?: ButtonProps;
	/** Properties that are passed to the "Views" button, these are the same props used for the [DropDownButton](#dropdownbutton) component */
	viewsMenuButtonProps?: DropDownButtonProps;
	/** Controls which parts of the Filters interface are displayed. One of `all`, `add`, `search`, `views`, `summary`, or an array containing any of these values */
	renderMode?: FilterRenderMode | FilterRenderMode[];
	/** If true, Set the `Filters` component against a dark background */
	dark?: boolean;
	/** Accept a boolean for each rendition breakpoint. If true remove `Filters` labels */
	compact?: boolean[];
	/** An optional callback used to sort filter field options */
	filterFieldCompareFn?: FilterFieldCompareFn;
}

export const Filters = ({
	disabled,
	filters,
	views,
	schema,
	addFilterButtonProps,
	viewsMenuButtonProps,
	renderMode,
	dark,
	compact,
	onViewsUpdate,
	onFiltersUpdate,
	onSearch,
}: FiltersProps) => {
	const searchContainer = React.createRef<HTMLDivElement>();
	const [showFilterModal, setShowFilterModal] = React.useState(false);
	const [showSearchDropDown, setShowSearchDropDown] = React.useState(false);
	const [searchString, setSearchString] = React.useState<string | undefined>();
	const [internalFilters, setFilters] = React.useState<JSONSchema[]>(
		filters ?? [],
	);
	const [internalViews, setViews] = React.useState<FiltersView[] | undefined>(
		views,
	);
	const [editFilter, setEditFilter] = React.useState<JSONSchema>();

	React.useEffect(() => {
		if (isEqual(internalFilters, filters ?? [])) {
			return;
		}
		setFilters(filters ?? []);
	}, [filters]);

	React.useEffect(() => {
		if (isEqual(internalViews, views)) {
			return;
		}
		setViews(views);
	}, [views]);

	const deleteView = (view: FiltersView) => {
		if (!internalViews) {
			return;
		}
		const newViews = internalViews.filter((i) => i.id !== view.id);
		setViews(newViews);
		onViewsUpdate?.(newViews);
	};

	const addFilter = (filter: JSONSchema) => {
		let newFilters = internalFilters ?? [];
		if (editFilter?.$id) {
			newFilters = newFilters.filter((f) => f.$id !== editFilter.$id);
		}
		newFilters = [...newFilters, filter];
		setFilters(newFilters);
		onFiltersUpdate?.(newFilters);
	};

	const deleteFilter = (filter: JSONSchema) => {
		const newFilters =
			internalFilters?.filter((f) => f.$id !== filter.$id) ?? [];
		setFilters(newFilters);
		onFiltersUpdate?.(newFilters);
	};

	const saveView = (name: string) => {
		const view: FiltersView = {
			id: randomString(),
			name,
			filters: cloneDeep(filters) ?? [],
		};
		const newViews = [...(internalViews ?? []), view];
		setViews(newViews);
		onViewsUpdate?.(newViews);
	};

	return (
		<Box style={{ position: 'relative' }}>
			<Flex flex="1">
				{(!renderMode || renderMode.includes('search')) && (
					<SearchWrapper
						ref={searchContainer}
						onFocus={() => {
							setShowSearchDropDown(true);
							if (searchContainer.current) {
								onClickOutOrEsc(searchContainer.current, () => {
									setShowSearchDropDown(false);
								});
							}
						}}
					>
						<Search
							dark={dark}
							disabled={disabled}
							value={searchString}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setShowSearchDropDown(e.target.value !== '');
								setSearchString(e.target.value);
							}}
							onEnter={() => {
								if (!searchString) {
									return;
								}
								const newFilter = createFullTextSearchFilter(
									schema,
									searchString,
								);
								addFilter(newFilter);
								setSearchString('');
							}}
						/>
						{searchString && showSearchDropDown && onSearch?.(searchString)}
					</SearchWrapper>
				)}
				{(!renderMode || renderMode.includes('add')) && (
					<Button
						disabled={disabled}
						light={dark}
						outline
						quartenary
						icon={<FontAwesomeIcon icon={faFilter} />}
						onClick={() => setShowFilterModal(true)}
						label="Add filter"
						compact={compact}
						{...addFilterButtonProps}
					/>
				)}
				{(!renderMode || renderMode.includes('views')) && (
					<ViewsMenu
						dark={dark}
						buttonProps={viewsMenuButtonProps}
						disabled={disabled}
						views={views || []}
						schema={schema}
						renderMode={renderMode}
						setFilters={(f) => {
							setFilters(f);
							onFiltersUpdate?.(f);
						}}
						deleteView={deleteView}
						compact={compact}
					/>
				)}
			</Flex>
			{(!renderMode || renderMode.includes('summary')) &&
				internalFilters.length > 0 &&
				!disabled && (
					<Summary
						onEdit={(filter) => {
							setEditFilter(filter);
							setShowFilterModal(true);
						}}
						onDelete={deleteFilter}
						onClearFilters={() => {
							setFilters([]);
							onFiltersUpdate?.([]);
						}}
						onSaveView={({ name }) => saveView(name)}
						filters={internalFilters}
					/>
				)}
			{showFilterModal && (
				<FilterModal
					schema={schema}
					editFilter={editFilter}
					addFilter={(filter) => {
						addFilter(filter);
						setShowFilterModal(false);
					}}
					onClose={() => setShowFilterModal(false)}
				/>
			)}
		</Box>
	);
};
