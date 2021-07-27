import { JSONSchema7 as JSONSchema } from 'json-schema';
import $pick from 'lodash/pick';
import { Dictionary } from '../../common-types';
import { ResourceTagModelService } from '~/components/TagManagementModal/tag-management-service';

export interface AutoUIBaseResource<T> {
	id: number;
	__permissions: Permissions<T>;
}

export interface Permissions<T> {
	read: Array<keyof T>;
	create: Array<keyof T>;
	update: Array<keyof T>;
	delete: boolean;
}

export interface Priorities<T> {
	primary: Array<keyof T>;
	secondary: Array<keyof T>;
	tertiary: Array<keyof T>;
}

// This is a raw form that would not be exposed to the UI and would live either in the SDK or backend.
export interface AutoUIRawModel<T> {
	resource: string;
	schema: JSONSchema;
	permissions: Dictionary<Permissions<T>>;
	priorities?: Priorities<T>;
}
export interface AutoUIModel<T> {
	resource: string;
	schema: JSONSchema;
	permissions: Permissions<T>;
	priorities?: Priorities<T>;
}

export interface AutoUIAction<T> {
	title: string;
	type: 'create' | 'update' | 'delete';
	renderer: (props: {
		schema: JSONSchema;
		affectedEntries?: T[];
		onDone: (isSuccessful: boolean) => void;
	}) => React.ReactNode;
	isDisabled?: (props: { affectedEntries?: T[] }) => string | false;
	isDangerous?: boolean;
}

export interface AutoUIContext<T> {
	resource: string;
	getBaseUrl?: (entry: T) => string;
	onRowClick?: (
		entry: T,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => void;
	idField: string;
	nameField?: string;
	tagField?: string;
	geolocation: {
		latitudeField?: string;
		longitudeField?: string;
	};
	cardRenderer?: (resource: T) => React.ReactNode;
	actions?: Array<AutoUIAction<T>>;
	customSort?: Dictionary<(a: T, b: T) => number>;
	sdk?: {
		tags?: ResourceTagModelService;
	};
}

// The implementation lacks handling of nested schemas and some edge cases, but is enough for now.
export const autoUIJsonSchemaPick = <T>(
	schema: JSONSchema,
	selectors: Array<keyof T>,
) => {
	const res: JSONSchema = {
		...schema,
		properties: $pick(schema.properties ?? {}, selectors as string[]),
		required: [],
	};

	res.required = schema.required?.filter((requiredField) =>
		(selectors as string[]).includes(requiredField),
	);

	return res;
};

export const getFieldForFormat = (schema: JSONSchema, format: string) => {
	let propertyKeyWithFormat: string | undefined;

	Object.entries(schema.properties ?? {}).forEach(([key, val]: any) => {
		if (typeof val === 'object' && val.format === format) {
			propertyKeyWithFormat = key;
		}
	});

	return propertyKeyWithFormat;
};
