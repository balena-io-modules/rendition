import unified from 'unified';
import type { Element } from 'hast';
import visit from 'unist-util-visit';
import { toString } from 'hast-util-to-string';

export const mermaidPlugin: unified.Plugin = () => {
	return (tree) => {
		visit(tree, 'element', (node: Element, index, parent: Element) => {
			if (
				!parent ||
				parent.tagName !== 'pre' ||
				index === null ||
				node.tagName !== 'code' ||
				!(node.properties?.className instanceof Array) ||
				!node.properties.className.includes('language-mermaid')
			) {
				return;
			}

			parent.children.splice(index, 1, {
				type: 'element',
				tagName: 'mermaid',
				properties: {
					value: toString(node),
				},
				children: [],
			});
		});
	};
};
