import {
	CheckBox as GrommetCheckbox,
	CheckBoxProps as GrommetCheckBoxProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';

/* Hover styles
	1. Toggle (active & default)
	2. Checkbox default
	3. Checkbox active
*/
export const getHoverStyle = (props: any) => `
	& label:hover input:not([disabled]) + span > span {
		border-color: ${props.theme.colors.primary.dark};
		background: ${props.theme.colors.primary.dark};
	}
	& label:hover input:not([disabled]) + div {
		border-color: ${props.theme.colors.tertiary.main}!important;
	}
	${
		props.isChecked
			? `
		& label:hover input:not([disabled]) + div {
			border-color: ${props.theme.colors.primary.dark} !important;
			background: ${props.theme.colors.primary.dark};
		}
		`
			: ''
	}
`;

const getBaseStyle = (props: any) => `
	/* for the checkbox */
	& > label > div > div,
	/* for the toggle */
	& > label > div > span {
		background-color: white;
	}
	& > label > span {
		font-family: ${props.theme.font};
	}
	${
		props.isChecked
			? `
		& label input + div {
			border-color: ${props.theme.colors.primary.main};
			background: ${props.theme.colors.primary.main};
			> svg {
				stroke: #fff;
			}
		}
		`
			: ''
	}
	
	& label[disabled] {
		opacity: 0.4
	}
`;

const CheckboxWrapper = styled.div<{ isChecked?: boolean }>`
	${getBaseStyle}
	${getHoverStyle}
`;

const Checkbox = ({ className, ...otherProps }: InternalCheckboxProps) => {
	return (
		<CheckboxWrapper isChecked={otherProps.checked} className={className}>
			<GrommetCheckbox {...otherProps} />
		</CheckboxWrapper>
	);
};

export interface InternalCheckboxProps
	extends DefaultProps,
		GrommetCheckBoxProps {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type CheckboxProps = InternalCheckboxProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<CheckboxProps>>(Checkbox);
