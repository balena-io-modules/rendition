import React from 'react';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import isEqual from 'lodash/isEqual';
import size from 'lodash/size';
import intersectionBy from 'lodash/intersectionBy';
import { Tags } from './Tags';
import { Create } from './Actions/Create';
import { Filters } from './Filters';
import { Update } from './Actions/Update';
import { LensRenderer } from './LensRenderer';

import {
	AutoUIAction,
	AutoUIContext,
	AutoUIModel,
	AutoUIBaseResource,
	getFieldForFormat,
	AutoUIRawModel,
	autoUIJsonSchemaPick,
} from '../schemaOps';
import styled from 'styled-components';
import { Flex } from '../../../components/Flex';
import { ResourceTagModelService } from '../../../components/TagManagementModal/tag-management-service';
import { notifications } from '../../../components/Notifications';
import { Spinner } from '../../../components/Spinner';
import { Box } from '../../../components/Box';
import { filter } from '../../../components/Filters/SchemaSieve';
import { Format } from '../../../components/Renderer/types';
import {
	ResourceTagSubmitInfo,
	SubmitInfo,
} from '../../../components/TagManagementModal/models';
import {
	autoUIRunTransformers,
	autoUIGetModelForCollection,
	autoUIDefaultPermissions,
	autoUIAddToSchema,
} from '../models/helpers';
import { autoUIGetDisabledReason } from '../utils';
import { NoRecordsFoundArrow } from './NoRecordsFoundArrow';
import { Dictionary } from '../../../common-types';
import { useTranslation } from '../../../hooks/useTranslation';
import { LensSelection } from '../Lenses/LensSelection';
import { getLenses, LensTemplate } from '../Lenses';
import { getFromLocalStorage, setToLocalStorage } from '../../../utils';

// Assumptions that I think we can easily make:
// We only handle a single-level schema. If a schema is nested, it is handled by the `format` component internally.

// TODO:
// In rendition if there is an existing notification with a certain ID when submitting a new one, replace it with the new one.
// Move tableWithCustomColumns to rendition
// Make the Table JSON-schema compliant
// Implement sort functions per format
// 1-to-1 relationships should resolve as an object, not an array with one item (eg is_for__device_type should be an object when expanded).
// One to many relationships can be both a number (when using $count) and an array of objects, pine should return counts as part of an object instead (eg. always return an object with __count, and data: []). This can generalize for any field, if we find a `__count` we can render the count instead. Maybe handle this as a format, so it will handle both numbers and arrays? I guess this will be the smallest shape of a collection summary.
// Make table handle tags better so we don't have to filter it out from the schema.
// Specifically for the table, how should we treat columns that are based on multiple schema fields, shall we have some rule around that? Eg. the release "deployment" column combines "status" and "source" and it does appear more compact than having a separate column just to say it is a cloud build or a balena deploy one.
// How shall we handle batch edits (especially when the data differs between entries)? We already do this for HUP but it is all custom code, we need to generalize it.
// SDK's CRUD should all have the same function signature (eg. apiKey.create doesnt take a single object, but two separate fields).

const HeaderGrid = styled(Flex)`
	> * {
		&:first-child {
			margin-right: 4px;
		}
		&:not(:last-child):not(:first-child) {
			margin-left: 4px;
			margin-right: 4px;
		}
		&:last-child {
			margin-left: 4px;
		}
	}
`;

const getSelectedItems = <T extends AutoUIBaseResource<T>>(
	newItems: T[],
	selectedItems: T[],
) => {
	if (!size(selectedItems)) {
		return selectedItems;
	}
	// update the selections
	selectedItems = intersectionBy(newItems, selectedItems, 'id');
	return selectedItems;
};

export interface ActionData<T> {
	action: AutoUIAction<T>;
	schema: JSONSchema;
	affectedEntries?: T[];
}

export interface AutoUICollectionProps<T> {
	/** Model is the property that describe the data to display with a JSON structure */
	model: AutoUIModel<T>;
	/** Entity or array of entities to display */
	data: T[] | undefined;
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

/** Collection component is one of the components that are part of a larger project, namely AutoUI. This component renders a list using an array of data and a template.
 *
 * Model example with Description:
 * <pre><code>
 * {
 *  resource: 'sshKey' <span style="color:green">// This is the name of the DB resource, </span><br />
 *   schema: {
 *   	type: 'object', <span style="color:green">// Type of each entity inside the resource, </span><br />
 *   	required: ['title', 'public_key'], <span style="color:green">// Required properties for actions like create (NOT WELL DEFINED YET, WIP) </span><br />
 *   	properties: { <span style="color:green">// Entity Properties </span><br />
 *   		id: {
 *   			title: 'Id', <span style="color:green">// Column Title </span><br />
 *   			type: 'number', <span style="color:green">// Column type </span><br />
 *   		},
 *   		title: {
 *   			title: 'Title',
 *   			type: 'string',
 *   		},
 *   		fingerprint: {
 *   			title: 'Fingerprint',
 *   			type: 'string',
 *   		},
 *   		public_key: {
 *   			title: 'Public key',
 *   			type: 'string',
 *   			format: 'public-key', <span style="color:green">// Cell format, a custom format can be passed. This will decide how to render the cell </span><br />
 *   		},
 *   		created_at: {
 *   			title: 'Date added',
 *   			type: 'string',
 *   			format: 'date-time',
 *   		},
 *   	},
 *   },
 *   permissions: { <span style="color:green">// Permissions are necessary to understand which type of user can do a certain action </span><br />
 *   	default: defaultPermissions,
 *   	administrator: {
 *   		read: ['id', 'title', 'created_at', 'public_key', 'fingerprint'],
 *   		create: ['title', 'public_key'],
 *   		update: ['title', 'public_key'],
 *   		delete: true,
 *   	},
 *   },
 *   priorities: { <span style="color:green">// Will decide the order of the columns and the visibility </span><br />
 *   	primary: ['title'], <span style="color:green">// Will display these properties in first position </span><br />
 *   	secondary: ['created_at', 'public_key', 'fingerprint'], <span style="color:green">// Will display these properties in a secondary position </span><br />
 *   	tertiary: [], <span style="color:green">// Will initially hide the properties from the list </span><br />
 *   }
 * }
 * </code></pre>
 *
 */

export const AutoUICollection = <T extends AutoUIBaseResource<T>>({
	model: modelRaw,
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
}: AutoUICollectionProps<T>) => {
	const { t } = useTranslation();
	const modelRef = React.useRef(modelRaw);
	// This allows the collection to work even if
	// consumers are passing a new model object every time.
	const model = React.useMemo(() => {
		if (isEqual(modelRaw, modelRef.current)) {
			return modelRef.current;
		}
		return modelRaw;
	}, [modelRaw]);
	const [filters, setFilters] = React.useState<JSONSchema[]>([]);
	const [selected, setSelected] = React.useState<T[]>([]);
	const [isBusyMessage, setIsBusyMessage] = React.useState<
		string | undefined
	>();
	const [actionData, setActionData] = React.useState<
		ActionData<T> | undefined
	>();
	const defaultLensSlug = getFromLocalStorage(`${model.resource}__view_lens`);

	const lenses = React.useMemo(
		() => getLenses(data, lensContext, customLenses),
		[data, customLenses],
	);

	const [lens, setLens] = React.useState<LensTemplate>(lenses[0]);

	React.useEffect(() => {
		const foundLens =
			lenses.find((lens) => lens.slug === defaultLensSlug) || lenses[0];
		if (lens.slug === foundLens.slug) {
			return;
		}
		setLens(foundLens);
	}, [lenses]);

	const showFilters = !!(data?.length && data.length > 5);
	const showActions = !!data?.length;

	const autouiContext = React.useMemo(
		() =>
			({
				resource: model.resource,
				idField: 'id',
				nameField: model.priorities?.primary[0] ?? 'id',
				tagField: getFieldForFormat(model.schema, 'tag'),
				getBaseUrl,
				onEntityClick,
				actions,
				customSort,
				sdk,
			} as AutoUIContext<T>),
		[model, actions, sdk, onEntityClick],
	);

	const filtered = React.useMemo(
		() => (data ? filter(filters, data) : []) as T[],
		[data, filters],
	);

	React.useEffect(() => {
		setSelected((oldSelected) => getSelectedItems(oldSelected, filtered));
	}, [filtered]);

	const changeTags = React.useCallback(
		async (tags: SubmitInfo<ResourceTagSubmitInfo, ResourceTagSubmitInfo>) => {
			if (!sdk?.tags) {
				return;
			}

			setIsBusyMessage(t(`loading.updating_release_tags`));
			notifications.addNotification({
				id: 'change-tags-loading',
				content: t(`loading.updating_release_tags`),
			});

			try {
				await sdk.tags.submit(tags);
				setSelected([]);
				notifications.addNotification({
					id: 'change-tags',
					content: 'Tags updated successfully',
					type: 'success',
				});
				refresh?.();
			} catch (err) {
				notifications.addNotification({
					id: 'change-tags',
					content: err.message,
					type: 'danger',
				});
			} finally {
				notifications.removeNotification('change-tags-loading');
				setIsBusyMessage(undefined);
			}
		},
		[sdk?.tags, refresh],
	);

	const onActionTriggered = React.useCallback((actionData: ActionData<T>) => {
		setActionData(actionData);
		if (actionData.action.actionFn) {
			actionData.action.actionFn({
				affectedEntries: actionData.affectedEntries || [],
			});
		}
	}, []);

	const onActionDone = React.useCallback((isSuccessful: boolean) => {
		if (isSuccessful) {
			setSelected([]);
		}

		setActionData(undefined);
	}, []);

	return (
		<Flex flexDirection="column" mt={2}>
			<Spinner
				label={
					isBusyMessage ??
					t('loading.resource', {
						resource: t(`resource.${model.resource}_plural`).toLowerCase(),
					})
				}
				show={data == null || !!isBusyMessage}
			>
				<Box>
					<HeaderGrid flexWrap="wrap" justifyContent="space-between">
						<Create
							model={model}
							autouiContext={autouiContext}
							hasOngoingAction={false}
							onActionTriggered={onActionTriggered}
						/>
						<Box
							order={[-1, -1, -1, 0]}
							flex={['1 0 100%', '1 0 100%', '1 0 100%', 'auto']}
						>
							{showFilters && (
								<Filters
									schema={model.schema}
									filters={filters}
									autouiContext={autouiContext}
									changeFilters={setFilters}
								/>
							)}
						</Box>
						<HeaderGrid>
							{showActions && !!sdk?.tags && (
								<Tags
									autouiContext={autouiContext}
									selected={selected}
									changeTags={changeTags}
								/>
							)}
							{showActions && (
								<Update
									model={model}
									selected={selected}
									autouiContext={autouiContext}
									hasOngoingAction={false}
									onActionTriggered={onActionTriggered}
								/>
							)}
							{data !== undefined && data.length > 0 && (
								<LensSelection
									lenses={lenses}
									lens={lens}
									setLens={(lens) => {
										setLens(lens);
										setToLocalStorage(
											`${model.resource}__view_lens`,
											lens.slug,
										);
									}}
								/>
							)}
						</HeaderGrid>
					</HeaderGrid>

					<Filters
						renderMode={'summary'}
						schema={model.schema}
						filters={filters}
						autouiContext={autouiContext}
						changeFilters={setFilters}
					/>
				</Box>

				{data && data.length === 0 && (
					<NoRecordsFoundArrow>
						{t(`no_data.no_resource_data`, {
							resource: t(`resource.item_plural`).toLowerCase(),
						})}
						<br />
						{t('questions.how_about_adding_one')}
					</NoRecordsFoundArrow>
				)}

				{data && data.length > 0 && (
					<LensRenderer
						schema={model.schema}
						priorities={model.priorities}
						autouiContext={autouiContext}
						data={data}
						lens={lens}
						selected={selected}
						filtered={filtered}
						changeSelected={setSelected}
						formats={formats}
					/>
				)}

				{actionData?.action?.renderer &&
					actionData.action.renderer({
						schema: actionData.schema,
						affectedEntries: actionData.affectedEntries,
						onDone: onActionDone,
					})}
			</Spinner>
		</Flex>
	);
};

export {
	autoUIRunTransformers,
	autoUIDefaultPermissions,
	autoUIGetModelForCollection,
	autoUIAddToSchema,
	AutoUIAction,
	AutoUIBaseResource,
	AutoUIRawModel,
	AutoUIModel,
	autoUIJsonSchemaPick,
	autoUIGetDisabledReason,
};