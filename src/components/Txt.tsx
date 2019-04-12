import * as React from 'react';
import styled from 'styled-components';
import { style } from 'styled-system';
import asRendition from '../asRendition';
import { DefaultProps, EnhancedType, Theme } from '../common-types';
import { monospace } from '../utils';

type Whitespace =
	| 'normal'
	| 'nowrap'
	| 'pre'
	| 'pre-line'
	| 'pre-wrap'
	| 'initial'
	| 'inherit';
type Align =
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

export interface TxtProps extends DefaultProps {
	monospace?: boolean;
	bold?: boolean;
	caps?: boolean;
	whitespace?: Whitespace;
	align?: Align;
}

export interface ThemedTxtProps extends TxtProps {
	theme: Theme;
}

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
	return asRendition<TxtProps>((props: any) => {
		return <Txt as={tag} {...props} />;
	});
};

const Base = Factory() as React.ComponentType<EnhancedType<TxtProps>> & {
	p: React.ComponentType<EnhancedType<TxtProps>>;
	span: React.ComponentType<EnhancedType<TxtProps>>;
};

Base.displayName = 'Txt';
Base.span = Factory('span');
Base.p = Factory('p');

export default Base;
