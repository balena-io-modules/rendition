jest.mock('mermaid', () => 'Mermaid');

import React from 'react';
import { render } from '@testing-library/react';
import omit from 'lodash/omit';
import forEach from 'lodash/forEach';
import { Provider } from '../..';
import { Renderer } from '.';
import allExamples, { CONTEXT_FUNCTIONS, EXTRA_FORMATS } from './examples';

describe.only('Renderer component', () => {
	const examples = omit(allExamples, 'A mermaid field', 'A date time field');
	forEach(examples, (example, label) => {
		it(label, () => {
			const { container } = render(
				<Provider
					widgets={{
						renderer: {
							formats: EXTRA_FORMATS,
						},
					}}
				>
					{/* @ts-ignore */}
					<Renderer
						validate
						{...example}
						extraContext={{
							...CONTEXT_FUNCTIONS,
							root: example.value,
						}}
					/>
				</Provider>,
			);

			expect(container).toMatchSnapshot();
		});
	});
});
