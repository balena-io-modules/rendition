import difference from 'lodash/difference';
import { arrayOf, number, oneOfType, string } from 'prop-types';
import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import {
	color,
	display,
	fontSize,
	height,
	maxHeight,
	maxWidth,
	minHeight,
	minWidth,
	space,
	width,
} from 'styled-system';
import { StyledSystemProps } from './common-types';
import { Tooltips } from './tooltips';
import { compose } from './utils';

// Returns the display name of a React component. Falls back to 'Component'.
export const getDisplayName = (component: React.ComponentType): string => {
	if (typeof component === 'string') {
		return component;
	}

	if (!component) {
		return 'Component';
	}

	return component.displayName || component.name || 'Component';
};

const tooltip = new Tooltips();

const prop = oneOfType([number, string, arrayOf(oneOfType([number, string]))]);

const propTypes = {
	width: prop,
	minWidth: prop,
	maxWidth: prop,
	height: prop,
	minHeight: prop,
	maxHeight: prop,
	display: prop,
	fontSize: prop,
	color: prop,
	bg: prop,
	backgroundColor: prop,
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

export const styledSystemProps = Object.keys(propTypes);

const filterStyledSystemProps =
	(passthroughProps: string[]) => (Base: React.ComponentType<{ ref: any }>) => {
		const omitProps = difference(styledSystemProps, passthroughProps);
		return React.forwardRef((props: { [key: string]: any }, ref) => {
			const nextProps = { ...props };
			for (const k of omitProps) {
				delete nextProps[k];
			}
			return <Base {...nextProps} ref={ref} />;
		});
	};

export const withStyledSystem = (child: React.ComponentType) => {
	const Base = styled(child)<StyledSystemProps>`
		${space}
		${width}
    ${minWidth}
    ${maxWidth}
    ${height}
    ${minHeight}
    ${maxHeight}
    ${display}
		${fontSize}
		${color}
	`;

	Base.displayName = getDisplayName(child);

	// The styled component messes up with the propTypes typings. We don't really need typesafety here anyway, so it is safe to just ignore it.
	// @ts-expect-error
	Base.propTypes = propTypes;

	return React.forwardRef((props: any, ref: any) => {
		return <Base {...props} ref={ref} />;
	});
};

export const withTooltip = (Base: React.ComponentType) => {
	return React.forwardRef(({ ...props }: any, ref: any) => {
		if (!props.tooltip) {
			return <Base {...props} ref={ref} />;
		}
		const tooltipProps = tooltip.bindProps(props);
		delete props.tooltip;
		return props.disabled ? (
			<span
				style={{ display: 'contents' }}
				onClick={tooltipProps.onClick}
				onMouseEnter={tooltipProps.onMouseEnter}
				onMouseLeave={tooltipProps.onMouseLeave}
			>
				<Base {...props} ref={ref} />
			</span>
		) : (
			<Base {...tooltipProps} ref={ref} />
		);
	});
};

export default function asRendition<T>(
	component: React.ComponentType | React.ForwardRefExoticComponent<T>,
	additionalEnhancers: Array<
		(Base: React.ComponentType) => React.ComponentType
	> = [],
	passthroughProps: string[] = [],
) {
	return compose(
		withTheme,
		...(additionalEnhancers || []),
		withTooltip,
		withStyledSystem,
		filterStyledSystemProps(passthroughProps),
	)(component) as unknown as T;
}
