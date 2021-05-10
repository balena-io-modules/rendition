/**
 * Forked from https://github.com/mozilla-services/react-jsonschema-form/blob/174e136af4fe728eb79e92594733ea729f3d659f/src/components/fields/ObjectField.js
 * This file has been changed to support the "patternProperties" keyword
 */

import * as React from 'react';
// @ts-ignore
import AddButton from '@rjsf/core/dist/cjs/components/AddButton';
import PatternPropertiesField from './PatternPropertiesField';

import { JSONSchema7 as JSONSchema } from 'json-schema';
import { FormValidation, IdSchema, UiSchema } from '@rjsf/core';
import {
	// @ts-ignore
	ADDITIONAL_PROPERTY_FLAG,
	getDefaultRegistry,
	getUiOptions,
	orderProperties,
	retrieveSchema,
} from '@rjsf/core/dist/cjs/utils';

interface Properties {
	content: React.ReactElement;
	name: string;
	disabled: boolean;
	readonly: boolean;
}

interface ObjectFieldProps {
	schema: JSONSchema;
	uiSchema: UiSchema;
	formData: any;
	formContext: any;
	errorSchema: FormValidation;
	idSchema: IdSchema;
	title: string;
	description: string;
	properties: Properties[];
	TitleField: React.StatelessComponent<{
		id: string;
		title: string;
		required: boolean;
	}>;
	DescriptionField: React.StatelessComponent<{
		id: string;
		description: string | React.ReactElement;
	}>;
	name: string;
	idPrefix: string;
	registry: any;
	required: boolean;
	disabled: boolean;
	readonly: boolean;
	onAddClick: (schema: JSONSchema) => void;
	onChange: (data: any, errorSchema?: FormValidation) => void;
	onBlur: () => void;
	onFocus: () => void;
}

function DefaultObjectFieldTemplate(props: ObjectFieldProps) {
	const canExpand = function canExpand() {
		const { formData, schema, uiSchema } = props;
		if (!schema.additionalProperties) {
			return false;
		}
		const { expandable } = getUiOptions(uiSchema);
		if (expandable === false) {
			return expandable;
		}
		// if ui:options.expandable was not explicitly set to false, we can add
		// another property if we have not exceeded maxProperties yet
		if (schema.maxProperties !== undefined) {
			return Object.keys(formData).length < schema.maxProperties;
		}
		return true;
	};

	const { TitleField, DescriptionField } = props;
	return (
		<section id={props.idSchema.$id}>
			{(props.uiSchema['ui:title'] || props.title) && (
				<TitleField
					id={`${props.idSchema.$id}__title`}
					title={props.title || props.uiSchema['ui:title']}
					required={props.required}
				/>
			)}
			{props.description && (
				<DescriptionField
					id={`${props.idSchema.$id}__description`}
					description={props.description}
				/>
			)}
			{props.properties.map((prop) => prop.content)}
			{canExpand() && (
				<AddButton
					className="object-property-expand"
					onClick={props.onAddClick(props.schema)}
					disabled={props.disabled || props.readonly}
				/>
			)}
		</section>
	);
}

class ObjectField extends React.Component<ObjectFieldProps> {
	public static defaultProps = {
		uiSchema: {},
		formData: {},
		errorSchema: {},
		idSchema: {},
		required: false,
		disabled: false,
		readonly: false,
	};

	public isRequired(name: string) {
		const schema = this.props.schema;
		return (
			Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
		);
	}

	public onPropertyChange = (
		name: string,
		addedByAdditionalProperties = false,
	) => {
		return (value: string, errorSchema: FormValidation) => {
			if (!value && addedByAdditionalProperties) {
				// Don't set value = undefined for fields added by
				// additionalProperties. Doing so removes them from the
				// formData, which causes them to completely disappear
				// (including the input field for the property name). Unlike
				// fields which are "mandated" by the schema, these fields can
				// be set to undefined by clicking a "delete field" button, so
				// set empty values to the empty string.
				value = '';
			}
			const newFormData = { ...this.props.formData, [name]: value };
			this.props.onChange(
				newFormData,
				errorSchema &&
					this.props.errorSchema && {
						...this.props.errorSchema,
						[name]: errorSchema,
					},
			);
		};
	};

	public onDropPropertyClick = (key: string) => {
		return (event: React.MouseEvent) => {
			event.preventDefault();
			const { onChange, formData } = this.props;
			const copiedFormData = { ...formData };
			delete copiedFormData[key];
			onChange(copiedFormData);
		};
	};

	public getAvailableKey = (preferredKey: string, formData: any) => {
		let index = 0;
		let newKey = preferredKey;
		while (formData.hasOwnProperty(newKey)) {
			newKey = `${preferredKey}-${++index}`;
		}
		return newKey;
	};

	public onKeyChange = (oldValue: string) => {
		return (value: string, errorSchema: FormValidation) => {
			if (oldValue === value) {
				return;
			}
			value = this.getAvailableKey(value, this.props.formData);
			const newFormData = { ...this.props.formData };
			const newKeys = { [oldValue]: value };
			const keyValues = Object.keys(newFormData).map((key) => {
				const newKey = newKeys[key] || key;
				return { [newKey]: newFormData[key] };
			});
			const renamedObj = Object.assign({}, ...keyValues);

			this.props.onChange(
				renamedObj,
				errorSchema &&
					this.props.errorSchema && {
						...this.props.errorSchema,
						[value]: errorSchema,
					},
			);
		};
	};

	public getDefaultValue(type: string) {
		switch (type) {
			case 'string':
				return 'New Value';
			case 'array':
				return [];
			case 'boolean':
				return false;
			case 'null':
				return null;
			case 'number':
				return 0;
			case 'object':
				return {};
			default:
				// We don't have a datatype for some reason (perhaps additionalProperties was true)
				return 'New Value';
		}
	}

	public handleAddClick = (schema: JSONSchema) => () => {
		// @ts-ignore
		const type = schema.additionalProperties.type;
		const newFormData = { ...this.props.formData };
		newFormData[this.getAvailableKey('newKey', newFormData)] =
			this.getDefaultValue(type);
		this.props.onChange(newFormData);
	};

	public render() {
		const {
			uiSchema,
			formData,
			errorSchema,
			idSchema,
			name,
			required,
			disabled,
			readonly,
			idPrefix,
			onBlur,
			onFocus,
			registry = getDefaultRegistry(),
		} = this.props;
		const { definitions, fields, formContext } = registry;
		const { SchemaField, TitleField, DescriptionField } = fields;
		const schema = retrieveSchema(this.props.schema, definitions, formData);
		const title = schema.title === undefined ? name : schema.title;
		const description = uiSchema['ui:description'] || schema.description;
		let orderedProperties: string[];

		try {
			const properties = Object.keys(schema.properties || {});
			orderedProperties = orderProperties(properties, uiSchema['ui:order']);
		} catch (err) {
			return (
				<div>
					<p className="config-error" style={{ color: 'red' }}>
						Invalid {name || 'root'} object field configuration:
						<em>{err.message}</em>.
					</p>
					<pre>{JSON.stringify(schema)}</pre>
				</div>
			);
		}

		const Template = registry.ObjectFieldTemplate || DefaultObjectFieldTemplate;
		const templateProps = {
			title: uiSchema['ui:title'] || title,
			description,
			TitleField,
			DescriptionField,
			properties: orderedProperties.map((name) => {
				const addedByAdditionalProperties = schema.properties[
					name
				].hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
				return {
					content: (
						<SchemaField
							key={name}
							name={name}
							required={this.isRequired(name)}
							schema={schema.properties[name]}
							uiSchema={
								addedByAdditionalProperties
									? uiSchema.additionalProperties
									: uiSchema[name]
							}
							errorSchema={errorSchema[name]}
							idSchema={idSchema[name]}
							idPrefix={idPrefix}
							formData={formData[name]}
							onKeyChange={this.onKeyChange(name)}
							onChange={this.onPropertyChange(
								name,
								addedByAdditionalProperties,
							)}
							onBlur={onBlur}
							onFocus={onFocus}
							registry={registry}
							disabled={disabled}
							readonly={readonly}
							onDropPropertyClick={this.onDropPropertyClick}
						/>
					),
					name,
					readonly,
					disabled,
					required,
				};
			}),
			readonly,
			disabled,
			required,
			idSchema,
			uiSchema,
			schema,
			formData,
			formContext,
		};

		if (schema.patternProperties) {
			templateProps.properties.push({
				content: (
					<PatternPropertiesField
						schema={schema}
						formData={formData}
						onPropertyChange={this.onPropertyChange}
						onKeyChange={this.onKeyChange}
						onDropPropertyClick={this.onDropPropertyClick}
					/>
				),
				name,
				readonly,
				disabled,
				required,
			});
		}
		return <Template {...templateProps} onAddClick={this.handleAddClick} />;
	}
}

export default ObjectField;
