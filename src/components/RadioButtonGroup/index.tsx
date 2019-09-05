import {
	RadioButtonGroup as GrommetRadioButtonGroup,
	RadioButtonGroupProps as GrommetRadioButtonGroupProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, Omit, RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';
import { getBaseStyle, getHoverStyle } from '../RadioButton';

const Base = styled(GrommetRadioButtonGroup)`
	${getHoverStyle}
	${getBaseStyle}
`;

const RadioButtonGroup = (props: InternalRadioButtonGroupProps) => {
	return <Base {...props} name={props.name || 'radio button group'} />;
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
