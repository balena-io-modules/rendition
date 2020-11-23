import {
	RadioButtonGroup as GrommetRadioButtonGroup,
	RadioButtonGroupProps as GrommetRadioButtonGroupProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { Omit, RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';
import { getBaseStyle } from '../RadioButton';

const Base = styled(GrommetRadioButtonGroup)<{
	value: any;
}>`
	${getBaseStyle}

	& label:hover input[value="${(props: any) => props.value}"] + div {
		border-color: ${(props) => props.theme.colors.primary.dark};
		background: ${(props) => props.theme.colors.primary.dark};
	}

	& label input[value='${(props: any) => props.value}'] + div {
		border-color: ${(props) => props.theme.colors.primary.main};
		background: ${(props) => props.theme.colors.primary.main};
	}
`;

const BaseRadioButtonGroup = (props: InternalRadioButtonGroupProps) => {
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
		React.HTMLAttributes<HTMLElement> {
	/** The DOM name attribute value to use for the underlying <input/> elements. */
	name?: string;
	/** Function called when the value of the radio button changes */
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type RadioButtonGroupProps = InternalRadioButtonGroupProps &
	RenditionSystemProps;

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/RadioButtonGroup/RadioButtonGroup.stories.tsx) */
export const RadioButtonGroup = asRendition<
	React.FunctionComponent<RadioButtonGroupProps>
>(BaseRadioButtonGroup);
