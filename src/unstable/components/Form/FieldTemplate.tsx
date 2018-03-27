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

const Label = (props: any) => {
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

const FieldTemplate = (props: any) => {
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
