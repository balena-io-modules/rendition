import * as React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';

const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
	const { TitleField, DescriptionField } = props;
	return (
		<fieldset>
			{props.schema.title &&
				(props.uiSchema['ui:title'] || props.title) && (
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
			{props.properties.map((prop: any) => prop.content)}
		</fieldset>
	);
};

export default ObjectFieldTemplate;
