import * as React from 'react';
import styled from 'styled-components';
import { style } from 'styled-system';
import asRendition from '../asRendition';
import { DefaultProps, RenditionSystemProps, Theme } from '../common-types';
import { monospace } from '../utils';

export const whitespace = (props: ThemedTxtProps) =>
	props.whitespace ? { whiteSpace: props.whitespace } : null;

export const caps = (props: ThemedTxtProps) =>
	props.caps ? { textTransform: 'uppercase', letterSpacing: '0.2em' } : null;

export const bold = (props: ThemedTxtProps) =>
	props.bold
		? { fontWeight: props.theme.weights[props.theme.weights.length - 1] }
		: null;

export const align = style({
	key: 'text-align',
	prop: 'align',
	cssProperty: 'text-align',
});

const Txt = styled.div<TxtProps>`
	${align}
	${monospace as any}
	${whitespace as any}

	${caps as any}
	${bold as any}
`;

const Factory = (tag?: string) => {
	return asRendition<React.FunctionComponent<TxtProps>>((props: any) => {
		return <Txt as={tag} {...props} />;
	});
};

const Base = Factory() as React.FunctionComponent<TxtProps> & {
	p: React.FunctionComponent<TxtProps>;
	span: React.FunctionComponent<TxtProps>;
};

export type Whitespace =
	| 'normal'
	| 'nowrap'
	| 'pre'
	| 'pre-line'
	| 'pre-wrap'
	| 'initial'
	| 'inherit';
export type Align =
	| 'left'
	| 'right'
	| 'center'
	| 'justify'
	| 'justify-all'
	| 'start'
	| 'end'
	| 'match-parent'
	| 'inherit'
	| 'initial'
	| 'unset';

export interface InternalTxtProps extends DefaultProps {
	monospace?: boolean;
	bold?: boolean;
	caps?: boolean;
	whitespace?: Whitespace;
	align?: Align;
}

export interface ThemedTxtProps extends InternalTxtProps {
	theme: Theme;
}

export type TxtProps = InternalTxtProps & RenditionSystemProps;

Base.displayName = 'Txt';
Base.span = Factory('span');
Base.p = Factory('p');

export default Base;
