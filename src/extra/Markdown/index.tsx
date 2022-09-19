import * as React from 'react';
import breaks from 'remark-breaks';
import { Txt, TxtProps } from '../../components/Txt';
import { Heading } from '../../components/Heading';
import { Link } from '../../components/Link';
import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import sanitize from 'rehype-sanitize';
import autoLinkHeadings from 'rehype-autolink-headings';
import slug from 'rehype-slug';
import raw from 'rehype-raw';
import prism from '@mapbox/rehype-prism';
import { Divider } from '../../components/Divider';
import { px } from 'styled-system';
import styled, { withTheme } from 'styled-components';
import gh from 'hast-util-sanitize/lib/github.json';
import { Theme } from '../../common-types';
import defaultStyle from './defaultStyle';
import { darken, lighten } from '../../utils';
import { Decorator, decoratorPlugin } from './plugins/decorator';
export { gh as defaultSanitizerOptions };

const MarkdownWrapper = styled(Txt)`
	${defaultStyle}

	* {
		box-sizing: border-box;
	}

	& code {
		background-color: ${(props) => props.theme.colors.gray.light};
		padding: 0.2em 0px;
		margin: 0px;
		border-radius: 3px;
		line-height: 1.2;
	}

	& p {
		margin-top: 0;
		margin-bottom: ${(props) => px(props.theme.space[2])};
		&:last-child {
			margin-bottom: 0 !important;
		}
	}

	& pre {
		background-color: ${(props) => props.theme.colors.gray.light};
	}

	& pre > code {
		display: block;
		background: none;
		overflow-y: auto;
	}

	& code,
	kbd,
	pre {
		font-family: ${(props) => props.theme.monospace};
	}

	& kbd {
		display: inline-block;
		padding: 3px 5px;
		font-size: 11px;
		line-height: 10px;
		color: ${(props) => props.theme.colors.text.main};
		vertical-align: middle;
		background-color: ${(props) => lighten(props.theme.colors.gray.light)};
		border: solid 1px ${(props) => props.theme.colors.gray.main};
		border-bottom-color: ${(props) =>
			darken(props.theme.colors.gray.main, 0.1)};
		border-radius: 3px;
		box-shadow: inset 0 -1px 0 ${(props) => darken(props.theme.colors.gray.main, 0.1)};
	}

	dl {
		padding: 0;
	}

	dl dt {
		padding: 0;
		margin-top: 16px;
		font-size: 1em;
		font-style: italic;
		font-weight: ${(props) => props.theme.weights[1]};
	}

	dl dd {
		padding: 0 16px;
		margin-bottom: 16px;
	}

	td,
	th {
		padding: 0;
	}

	table {
		border-spacing: 0;
		border-collapse: collapse;
		display: block;
		width: 100%;
		overflow: auto;
	}

	table th {
		font-weight: ${(props) => props.theme.weights[1]};
	}

	table th,
	table td {
		padding: 6px 13px;
		border: 1px solid ${(props) => props.theme.colors.gray.main};
	}

	table tr {
		background-color: #fff;
		border-top: 1px solid ${(props) => props.theme.colors.gray.light};
	}

	table tr:nth-child(2n) {
		background-color: ${(props) => props.theme.colors.gray.light};
	}

	blockquote {
		margin: 0;
	}

	blockquote,
	dl,
	table {
		margin-top: 0;
		margin-bottom: 16px;
	}

	blockquote {
		padding: 0 1em;
		color: ${(props) => props.theme.colors.text.main};
		border-left: 0.25em solid ${(props) => props.theme.colors.gray.main};
	}

	blockquote > :first-child {
		margin-top: 0;
	}

	blockquote > :last-child {
		margin-bottom: 0;
	}

	.heading-anchor-link span.icon {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA/1BMVEUAAAAAAAAAgIAAVVVAQIAzZmYrVYAkSW0wUHAtS2kmTXMkVW0sTm8pUnAnTmwmTHEuUm0tU3EpU24oUXIpUW4oT3ErUW0qTm0rUHErUW8qT3EsUHArUXApT3EqUW4sUXApT28qUXApT3ApT28rUG8qUW8pUHAqUG8rT28qT28rUG4qUG4pUW8qUXAqUG4pUW8qUHAqUHAqUG4qUW8rUW8qUW4qUG8rUW8qUHAqUG8qUG4qUG8qUG8qUW8pUG8rUHAqUG8pUG8pUW8rUG8qUW8qUG8qUG8rUG8qUG8rUW8qUG8rUG8qUG8qUG8qUG8qUG8qUG8qUG8qUG8qUG////+bGS/DAAAAU3RSTlMAAQIDBAUGBxARFBUXGRobHCIlJiwtLzE2PD1AQkRPUl5iZGpsbnBzd3p9f4iLjY6SmZ2eoausrrC1u7y9vr/Aw8vR0tTW3d7j5Onq6+zx9fr7/UBGcCYAAAABYktHRFTkA4ilAAAArElEQVQYGa3BV1bCUABAwQuhh94kICoISgfphmZEpYm0/e+Fl5Ccw7/McAPxrC7OFXlyuhjLWCRtGkUXnWkSpvzGw4XnN4dp0Mbghk6f0msC4b2FLvAJjSHq/FAAqt8SwoeK/asMPOwV8K7rNkjvg1S2PoS3CaCsV2ryRYOegu5xh+B/rkWKP+DC8LTFFDsomEZdLI1lxo4gt/5CWBzN48mwuONK+D4rpJz81xnMWxXLF2A3LAAAAABJRU5ErkJggg==');
		width: 20px;
		background-repeat: no-repeat;
		height: 20px;
		display: inline-block;
		transform-origin: 0px 0px;
		visibility: hidden;
	}
	.heading-anchor-link {
		position: absolute;
		top: 0;
		left: 0;
		transform: translateX(-100%);
		width: 20px;
		height: 20px;
		padding-right: 4px;
	}

	h1:hover .heading-anchor-link span.icon,
	h2:hover .heading-anchor-link span.icon,
	h3:hover .heading-anchor-link span.icon,
	h4:hover .heading-anchor-link span.icon,
	h5:hover .heading-anchor-link span.icon,
	h6:hover .heading-anchor-link span.icon {
		visibility: visible;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		position: relative;
	}
`;

type components = {
	[element: string]: (props: any) => JSX.Element | React.ReactElement | Element;
};

export const getProcessor = (
	componentOverrides?: components,
	sanitizerOptions?: any,
	disableRawHtml?: boolean,
	disableCodeHighlight?: boolean,
	disableAutoHeadingLinking?: boolean,
	decorators?: Decorator[] | undefined,
) => {
	let processor = unified()
		.use(remarkParse, { gfm: true })
		.use(breaks)
		.use(remarkRehype, { allowDangerousHtml: !disableRawHtml });

	if (!disableCodeHighlight) {
		processor = processor.use(prism, { ignoreMissing: true });
	}

	if (!disableAutoHeadingLinking) {
		processor = processor.use(slug).use(autoLinkHeadings, {
			properties: { className: 'heading-anchor-link' },
		});
	}

	if (!disableRawHtml) {
		processor = processor.use(raw);
	}

	if (sanitizerOptions !== null) {
		processor = processor.use(
			sanitize,
			sanitizerOptions ?? {
				...gh,
				attributes: {
					...gh.attributes,
					'*': [...gh.attributes['*'], 'class', 'className'],
				},
			},
		);
	}

	processor.use(rehypeReact, {
		createElement: React.createElement,
		components: {
			p: (props: any) => <Txt.p {...props} />,
			a: (props: any) => <Link {...props} />,
			h1: (props: any) => <Heading.h1 {...props} />,
			h2: (props: any) => <Heading.h2 {...props} />,
			h3: (props: any) => <Heading.h3 {...props} />,
			h4: (props: any) => <Heading.h4 {...props} />,
			h5: (props: any) => <Heading.h5 {...props} />,
			h6: (props: any) => <Heading.h6 {...props} />,
			hr: (props: any) => <Divider {...props} />,
			...componentOverrides,
		},
	});

	return processor.use(decoratorPlugin, {
		decorators,
	});
};

export type MarkdownProps = TxtProps & {
	/** The markdown source that should be rendered */
	children: string;
	/** Object specifying component Overrides. ex. `{ p: Txt.p }` */
	componentOverrides?: components;

	/** Specifies the options used when sanitizing the generated HTML. Passing `null` would disable the sanitization. */
	sanitizerOptions?: any; // https://github.com/syntax-tree/hast-util-sanitize#schema
	/** When disabled it does not renders raw html in markdown */
	disableRawHtml?: boolean;
	/** When disabled code blocks will not highlight syntax */
	disableCodeHighlight?: boolean;
	/** Decorate part of the text if it matches some condition */
	decorators?: Decorator[];
	/** Disable automatic heading linking */
	disableAutoHeadingLinking?: boolean;
};

export interface ThemedMarkdownProps extends MarkdownProps {
	theme: Theme;
}

export const MarkdownBase = ({
	children,
	componentOverrides,
	sanitizerOptions,
	disableRawHtml,
	disableCodeHighlight,
	decorators,
	disableAutoHeadingLinking,
	...rest
}: ThemedMarkdownProps) => {
	const content = React.useMemo(() => {
		return (
			getProcessor(
				componentOverrides,
				sanitizerOptions,
				disableRawHtml,
				disableCodeHighlight,
				disableAutoHeadingLinking,
				decorators,
			).processSync(children) as any
		).result; // type any because vFile types doesn't contains result, even though it should.
	}, [
		componentOverrides,
		sanitizerOptions,
		disableRawHtml,
		disableCodeHighlight,
		decorators,
		children,
		disableAutoHeadingLinking,
	]);

	return <MarkdownWrapper {...rest}>{content}</MarkdownWrapper>;
};

/**
 * A simple component for rendering [GitHub flavored markdown](https://github.github.com/gfm/). This component
 * sanitizes input.
 * This component is not loaded by default as it relies on a markdown parsing package
 * that you may not want to include in your application.
 * You can load this component using:
 *
 * ```
 * import { Markdown } from 'rendition/dist/extra/Markdown';
 * ```
 *
 * If you need to customize the conversion of markdown to HTML you can supply the `sanitizerOptions` prop. In this case, use the defaults as a starting point for your options:
 *
 * ```
 * import { Markdown, defaultSanitizerOptions } from 'rendition/dist/extra/Markdown';
 * ```
 *
 * Generated html inherits styles from rendition components. i.e an anchor will be
 * rendered as a `Link` component.
 *
 * Html inside the markdown is sanitized and stripped of any inline js and css. so
 * they will always be rendered.
 *
 * Components can be overridden by using `componentOverrides` prop.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/extra/Markdown/Markdown.stories.ts)
 */
export const Markdown = withTheme(
	MarkdownBase,
) as React.FunctionComponent<MarkdownProps>;
