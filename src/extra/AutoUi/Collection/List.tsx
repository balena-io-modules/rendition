import React from 'react';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import { CollectionLenses } from './Lenses';
import { AutoUIContext, AutoUIBaseResource, Priorities } from '../schemaOps';
import { Format, UiSchema, Value } from '../../../components/Renderer/types';
import { DataGrid } from '../../../components/DataGrid';
import { transformUiSchema } from '../../../components/Renderer/widgets/widget-util';
import { getValue, getWidget } from '../../../components/Renderer';
import { Table } from '../../../components/Table';
import { useHistory } from '../../../hooks/useHistory';

const formatSorters: { [key: string]: (a: any, b: any) => number } = {};

const getSortingFunction = (schemaKey: string, schemaValue: JSONSchema) => {
	if (formatSorters[schemaValue.format ?? '']) {
		return formatSorters[schemaValue.format ?? ''];
	}

	switch (schemaValue.type) {
		case 'string': {
			return (a: any, b: any) =>
				a[schemaKey]?.toLowerCase().localeCompare(b[schemaKey]?.toLowerCase());
		}

		case 'number':
		case 'integer':
		default:
			return (a: any, b: any) => a[schemaKey] - b[schemaKey];
	}
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

const getColumnsFromSchema = <T extends AutoUIBaseResource<T>>({
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
	customSort: AutoUIContext<T>['customSort'];
	priorities?: Priorities<T>;
	formats?: Format[];
}) => {
	return (
		Object.entries(schema.properties ?? {})
			// The tables treats tags differently, handle it better
			.filter(([key]) => key !== tagField && key !== idField)
			.map(([key, val]) => {
				if (typeof val !== 'object') {
					return;
				}

				const widgetSchema = { ...val, title: undefined };
				return {
					title: val.title,
					field: key,
					// This is used for storing columns and views
					key,
					selected: getSelected(key as keyof T, priorities),
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
			.filter((columnDef) => !!columnDef)
	);
};

interface ListProps<T> {
	data: T[] | undefined;
	schema: JSONSchema;
	autouiContext: AutoUIContext<T>;
	lens: CollectionLenses;
	filtered: T[];
	selected: T[];
	changeSelected: (selected: T[]) => void;
	priorities?: Priorities<T>;
	formats?: Format[];
}

export const List = <T extends AutoUIBaseResource<T>>({
	data,
	schema,
	autouiContext,
	lens,
	filtered,
	selected,
	changeSelected,
	priorities,
	formats,
}: ListProps<T>) => {
	// const listKey = autouiContext.baseUrl.split('/').join('-');
	const history = useHistory();
	const columns: any = React.useMemo(
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

	const onRowClick = (
		row: T,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => {
		if (autouiContext.onRowClick) {
			autouiContext.onRowClick(row, event);
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

	return (
		<>
			{lens === CollectionLenses.Table && (
				<Table<T>
					rowKey={'id'}
					data={filtered}
					checkedItems={selected}
					columns={columns}
					onCheck={changeSelected}
					usePager={data && data.length > 5}
					pagerPosition={'bottom'}
					itemsPerPage={50}
					getRowHref={autouiContext.getBaseUrl}
					onRowClick={onRowClick}
					columnStateRestorationKey={`${autouiContext.resource}__columns`}
					sortingStateRestorationKey={`${autouiContext.resource}__sort`}
					tagField={autouiContext.tagField as keyof T}
					enableCustomColumns
				/>
			)}
			{lens === CollectionLenses.Grid && autouiContext.cardRenderer && (
				<DataGrid<T>
					items={filtered}
					renderItem={autouiContext.cardRenderer}
					getItemKey={(app) => app.id}
					itemMinWidth={'350px'}
				/>
			)}
		</>
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

	if (processedValue === undefined || processedValue === null) {
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
