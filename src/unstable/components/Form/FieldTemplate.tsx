import * as React from 'react';
import styled from 'styled-components';
import { Box } from '../../../components/Grid';

const LabelElement = styled.label`
	font-size: 11px;
	color: #252629;
	text-transform: uppercase;
	display: inline-block;
	margin-bottom: 6px;
`;

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
	description: JSX.Element;
	hidden: boolean;
	required: boolean;
	displayLabel: boolean;
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
		help,
		description,
		hidden = false,
		required = false,
		displayLabel = true,
	} = props;
	if (hidden) {
		return children;
	}

	return (
		<Box mb={2} className={classNames}>
			{displayLabel && <Label label={label} required={required} id={id} />}
			{displayLabel && description ? description : null}
			{children}
			{errors}
			{help}
		</Box>
	);
};

export default FieldTemplate;
