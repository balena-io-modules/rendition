import * as React from 'react';
import Txt, { TxtProps } from '../../components/Txt';
import Heading from '../../components/Heading';
import Link from '../../components/Link';
import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import sanitize from 'rehype-sanitize';
import raw from 'rehype-raw';
import prism from '@mapbox/rehype-prism';
import Divider from '../../components/Divider';
import styled, { withTheme } from 'styled-components';
import gh from 'hast-util-sanitize/lib/github.json';
import { Theme } from '../../common-types';
import 'prismjs/themes/prism.css';
import { darken, lighten } from '../../utils';
export { gh as defaultSanitizerOptions };

const MarkdownWrapper = styled(Txt)`
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
		background: none;
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
) => {
	let processor = unified()
		.use(remarkParse, { gfm: true })
		.use(remarkRehype, { allowDangerousHtml: !disableRawHtml });

	if (!disableCodeHighlight) {
		processor = processor.use(prism);
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

	return processor.use(rehypeReact, {
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
};

type MarkdownProps = TxtProps & {
	children: string;
	componentOverrides?: components;
	theme: Theme;
	sanitizerOptions?: any; // https://github.com/syntax-tree/hast-util-sanitize#schema
	disableRawHtml?: boolean;
	disableCodeHighlight?: boolean;
};

export const MarkdownBase = ({
	children,
	componentOverrides,
	sanitizerOptions,
	disableRawHtml,
	disableCodeHighlight,
	...props
}: MarkdownProps) => {
	return (
		<MarkdownWrapper {...props}>
			{
				(getProcessor(
					componentOverrides,
					sanitizerOptions,
					disableRawHtml,
					disableCodeHighlight,
				).processSync(children) as any).result // type any because vFile types doesn't contains result, even though it should.
			}
		</MarkdownWrapper>
	);
};

export const Markdown = withTheme(MarkdownBase);
