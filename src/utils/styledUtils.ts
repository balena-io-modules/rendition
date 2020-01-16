import get from 'lodash/get';
import { Theme, ThemedDefaultProps } from '~/common-types';

export const normal = (props: ThemedDefaultProps) =>
	get(props.theme, 'weights.0');
export const bold = (props: ThemedDefaultProps) =>
	get(props.theme, 'weights.1');

export const px = (n: any) => (typeof n === 'number' ? n + 'px' : n);

export const monospace = (props: { monospace?: boolean; theme: Theme }) =>
	props.monospace ? `font-family: ${props.theme.monospace}` : null;

export const emphasized = (props: { emphasized?: boolean; theme: Theme }) =>
	`height: ${px(
		props.emphasized ? props.theme.space[5] : props.theme.space[4],
	)}`;
