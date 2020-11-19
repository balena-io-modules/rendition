jest.mock('mermaid', () => 'Mermaid');

import React from 'react';
import { render } from '@testing-library/react';
import omit from 'lodash/omit';
import forEach from 'lodash/forEach';
import { Provider } from '../../';
import JsonSchemaRenderer from '.';
import allExamples, { CONTEXT_FUNCTIONS, EXTRA_FORMATS } from './examples';

describe.only('JsonSchemaRenderer component', () => {
	const examples = omit(allExamples, 'A mermaid field', 'A date time field');
	forEach(examples, (example, label) => {
		it(label, () => {
			const { container } = render(
				<Provider>
					{/* @ts-ignore */}
					<JsonSchemaRenderer
						validate
						{...example}
						extraFormats={EXTRA_FORMATS}
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
