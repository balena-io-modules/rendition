import React from 'react';
import { mount } from 'enzyme';
import { Provider, Table } from '../../';
import {
	AutoUICollectionProps,
	autoUIRunTransformers,
	AutoUICollection,
	autoUIGetModelForCollection,
} from './Collection';
import {
	dataExample,
	AugmentedSshKey,
	transformers,
	model as sshKeyModel,
} from './models/example';
const props = {} as AutoUICollectionProps<AugmentedSshKey>;
const TestCollection = () => <DemoCollection {...props} />;

const DemoCollection = ({
	data,
	model,
	...otherProps
}: AutoUICollectionProps<AugmentedSshKey>) => {
	const memoizedData = React.useMemo(
		() =>
			autoUIRunTransformers(dataExample, transformers, {
				accessRole: 'administrator',
			}),
		[dataExample],
	) as AugmentedSshKey[];

	return (
		<AutoUICollection<AugmentedSshKey>
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
					<TestCollection />
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
