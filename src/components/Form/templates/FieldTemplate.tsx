import * as React from 'react';
import { UiSchema } from '@rjsf/core';
import { Box } from '../../Box';
import { Markdown } from '../../../extra/Markdown';
import Theme from '../../../theme';
import { LabelElement } from '../LabelElement';
import { WarningField } from '../WarningField';
import { Txt } from '../../Txt';

const REQUIRED_FIELD_SYMBOL = '*';

interface LabelProps {
	id: FieldTemplateProps['id'];
	required: FieldTemplateProps['required'];
	label: FieldTemplateProps['label'];
}

const Label = (props: LabelProps) => {
	const { label, required, id } = props;
	if (!label) {
		return null;
	}
	return (
		<LabelElement className="control-label" htmlFor={id}>
			{label}
			{required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
		</LabelElement>
	);
};

interface FieldTemplateProps {
	id: string;
	classNames: string;
	label: string;
	children: JSX.Element;
	errors: JSX.Element;
	help: JSX.Element;
	rawHelp?: string;
	description: JSX.Element;
	hidden: boolean;
	required: boolean;
	displayLabel: boolean;
	uiSchema: UiSchema;
}

/**
 * The default field template, modified from the original react-jsonschema-form
 * file:
 * https://github.com/mozilla-services/react-jsonschema-form/blob/master/src/components/fields/SchemaField.js#L97
 */
const FieldTemplate = (props: FieldTemplateProps) => {
	const {
		id,
		classNames,
		label,
		children,
		errors,
		rawHelp,
		description,
		hidden = false,
		required = false,
		displayLabel = true,
		uiSchema,
	} = props;
	if (hidden) {
		return children;
	}

	const warning = uiSchema['ui:warning'];

	return (
		<Box mb={2} className={`${classNames || ''} rendition-form__field--${id}`}>
			{displayLabel && <Label label={label} required={required} id={id} />}
			{displayLabel && !!warning && <WarningField warning={warning} />}
			{displayLabel && description ? description : null}
			{children}
			{errors}
			{rawHelp && (
				<Markdown
					mt={1}
					className="rendition-form-help"
					color={Theme.colors.text.light}
					componentOverrides={{
						p: (props: any) => <Txt.p {...props} margin={0} />,
					}}
				>
					{rawHelp}
				</Markdown>
			)}
		</Box>
	);
};

export default FieldTemplate;
