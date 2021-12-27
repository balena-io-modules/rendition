import * as React from 'react';
import styled, { css } from 'styled-components';
import { style } from 'styled-system';
import asRendition, { styledSystemProps } from '../../asRendition';
import {
	RenditionSystemProps,
	StyledSystemProps,
	Theme,
} from '../../common-types';
import { monospace } from '../../utils';
import { Copy } from '../Copy';
import difference from 'lodash/difference';
import pick from 'lodash/pick';

const styledPropsKeys = styledSystemProps.filter(
	(s) => !['bg', 'color', 'background', 'fontSize'].includes(s),
);

export const code = (props: Pick<ThemedTxtProps, 'theme' | 'code'>) =>
	props.code
		? css`
				font-family: ${(props) => props.theme.monospace};
				padding: 2px 4px;
				font-size: 1em;
				color: #c7254e;
				background-color: #f9f2f4;
		  `
		: null;

export const whitespace = (
	props: Pick<ThemedTxtProps, 'theme' | 'whitespace'>,
) =>
	props.whitespace
		? css`
				white-space: ${props.whitespace};
		  `
		: null;

export const caps = (props: Pick<ThemedTxtProps, 'theme' | 'caps'>) =>
	props.caps
		? css`
				text-transform: uppercase;
				letter-spacing: 0.2em;
		  `
		: null;

export const italic = (props: Pick<ThemedTxtProps, 'theme' | 'italic'>) =>
	props.italic
		? css`
				font-style: italic;
		  `
		: null;

export const bold = (props: Pick<ThemedTxtProps, 'theme' | 'bold'>) =>
	props.bold
		? css`
				font-weight: ${props.theme.weights[props.theme.weights.length - 1]};
		  `
		: null;

export const truncate = (props: ThemedTxtProps) =>
	props.truncate &&
	css`
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	`;

export const align = style({
	key: 'text-align',
	prop: 'align',
	cssProperty: 'text-align',
});

export const BaseTxt = styled.div<TxtProps>`
	${align}
	${monospace}
	${whitespace}
	${code}
	${caps}
	${bold}
	${italic}
	${truncate}
`;

// TODO: check if there is a better way to type "as" prop
const Factory = (tag?: string) => {
	return asRendition<React.FunctionComponent<TxtProps>>(
		(props: TxtProps) => {
			if (props.copy == null) {
				return <BaseTxt as={tag as never} {...props} />;
			}
			const styledProps: Partial<StyledSystemProps> = pick(
				props,
				styledPropsKeys,
			);
			const otherPropsKeys = difference(Object.keys(props), styledPropsKeys);
			const otherProps = pick(props, otherPropsKeys);
			return (
				<Copy
					show={props.showCopyMode || 'hover'}
					content={props.copy}
					onCopy={props.onCopy}
					{...styledProps}
				>
					<BaseTxt as={tag as never} {...otherProps} />
				</Copy>
			);
		},
		[],
		styledPropsKeys,
	);
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

export interface InternalTxtProps
	extends Omit<React.HTMLAttributes<HTMLElement>, 'onCopy'> {
	/** If true, render text in a monospace font */
	monospace?: boolean;
	/** If true, render text in a bold font */
	bold?: boolean;
	/** If true, render text in an italic font style */
	italic?: boolean;
	/** If true, it renders the text in way that makes it look like code */
	code?: boolean;
	/** If true, render text in uppercase */
	caps?: boolean;
	/** Equivalent to the CSS white-space property, one of 'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'initial', 'inherit' */
	whitespace?: Whitespace;
	/** Align text inside the component, one of 'left', 'right', 'center', 'justify', 'justify-all', 'start', 'end', 'match-parent', 'inherit', 'initial', 'unset' */
	align?: Align;
	/** If true, replace the text not contained in the container with three dots */
	truncate?: boolean;
	/** Displays a copy icon which copies the given string to the user's clipboard onClick */
	copy?: string | number;
	/**  Setting to 'always' ensures that the copy icon is always visible. 'hover' ensures that the copy icon is only visible on hover. By default, this is set to 'hover'. */
	showCopyMode?: 'hover' | 'always';
	onCopy?: React.EventHandler<
		React.ClipboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
	>;
}

export interface ThemedTxtProps extends InternalTxtProps {
	theme: Theme;
}

export type TxtProps = InternalTxtProps & RenditionSystemProps;

Base.displayName = 'Txt';
Base.span = Factory('span');
Base.p = Factory('p');

/**
 * Displays a text block. A `<span>` tag can be used with `<Txt.span>` and a `<p>` tag can be used with `<Txt.p>`.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Txt/Txt.stories.tsx)
 */
export const Txt = Base;
