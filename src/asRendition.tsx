import { arrayOf, number, oneOfType, string } from 'prop-types';
import * as React from 'react';
import { compose, getDisplayName } from 'recompose';
import styled from 'styled-components';
import { color, fontSize, space, width } from 'styled-system';
import tag from 'tag-hoc';
import blacklist from './blacklist';
import theme from './theme';
import { Tooltips } from './tooltips';

const tooltip = new Tooltips();

const prop = oneOfType([number, string, arrayOf(oneOfType([number, string]))]);

const propTypes = {
	width: prop,
	w: prop,
	fontSize: prop,
	f: prop,
	color: prop,
	bg: prop,
	m: prop,
	mt: prop,
	mr: prop,
	mb: prop,
	ml: prop,
	mx: prop,
	my: prop,
	p: prop,
	pt: prop,
	pr: prop,
	pb: prop,
	pl: prop,
	px: prop,
	py: prop,
};

type BaseProps = {
	[k in keyof typeof propTypes]?: string | string[] | number | number[]
};

const withTooltip = (Base: React.StatelessComponent) => {
	return ({ ...props }: any) => {
		if (props.tooltip) {
			props = tooltip.bindProps(props);
		}
		delete props.tooltip;
		return <Base {...props} />;
	};
};

export const withStyledSystem = (child: React.StatelessComponent) => {
	const Base = styled<BaseProps>(child)`
		${space} ${width} ${fontSize} ${color};
	`;

	Base.displayName = getDisplayName(child);
	Base.propTypes = propTypes;

	return (props: any) => {
		return <Base {...props} />;
	};
};

// This middleware allows component to fallback to the default theme when
// rendered without a ThemeProvider wrappwer
export const withDefaultTheme = (
	Base: React.ComponentClass | React.StatelessComponent,
) => {
	if (!Base.defaultProps) {
		Base.defaultProps = {};
	}

	(Base.defaultProps as any).theme = theme;

	return (props: any) => {
		return <Base {...props} />;
	};
};

const Tag = tag(blacklist);

export default compose(withDefaultTheme, withTooltip, withStyledSystem, Tag);
