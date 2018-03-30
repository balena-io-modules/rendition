import { TextProps, Theme } from 'rendition';
import styled from 'styled-components';
import { color, fontSize, responsiveStyle, space } from 'styled-system';
import asRendition from '../asRendition';
import { monospace } from '../utils';

interface ThemedTextProps extends TextProps {
	theme: Theme;
}

export const caps = (props: ThemedTextProps) =>
	props.caps
		? {
				textTransform: 'uppercase',
				letterSpacing: '0.2em',
			}
		: null;

export const bold = (props: ThemedTextProps) =>
	props.bold
		? { fontWeight: props.theme.weights[props.theme.weights.length - 1] }
		: null;

export const align = responsiveStyle('text-align', 'align');

const Text = styled.div`
	${align}
	${color}
	${fontSize}
	${monospace as any};
	${space}

	${caps as any}
	${bold as any}
`;

const Base = asRendition(Text) as React.ComponentClass<TextProps> & {
	span: React.ComponentClass<TextProps>;
	p: React.ComponentClass<TextProps>;
};
Base.displayName = 'Text';
Base.span = asRendition(Text.withComponent('span'));
Base.p = asRendition(Text.withComponent('p'));

export default Base;
