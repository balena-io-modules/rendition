import React from 'react';

import { AutoUIAction, AutoUIModel, AutoUIBaseResource } from './schemaOps';
import { ResourceTagModelService } from '../../components/TagManagementModal/tag-management-service';
import { Format } from '../../components/Renderer/types';
import { Dictionary } from '../../common-types';
import { LensTemplate } from './Lenses';
import { AutoUICollection } from './Collection';
import { AutoUIEntity } from './Entity';

export interface AutoUIProps<T> {
	/** Model is the property that describe the data to display with a JSON structure */
	model: AutoUIModel<T>;
	/** Array of data or data entity to display */
	data: T[] | T | undefined;
	/** Formats are custom widgets to render in the table cell. The type of format to display is described in the model. */
	formats?: Format[];
	/** Actions is an array of actions applicable on the selected items */
	actions?: Array<AutoUIAction<T>>;
	/** The sdk is used to pass the method to handle tags when added removed or updated */
	sdk?: {
		tags?: ResourceTagModelService;
	};
	/** Dictionary of {[column_property]: customFunction} where the customFunction is the function to sort data on column header click */
	customSort?: Dictionary<(a: T, b: T) => void>;
	// TODO: Ideally the base URL is autogenerated, but there are some issues with that currently (eg. instead of application we have apps in the URL)
	/** Redirect on entity click */
	getBaseUrl?: (entry: T) => string;
	/** Method to refresh the collection when something is changed */
	refresh?: () => void;
	/** Event emitted on entity click */
	onEntityClick?: (
		entry: T,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => void;
	/** All the lenses available for this AutoUI component. Any default lenses will automatically be added to this array. */
	customLenses?: LensTemplate[];
	/** Additional context for picking the right lens */
	lensContext?: object;
}

export const AutoUI = <T extends AutoUIBaseResource<T>>({
	model,
	data,
	formats,
	actions,
	sdk,
	customSort,
	refresh,
	getBaseUrl,
	onEntityClick,
	customLenses,
	lensContext,
}: AutoUIProps<T>) => {
	if (!data) {
		return null;
	}
	return Array.isArray(data) ? (
		<AutoUICollection<T>
			formats={formats}
			data={data}
			model={model}
			sdk={sdk}
			refresh={refresh}
			getBaseUrl={getBaseUrl}
			actions={actions}
			customSort={customSort}
			customLenses={customLenses}
			onEntityClick={onEntityClick}
			lensContext={lensContext}
		/>
	) : (
		<AutoUIEntity
			formats={formats}
			data={data}
			model={model}
			sdk={sdk}
			actions={actions}
			customLenses={customLenses}
			lensContext={lensContext}
		/>
	);
};
