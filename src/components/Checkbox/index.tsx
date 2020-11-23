import {
	CheckBox as GrommetCheckbox,
	CheckBoxProps as GrommetCheckBoxProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';

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
		font-size: ${px(props.theme.fontSizes[2])};
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

const BaseCheckbox = ({ className, ...otherProps }: InternalCheckboxProps) => {
	return (
		<CheckboxWrapper isChecked={otherProps.checked} className={className}>
			<GrommetCheckbox {...otherProps} />
		</CheckboxWrapper>
	);
};

export interface InternalCheckboxProps
	extends React.HTMLAttributes<HTMLElement>,
		GrommetCheckBoxProps {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type CheckboxProps = InternalCheckboxProps & RenditionSystemProps;

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Checkbox/Checkbox.stories.tsx) */
export const Checkbox = asRendition<React.FunctionComponent<CheckboxProps>>(
	BaseCheckbox,
);
