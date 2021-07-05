import unified from 'unified';
import type { Node, Literal, Parent } from 'unist';
import visitParents from 'unist-util-visit-parents';
import exec from 'regexp-match-indices';

const splitTextIntoNodes = (text: string, decorator: Decorator) => {
	// Reset the regex index state
	decorator.match.lastIndex = 0;

	const nodes: any[] = [];
	let lastIndex = 0;

	while (true) {
		// Find the next match
		const result = exec(decorator.match, text);

		if (!result) {
			break;
		}

		// This is useful when we want to decorate only single capture group.
		const captureGroupIndex = decorator.captureGroupIndex || 0;
		const [captureGroupStartIndex, captureGroupEndIndex] =
			result.indices[captureGroupIndex];
		const matchedString = text.slice(
			captureGroupStartIndex,
			captureGroupEndIndex,
		);

		// If there is a match, push text before the match and the match itself
		nodes.push(
			{
				type: 'text',
				value: text.substring(lastIndex, captureGroupStartIndex),
			},
			{
				type: 'element',
				tagName: decorator.component,
				properties: decorator.properties,
				children: [
					{
						type: 'text',
						value: matchedString,
					},
				],
			},
		);

		lastIndex = captureGroupEndIndex;

		// Regex is not stateful, multiple execs return the same value
		if (!decorator.match.global) {
			break;
		}
	}

	if (text.length > lastIndex) {
		nodes.push({
			type: 'text',
			value: text.substring(lastIndex),
		});
	}

	// Reset the regex index
	decorator.match.lastIndex = 0;

	return nodes;
};

const isLiteralNode = (node: Node): node is Literal => {
	return node.type === 'text';
};

interface Element extends Parent {
	type: 'element';
	tagName: string;
}
const isElementNode = (node: Node): node is Element => {
	return node.type === 'element';
};

const isCodeBlock = (node: Node): node is Element => {
	return isElementNode(node) && node.tagName === 'code';
};

export interface Decorator {
	match: RegExp;
	captureGroupIndex?: number;
	component: string;
	properties?: any;
	ignoreCodeBlock?: boolean;
}

interface DecoratorPluginOptions {
	decorators: Decorator[] | undefined;
}

export const decoratorPlugin: unified.Plugin<[DecoratorPluginOptions]> = (
	options: DecoratorPluginOptions,
) => {
	if (!options.decorators?.length) {
		return;
	}

	const visitor: visitParents.Visitor<Node> = (node, parents) => {
		if (!isLiteralNode(node) || typeof node.value !== 'string') {
			return;
		}
		const { value } = node;
		const decorator = options.decorators!.find((entry) => {
			return entry.match.test(value);
		});

		if (!decorator) {
			return;
		}

		if (decorator.ignoreCodeBlock !== false && parents.some(isCodeBlock)) {
			return visitParents.SKIP;
		}

		const element = node as Node as Element;
		element.type = 'element';
		element.tagName = 'span';
		element.children = splitTextIntoNodes(node.value, decorator);

		return visitParents.SKIP;
	};

	return (tree) => {
		visitParents(tree, visitor, true);
	};
};
