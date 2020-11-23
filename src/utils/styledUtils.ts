import { css } from 'styled-components';
import { Theme } from '~/common-types';

export const normal = (props: { theme: Theme }) => props.theme?.weights?.[0];
export const bold = (props: { theme: Theme }) => props.theme?.weights?.[1];

export const px = (n: any) => (typeof n === 'number' ? n + 'px' : n);

export const monospace = (props: { monospace?: boolean; theme: Theme }) =>
	props.monospace
		? css`
				font-family: ${props.theme.monospace};
		  `
		: null;

export const emphasized = (props: { emphasized?: boolean; theme: Theme }) =>
	css`
		height: ${px(
			props.emphasized ? props.theme.space[5] : props.theme.space[4],
		)};
	`;
