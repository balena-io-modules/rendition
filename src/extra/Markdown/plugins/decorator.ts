import unified from 'unified';
import visit from 'unist-util-visit';
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
		const [captureGroupStartIndex, captureGroupEndIndex] = result.indices[
			captureGroupIndex
		];
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

export interface Decorator {
	match: RegExp;
	captureGroupIndex?: number;
	component: string;
	properties?: any;
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

	const visitor: visit.Visitor<any> = (node) => {
		const decorator = options.decorators!.find((entry) => {
			return node.type === 'text' && entry.match.test(node.value);
		});

		if (!decorator) {
			return;
		}

		node.type = 'element';
		node.tagName = 'span';
		node.children = splitTextIntoNodes(node.value, decorator);

		return visit.SKIP;
	};

	return (tree) => {
		visit(tree, visitor);
	};
};
