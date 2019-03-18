import { Theme, TxtProps } from 'rendition';
import styled from 'styled-components';
import { color, fontSize, responsiveStyle, space } from 'styled-system';
import asRendition from '../asRendition';
import { monospace } from '../utils';

interface ThemedTxtProps extends TxtProps {
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

export const align = responsiveStyle('text-align', 'align');

const Txt = styled.div`
	${align}
	${color}
	${fontSize}
	${space}
	${monospace as any}
	${whitespace as any}

	${caps as any}
	${bold as any}
`;

const Base = asRendition(Txt) as React.ComponentClass<TxtProps> & {
	span: React.ComponentClass<TxtProps>;
	p: React.ComponentClass<TxtProps>;
};
Base.displayName = 'Txt';
Base.span = asRendition(Txt.withComponent('span'));
Base.p = asRendition(Txt.withComponent('p'));

export default Base;
