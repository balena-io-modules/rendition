import {
	RadioButtonGroup as GrommetRadioButtonGroup,
	RadioButtonGroupProps as GrommetRadioButtonGroupProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, Omit, RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';
import { getBaseStyle } from '../RadioButton';

const Base = styled(GrommetRadioButtonGroup)<{
	value: string | object | undefined;
}>`
	${getBaseStyle}

	& label:hover input[value="${(props: any) => props.value}"] + div {
		border-color: ${props => props.theme.colors.primary.dark};
		background: ${props => props.theme.colors.primary.dark};
	};

	& label input[value="${(props: any) => props.value}"] + div {
		border-color: ${props => props.theme.colors.primary.main};
		background: ${props => props.theme.colors.primary.main};
	}
`;

const RadioButtonGroup = (props: InternalRadioButtonGroupProps) => {
	return (
		<Base
			{...props}
			value={props.value ?? props.defaultValue}
			name={props.name || 'radio button group'}
		/>
	);
};

// Make name optional, and override onChange to not be of `any` type.
interface InternalRadioButtonGroupProps
	extends Omit<GrommetRadioButtonGroupProps, 'name'>,
		DefaultProps {
	name?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type RadioButtonGroupProps = InternalRadioButtonGroupProps &
	RenditionSystemProps;
export default asRendition<React.FunctionComponent<RadioButtonGroupProps>>(
	RadioButtonGroup,
);
