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
	SshKeyWithoutPermissions,
	dataExample,
	AugmentedSshKey,
	transformers,
	model,
} from './models/example';
const props = {} as AutoUICollectionProps<SshKeyWithoutPermissions>;
const TestCollection = () => <DemoCollection {...props} />;

const DemoCollection = (
	_props: AutoUICollectionProps<SshKeyWithoutPermissions>,
) => {
	const memoizedData = React.useMemo(
		() =>
			autoUIRunTransformers(dataExample, transformers, {
				accessRole: 'administrator',
			}),
		[dataExample],
	) as AugmentedSshKey[];

	return (
		<AutoUICollection<AugmentedSshKey>
			data={memoizedData}
			model={autoUIGetModelForCollection(model)}
			actions={[]}
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
