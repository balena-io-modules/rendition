jest.mock('mermaid', () => 'Mermaid');

import React from 'react';
import { render } from '@testing-library/react';
import forEach from 'lodash/forEach';
import { Provider } from '../..';
import { Renderer } from '.';
import allExamples, { CONTEXT_FUNCTIONS, EXTRA_FORMATS } from './examples';

describe.only('Renderer component', () => {
	const {
		['A mermaid field']: _aMermaidField,
		['A date time field']: _aDateTimeField,
		...exampledToTest
	} = allExamples;
	forEach(exampledToTest, (example, label) => {
		it(label, () => {
			const { container } = render(
				<Provider
					widgets={{
						renderer: {
							formats: EXTRA_FORMATS,
						},
					}}
				>
					{/* @ts-expect-error */}
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
