import * as React from 'react';
import { Txt, TxtProps } from '../../components/Txt';
import { Heading } from '../../components/Heading';
import { Link } from '../../components/Link';
import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import sanitize from 'rehype-sanitize';
import raw from 'rehype-raw';
import prism from '@mapbox/rehype-prism';
import { Divider } from '../../components/Divider';
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
`;

type components = {
	[element: string]: (props: any) => JSX.Element | React.ReactElement | Element;
};

export const getProcessor = (
	componentOverrides?: components,
	sanitizerOptions?: any,
	disableRawHtml?: boolean,
	disableCodeHighlight?: boolean,
	decorators?: Decorator[] | undefined,
) => {
	let processor = unified()
		.use(remarkParse, { gfm: true })
		.use(remarkRehype, { allowDangerousHtml: !disableRawHtml });

	if (!disableCodeHighlight) {
		processor = processor.use(prism, { ignoreMissing: true });
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
	theme: Theme;
	/** Specifies the options used when sanitizing the generated HTML. Passing `null` would disable the sanitization. */
	sanitizerOptions?: any; // https://github.com/syntax-tree/hast-util-sanitize#schema
	/** When disabled it does not renders raw html in markdown */
	disableRawHtml?: boolean;
	/** When disabled code blocks will not highlight syntax */
	disableCodeHighlight?: boolean;
	/** Decorate part of the text if it matches some condition */
	decorators?: Decorator[];
};

export const MarkdownBase = ({
	children,
	componentOverrides,
	sanitizerOptions,
	disableRawHtml,
	disableCodeHighlight,
	decorators,
	...rest
}: MarkdownProps) => {
	const content = React.useMemo(() => {
		return (getProcessor(
			componentOverrides,
			sanitizerOptions,
			disableRawHtml,
			disableCodeHighlight,
			decorators,
		).processSync(children) as any).result; // type any because vFile types doesn't contains result, even though it should.
	}, [
		componentOverrides,
		sanitizerOptions,
		disableRawHtml,
		disableCodeHighlight,
		decorators,
		children,
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
export const Markdown = withTheme(MarkdownBase);
