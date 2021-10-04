import castArray from 'lodash/castArray';
import React from 'react';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import { Dictionary } from '../../../common-types';
import {
	Format,
	UiSchema,
	Value,
	JsonTypes,
} from '../../../components/Renderer/types';
import { transformUiSchema } from '../../../components/Renderer/widgets/widget-util';
import { getValue, getWidget } from '../../../components/Renderer';
import { TableColumn } from '../../../components/Table';
import type { TableSortFunction } from '../../../components/Table/TableRow';
import { useHistory } from '../../../hooks/useHistory';
import { AutoUIContext, AutoUIBaseResource, Priorities } from '../schemaOps';
import { diff } from '../../../utils';
import { LensTemplate } from '../Lenses';

const formatSorters: Dictionary<TableSortFunction<any>> = {};

const getSortingFunction = <T extends any>(
	schemaKey: keyof T,
	schemaValue: JSONSchema,
): TableSortFunction<T> => {
	if (formatSorters[schemaValue.format ?? '']) {
		return formatSorters[schemaValue.format ?? ''];
	}

	const types = castArray(schemaValue.type);
	if (types.includes(JsonTypes.string)) {
		return (a: T, b: T) => {
			const aa = (a[schemaKey] ?? '') as string;
			const bb = (b[schemaKey] ?? '') as string;
			if (typeof aa === 'string' && typeof bb === 'string') {
				return aa.toLowerCase().localeCompare(bb.toLowerCase());
			}
			return diff(aa, bb);
		};
	}
	return (a: T, b: T) =>
		// @ts-expect-error
		diff(a[schemaKey], b[schemaKey]);
};

const getSelected = <T, K extends keyof T>(
	key: K,
	priorities?: Priorities<T>,
) => {
	if (!priorities) {
		return true;
	}
	return (
		priorities?.primary.includes(key) || priorities?.secondary.includes(key)
	);
};

export const getColumnsFromSchema = <T extends AutoUIBaseResource<T>>({
	schema,
	idField,
	tagField,
	customSort,
	priorities,
	formats,
}: {
	schema: JSONSchema;
	idField: AutoUIContext<T>['idField'];
	tagField: AutoUIContext<T>['tagField'];
	customSort?: AutoUIContext<T>['customSort'];
	priorities?: Priorities<T>;
	formats?: Format[];
}): Array<TableColumn<T>> =>
	Object.entries(schema.properties ?? {})
		// The tables treats tags differently, handle it better
		.filter((entry): entry is [keyof T, typeof entry[1]] => {
			return entry[0] !== tagField && entry[0] !== idField;
		})
		.map(([key, val]) => {
			if (typeof val !== 'object') {
				return;
			}

			const definedPriorities = priorities ?? ({} as Priorities<T>);
			const priority = definedPriorities.primary.find(
				(prioritizedKey) => prioritizedKey === key,
			)
				? 'primary'
				: definedPriorities.secondary.find(
						(prioritizedKey) => prioritizedKey === key,
				  )
				? 'secondary'
				: 'tertiary';

			const widgetSchema = { ...val, title: undefined };
			return {
				title: val.title || key,
				field: key,
				// This is used for storing columns and views
				key,
				selected: getSelected(key as keyof T, priorities),
				priority,
				type: 'predefined',
				sortable: customSort?.[key] ?? getSortingFunction(key, val),
				render: (fieldVal: string, entry: T) =>
					val.format ? (
						<CustomWidget
							extraFormats={formats ?? ([] as Format[])}
							schema={widgetSchema}
							value={fieldVal}
							extraContext={entry}
						/>
					) : (
						fieldVal
					),
			};
		})
		.filter(
			(columnDef): columnDef is NonNullable<typeof columnDef> => !!columnDef,
		);

interface LensRendererProps<T> {
	data: T[] | undefined;
	schema: JSONSchema;
	autouiContext: AutoUIContext<T>;
	lens: LensTemplate;
	filtered: T[];
	selected: T[];
	changeSelected: (selected: T[]) => void;
	priorities?: Priorities<T>;
	formats?: Format[];
}

export const LensRenderer = <T extends AutoUIBaseResource<T>>({
	data,
	schema,
	autouiContext,
	lens,
	filtered,
	selected,
	changeSelected,
	priorities,
	formats,
}: LensRendererProps<T>) => {
	const history = useHistory();
	const properties = React.useMemo(
		() =>
			getColumnsFromSchema<T>({
				schema,
				idField: autouiContext.idField,
				tagField: autouiContext.tagField,
				customSort: autouiContext.customSort,
				priorities,
				formats,
			}),
		[
			schema,
			autouiContext.idField,
			autouiContext.tagField,
			autouiContext.customSort,
			priorities,
		],
	);

	const onEntityClick = (
		row: T,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => {
		if (autouiContext.onEntityClick) {
			autouiContext.onEntityClick(row, event);
		}

		if (event.isPropagationStopped() && event.isDefaultPrevented()) {
			return;
		}

		// let browser handle "target=_blank" if cmd or ctrl are pressed using row href
		if (
			autouiContext.getBaseUrl &&
			!event.ctrlKey &&
			!event.metaKey &&
			history
		) {
			event.preventDefault();
			history.push?.(autouiContext.getBaseUrl(row));
		}
	};

	const hasUpdateActions =
		!!autouiContext.actions?.filter((action) => action.type !== 'create')
			?.length || !!autouiContext.sdk?.tags;

	return (
		<lens.data.renderer
			filtered={filtered}
			selected={selected}
			properties={properties}
			hasUpdateActions={hasUpdateActions}
			changeSelected={changeSelected}
			data={data}
			autouiContext={autouiContext}
			onEntityClick={onEntityClick}
		/>
	);
};

interface CustomWidgetProps {
	value: Value;
	extraContext: object | undefined;
	schema: JSONSchema;
	extraFormats: Format[];
	uiSchema?: UiSchema;
}

export const CustomWidget = ({
	value,
	extraContext,
	schema,
	extraFormats,
	uiSchema,
}: CustomWidgetProps) => {
	const processedUiSchema = transformUiSchema({
		value,
		uiSchema,
		extraContext,
	});

	const processedValue = getValue(value, schema, processedUiSchema);
	const types = schema?.type != null ? castArray(schema.type) : [];

	if (
		processedValue === undefined ||
		(processedValue === null && !types.includes(JsonTypes.null))
	) {
		return null;
	}

	const Widget = getWidget(
		processedValue,
		schema.format,
		undefined,
		extraFormats,
	);

	return (
		<Widget
			extraContext={extraContext}
			extraFormats={extraFormats}
			value={processedValue}
			schema={schema}
		/>
	);
};
