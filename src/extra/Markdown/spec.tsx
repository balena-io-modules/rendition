import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from '../../';
import { Markdown } from '.';
import suite from './specsuite';

export const codeBlocks = `
## Code blocks

\`\`\`
// This is plaintext
const foo = () => {
return 'bar'
}
\`\`\`

\`\`\`javascript
// This is javascript
const foo = () => {
  return 'bar'
}
\`\`\`
`;

export const htmlBlocks = `

## Inline HTML

<strong>An image:</strong>
<br>
<img src="https://balena.io" />
<br>
<em>A link:</em>
<a target="_blank" href="http://github.com/">http://github.com/</a>

## Keyboard keys

<kbd>cmd</kbd> + <kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>a</kbd>
`;

export const sanitizeBlocks = `
<img src=x onerror=alert(123) />
`;

describe('Markdown component', () => {
	it('should not highlight code when disabled', () => {
		const { container } = render(
			<Provider>
				<Markdown disableCodeHighlight>{codeBlocks}</Markdown>
			</Provider>,
		);
		expect(container).toMatchSnapshot();
	});

	it('should not sanitize html when disabled', () => {
		const { container } = render(
			<Provider>
				<Markdown sanitizerOptions={null}>{sanitizeBlocks}</Markdown>
			</Provider>,
		);
		expect(container).toMatchSnapshot();
	});

	it('should not render raw html when disabled', () => {
		const { container } = render(
			<Provider>
				<Markdown disableRawHtml>{htmlBlocks}</Markdown>
			</Provider>,
		);
		expect(container).toMatchSnapshot();
	});

	it('should decorate the text matching the condition', () => {
		const decorators = [
			{
				match: new RegExp(
					'(\\s|^)((@{1,2}|#|!{1,2})[a-z\\d-_\\/]+(\\.[a-z\\d-_\\/]+)*)(\\s|$)',
					'gmi',
				),
				captureGroupIndex: 2,
				component: 'span',
				properties: {
					style: {
						color: 'green',
					},
				},
			},
		];

		const { container } = render(
			<Provider>
				<Markdown decorators={decorators}>
					@good foo @bad@bad [@good](https://github.com) bar@bad baz qux. `Is
					@bad inside code` @good @good
				</Markdown>
			</Provider>,
		);
		expect(container).toMatchSnapshot();
	});

	suite.forEach((testCase) => {
		it(testCase.name, () => {
			const { container } = render(
				<Provider>
					<Markdown sanitizerOptions={testCase.sanitizerOptions}>
						{testCase.source}
					</Markdown>
				</Provider>,
			);

			expect(container).toMatchSnapshot();
		});
	});
});
