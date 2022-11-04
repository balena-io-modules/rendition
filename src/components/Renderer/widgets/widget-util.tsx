import * as React from 'react';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import skhema from 'skhema';
import jsone from 'json-e';
import merge from 'lodash/merge';
import pickBy from 'lodash/pickBy';
import difference from 'lodash/difference';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';
import has from 'lodash/has';
import get from 'lodash/get';
import pick from 'lodash/pick';
import type { JSONSchema6 } from 'json-schema';
import type {
	JSONSchema,
	JsonTypesTypeMap,
	UiSchema,
	Format,
	Value,
} from '../types';
import type { Overwrite } from '../../../common-types';
import { UiOptions } from './ui-options';

export interface WidgetProps<T extends object = object> {
	value: Value;
	schema: JSONSchema | undefined;
	uiSchema?: UiSchema;
	extraFormats?: Format[];
	extraContext?: T;
}

interface WidgetStaticProperties {
	uiOptions?: UiOptions;
	supportedTypes?: string[];
	displayName: string;
}

export interface Widget<T extends object = object, ExtraProps = {}>
	extends WidgetStaticProperties {
	(props: WidgetProps<T> & ExtraProps): JSX.Element | null;
}

// TODO: Replace the HOF with a plain function once TS supports optional generic types
// See: https://github.com/microsoft/TypeScript/issues/14400
// TODO: convert the fn args to an object once we bump TS
export function widgetFactory<ST extends Array<keyof JsonTypesTypeMap>>(
	displayName: string,
	uiOptions: Widget['uiOptions'],
	supportedTypes: ST,
) {
	return function <
		T extends object,
		ExtraProps extends {} = {},
		V extends WidgetProps['value'] | null = JsonTypesTypeMap[ST[number]],
	>(
		widgetFn: (
			props: Overwrite<WidgetProps<T>, { value: V }> & ExtraProps,
		) => JSX.Element | null,
	): Widget<T, ExtraProps> {
		const widget = widgetFn as Widget<T, ExtraProps>;
		Object.assign(widget, {
			displayName,
			uiOptions,
			supportedTypes,
		});
		return widget;
	};
}

const DATE_FORMAT = 'MMM do yyyy';
const TIME_FORMAT = 'h:mm a';

export function formatTimestamp(
	timestamp: string | number,
	uiSchema: UiSchema = {},
) {
	if (!timestamp) {
		return '';
	}
	const uiFormat =
		get(uiSchema, ['ui:options', 'dtFormat']) ||
		`${DATE_FORMAT}, ${TIME_FORMAT}`;
	return format(new Date(timestamp), uiFormat);
}

export const timeSince = (timestamp: string | number, suffix = true) =>
	formatDistance(new Date(timestamp), new Date(), { addSuffix: suffix });

// This HOC function wraps a Widget component and converts
// the widget's specified 'uiOptions' into props that are
// passed to the widget component.
export function withOptionProps(uiOptions: UiOptions) {
	return (Component: Widget) => {
		const wrapped = (props: WidgetProps) => {
			const extraProps = pick(
				get(props.uiSchema, 'ui:options', {}),
				...keys(uiOptions),
			);
			return <Component {...props} {...extraProps} />;
		};

		wrapped.displayName = Component.displayName;
		wrapped.uiOptions = Component.uiOptions;
		wrapped.supportedTypes = Component.supportedTypes;
		return wrapped;
	};
}

// Runs the UI schema through json-e if the value is
// not an object or an array.
export const transformUiSchema = ({
	value,
	uiSchema,
	extraContext,
}: {
	value?: Value;
	uiSchema: WidgetProps['uiSchema'];
	extraContext: WidgetProps['extraContext'];
}) => {
	if (uiSchema == null) {
		// If the input schema is empty then the output also will be, so we can
		// short-circuit here and avoid a lot of work
		return {};
	}
	// Ensure source is not null/undefined as jsone might call toString() on it
	const context = { source: value ?? '', ...extraContext };
	if (typeof value === 'object') {
		// For objects/arrays just transform the 'ui:' properties.
		// Sub-properties will be transformed recursively.
		const trimmedUiSchema = pickBy(uiSchema, (_, k) => k.startsWith('ui:'));
		const processedUiSchema = jsone(trimmedUiSchema, context);
		return merge({}, uiSchema, processedUiSchema);
	}
	return jsone(uiSchema, context);
};

// If the schema defines an anyOf array, return the schema option
// that best matches the value; otherwise just return the original schema.
// Internally uses skhema.match to score the schema options
// against the value.
export const getBestSchemaMatch = (
	schema: JSONSchema | undefined,
	value: any,
) => {
	if (!schema?.anyOf) {
		return schema;
	}
	const mostRelevantSchema = schema.anyOf.reduce(
		(mostRelevantSchema, anyOfItem: JSONSchema) => {
			const match = skhema.match(anyOfItem as JSONSchema6, value);
			if (match.valid && match.score > mostRelevantSchema.score) {
				return {
					schema: anyOfItem,
					score: match.score,
				};
			}
			return mostRelevantSchema;
		},
		{
			schema,
			score: 0,
		},
	);

	return mostRelevantSchema.schema;
};

export const getArrayItems = ({
	value,
	schema,
	uiSchema,
	extraContext,
	extraFormats,
}: WidgetProps): WidgetProps[] => {
	if (!isArray(value)) {
		throw new Error(`Value must be an array (not '${typeof value}')`);
	}
	const maxItems = get(uiSchema, ['ui:options', 'truncate'], value.length);
	const items = value.slice(0, maxItems).map((item) => {
		const itemSchema = get(schema, 'items', {}) as JSONSchema;
		const itemUiSchema = get(uiSchema, 'items', {}) as UiSchema;
		const processedUiSchema = transformUiSchema({
			value: item,
			uiSchema: itemUiSchema,
			extraContext,
		});
		return {
			value: item,
			schema: itemSchema,
			uiSchema: processedUiSchema,
			extraContext,
			extraFormats,
		};
	});
	if (maxItems < value.length) {
		items.push({
			value: `+ ${value.length - maxItems} more`,
			schema: {
				type: 'string',
			},
			uiSchema: {},
			extraContext,
			extraFormats,
		});
	}
	return items;
};

// 'Materialized' properties are properties defined in the UI Schema but not in the value or schema.
// The property name must begin with 'ui:field:' (e.g. 'ui:field:myMaterializedProperty').
const getMaterializedPropertyNames = (uiSchema: WidgetProps['uiSchema']) => {
	return keys(uiSchema).filter((uiSchemaKey) =>
		uiSchemaKey.startsWith('ui:field:'),
	);
};

export function getObjectPropertyNames({
	value,
	schema,
	uiSchema,
}: WidgetProps): string[] {
	if (typeof value !== 'object') {
		throw new Error(
			`Cannot get object property names from a value of type '${typeof value}'`,
		);
	}
	const uiSchemaPropertyNames = getMaterializedPropertyNames(uiSchema);
	const schemaPropertyNames =
		get(uiSchema, ['ui:order'], keys(get(schema, 'properties'))) || [];
	const nonSchemaPropertyNames = difference(
		keys(value) || [],
		schemaPropertyNames,
	);
	const allObjectPropertyNames = [
		...uiSchemaPropertyNames,
		...schemaPropertyNames,
		...nonSchemaPropertyNames,
	];

	return get(uiSchema, 'ui:explicit', false)
		? allObjectPropertyNames.filter((propName) => has(uiSchema, propName))
		: allObjectPropertyNames;
}

export const truncateHash = (str: string, maxLength = 7) => {
	if (!str || str.length < maxLength) {
		return str;
	}

	return str.substring(0, maxLength);
};
