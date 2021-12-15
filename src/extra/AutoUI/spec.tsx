import React from 'react';
import { mount } from 'enzyme';
import { Provider, Table } from '../..';
import {
	autoUIRunTransformers,
	autoUIGetModelForCollection,
	AutoUIProps,
	AutoUI,
} from './index';
import {
	dataExample,
	AugmentedSshKey,
	transformers,
	model as sshKeyModel,
} from './models/example';
const props = {} as AutoUIProps<AugmentedSshKey>;
const TestAutoUI = () => <Demo {...props} />;

const Demo = ({ data, model, ...otherProps }: AutoUIProps<AugmentedSshKey>) => {
	const memoizedData = React.useMemo(
		() =>
			autoUIRunTransformers(dataExample, transformers, {
				accessRole: 'administrator',
			}),
		[dataExample],
	) as AugmentedSshKey[];

	return (
		<AutoUI<AugmentedSshKey>
			data={data ?? memoizedData}
			model={model ?? autoUIGetModelForCollection(sshKeyModel)}
			actions={[]}
			{...otherProps}
		/>
	);
};

describe('AutoUI', () => {
	describe('Collection component', () => {
		it('should render the collection with N results', () => {
			const component = mount(
				<Provider>
					<TestAutoUI />
				</Provider>,
			);
			const table = component.find(Table);
			const tableRows = table.find(
				'[data-display="table-body"] [data-display="table-row"]',
			);

			expect(tableRows).toHaveLength(dataExample.length);
		});
	});
});
