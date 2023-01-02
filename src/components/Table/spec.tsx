import { mount } from 'enzyme';
import first from 'lodash/first';
import get from 'lodash/get';
import last from 'lodash/last';
import map from 'lodash/map';
import noop from 'lodash/noop';
import reverse from 'lodash/reverse';
import React from 'react';
import sinon from 'sinon';
import PokeDex, { PokedexInterface } from '../../stories/assets/pokedex';

import { Pager, Provider, Table } from '../../';
import { TableColumn, TableColumnSelectorSizer } from '.';
import { TableBase } from './TableBase';

const columns = [
	{
		field: 'Name',
		sortable: true,
		selected: true,
	},
	{
		field: 'pokedex_number',
		label: 'National Pokedex Number',
		sortable: true,
		selected: true,
		render: (value: any) => <code>{value}</code>,
	},
	{
		field: 'Category',
		sortable: true,
		selected: false,
	},
	{
		field: 'first_seen',
		label: 'First Seen',
		sortable: true,
		selected: true,
	},
] as Array<TableColumn<PokedexInterface>>;

const getRowClass = (pokemon: any) => {
	const classNames = ['pokemon'];

	if (pokemon.caught) {
		classNames.push('pokemon--caught');
	}
	if (pokemon.Abilities.length === 1) {
		classNames.push('pokemon--one-dimensional');
	}

	return classNames;
};

describe('Table component', () => {
	describe('columns property', () => {
		it('should render a table header cell for each column', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface> columns={columns} data={PokeDex} />
				</Provider>,
			);

			expect(
				component.find(
					'[data-display="table-head"] [data-display="table-cell"]',
				),
			).toHaveLength(columns.length);
		});

		describe('column.label property', () => {
			it('should use the field property as a title if a label is not provided', () => {
				const cols = [
					{
						field: 'Name',
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				const cell = component.find(
					'[data-display="table-head"] [data-display="table-cell"]',
				);

				expect(cell.text()).toEqual('Name');
			});

			it('should only render the fields specified in the `columns` attribute', () => {
				const cols = [
					{
						field: 'Name',
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				const cellsText = component
					.find('[data-display="table-body"] [data-display="table-cell"]')
					.map((element) => element.text());

				const dataText = map(PokeDex, cols[0].field);

				expect(cellsText).toEqual(dataText);
			});
		});

		describe('column.label property', () => {
			it('should use the label property as a title if it is provided', () => {
				const cols = [
					{
						field: 'Name',
						label: 'Foobarbaz',
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				const cell = component.find(
					'[data-display="table-head"] [data-display="table-cell"]',
				);

				expect(cell.text()).toEqual('Foobarbaz');
			});

			it('should be able to provide a JSX element as a label', () => {
				const cols = [
					{
						field: 'Name',
						label: <span className="test-label">Foobarbaz</span>,
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				expect(component.find('.test-label')).toHaveLength(1);
			});
		});

		describe('column.render property', () => {
			it('should use the render attribute to render cells if one is provided', () => {
				const cols = [
					{
						field: 'Name',
						render: (value: any) => <span className="test-cell">{value}</span>,
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				expect(component.find('.test-cell')).toHaveLength(PokeDex.length);
			});

			it('should call the render attribute with the columns field value and the row value', () => {
				const spy = sinon.spy((value) => value);
				const field = 'Name';

				const cols = [
					{
						field,
						render: spy,
					},
				] as any;

				mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				expect(spy.callCount).toEqual(PokeDex.length);

				const calls = map(spy.getCalls(), 'args');
				const expected = map(PokeDex, (item) => [item[field], item]);

				expect(calls).toEqual(expected);
			});
		});

		describe('column.sortable property', () => {
			it('should not render a button if colums are not sortable', () => {
				const cols = [
					{
						field: 'Name',
					},
					{
						field: 'pokedex_number',
					},
					{
						field: 'Category',
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				expect(
					component.find('[data-display="table-head"] button'),
				).toHaveLength(0);
			});

			it('should render a button if colums are sortable', () => {
				const cols = [
					{
						field: 'Name',
						sortable: true,
					},
					{
						field: 'pokedex_number',
						sortable: true,
					},
					{
						field: 'Category',
						sortable: true,
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				expect(
					component.find('[data-display="table-head"] button'),
				).toHaveLength(cols.length);
			});

			it('should sort by the specified sortable column on click', () => {
				const field = 'Name';
				const cols = [
					{
						field,
						sortable: true,
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				component.find('[data-display="table-head"] button').simulate('click');
				component.update();
				const cellsText = component
					.find('[data-display="table-body"] [data-display="table-cell"]')
					.map((element) => element.text());

				const expected = map(PokeDex, field).sort();

				expect(cellsText).toEqual(expected);
			});

			it('should reverse the sort order when clicking sortable column twice', () => {
				const field = 'Name';
				const cols = [
					{
						field,
						sortable: true,
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				component.find('[data-display="table-head"] button').simulate('click');
				component.update();
				component.find('[data-display="table-head"] button').simulate('click');
				component.update();
				const cellsText = component
					.find('[data-display="table-body"] [data-display="table-cell"]')
					.map((element) => element.text());

				const expected = reverse(map(PokeDex, field).sort());

				expect(cellsText).toEqual(expected);
			});

			it('should reverse the sort order when clicking sortable column twice', () => {
				const field = 'Name';
				const cols = [
					{
						field,
						sortable: true,
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				component.find('[data-display="table-head"] button').simulate('click');
				component.update();
				component.find('[data-display="table-head"] button').simulate('click');
				component.update();
				const cellsText = component
					.find('[data-display="table-body"] [data-display="table-cell"]')
					.map((element) => element.text());

				const expected = reverse(map(PokeDex, field).sort());

				expect(cellsText).toEqual(expected);
			});

			it('should allow a custom sorting function', () => {
				const field = 'Name';
				const biasName = get(last(PokeDex), field);
				const sorter = (a: any) => (a[field] === biasName ? -1 : 1);
				const cols = [
					{
						field,
						sortable: sorter,
					},
				] as any;

				const component = mount(
					<Provider>
						<Table<PokedexInterface> columns={cols} data={PokeDex} />
					</Provider>,
				);

				component.find('[data-display="table-head"] button').simulate('click');
				component.update();
				const cellText = component
					.find('[data-display="table-body"] [data-display="table-cell"]')
					.first()
					.text();

				expect(cellText).toEqual(biasName);
			});
		});
	});

	describe('data property', () => {
		it('should display the data fields specified in the `columns` attribute', () => {
			const cols = [
				{
					field: 'Name',
				},
			] as any;

			const data = [
				{
					id: 1,
					Name: 'Caterpie',
					Description: 'lorem ipsum dolor sit amet',
				},
				{
					id: 2,
					Name: 'Blastoise',
					Description: 'consecteur adipiscing elit, sed do eiusmod',
				},
			];

			const component = mount(
				<Provider>
					<Table<PokedexInterface> columns={cols} data={data} />
				</Provider>,
			);

			const cellsText = component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.map((element) => element.text());

			const dataText = map(data, 'Name');

			expect(cellsText).toEqual(dataText);
		});

		it('should update the table when data is added', () => {
			const cols = [
				{
					field: 'Name',
				},
			] as any;

			const data: PokedexInterface[] = [
				{
					id: 1,
					Name: 'Caterpie',
					Description: 'lorem ipsum dolor sit amet',
				},
				{
					id: 2,
					Name: 'Blastoise',
					Description: 'consecteur adipiscing elit, sed do eiusmod',
				},
			];

			const component = mount(
				React.createElement(
					(props) => (
						<Provider>
							<Table<PokedexInterface> {...props} />
						</Provider>
					),
					{ columns: cols, data },
				),
			);

			const cellsText = component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.map((element) => element.text());

			const dataText = map(data, 'Name');

			expect(cellsText).toEqual(dataText);

			data.push({
				id: 3,
				Name: 'Squrtle',
			});

			component.setProps({ data });

			const updatedCellsText = component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.map((element) => element.text());

			const updatedDataText = map(data, 'Name');

			expect(updatedCellsText).toEqual(updatedDataText);
		});

		it('should update the table when data is added and a render function is used', () => {
			const cols = [
				{
					field: 'Name',
					render: (value: any) => <p>Name: {value}</p>,
				},
			] as any;

			const data: PokedexInterface[] = [
				{
					id: 1,
					Name: 'Caterpie',
					Description: 'lorem ipsum dolor sit amet',
				},
				{
					id: 2,
					Name: 'Blastoise',
					Description: 'consecteur adipiscing elit, sed do eiusmod',
				},
			];

			const component = mount(
				React.createElement(
					(props) => (
						<Provider>
							<Table<PokedexInterface> {...props} />
						</Provider>
					),
					{ columns: cols, data },
				),
			);

			data.push({
				id: 3,
				Name: 'Squirtle',
			});

			component.setProps({ data });

			const cellsText = component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.map((element) => element.text());

			const dataText = map(data, (field) => `Name: ${field.Name}`);

			expect(cellsText).toEqual(dataText);
		});

		it('should not update the table when a data item changes in a mutable way', () => {
			const cols = [
				{
					field: 'Name',
				},
			] as any;

			const data = [
				{
					id: 1,
					Name: 'Caterpie',
					description: 'lorem ipsum dolor sit amet',
				},
				{
					id: 2,
					Name: 'Blastoise',
					description: 'consecteur adipiscing elit, sed do eiusmod',
				},
			];

			const component = mount(
				React.createElement(
					(props) => (
						<Provider>
							<Table<PokedexInterface> {...props} />
						</Provider>
					),
					{ columns: cols, data },
				),
			);

			const cellsText = component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.map((element) => element.text());

			const dataText = map(data, 'Name');

			expect(cellsText).toEqual(dataText);

			data[0].Name = 'Squirtle';

			component.setProps({ data });

			const updatedCellsText = component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.map((element) => element.text());

			const updatedDataText = map(data, 'Name');

			expect(updatedCellsText).not.toEqual(updatedDataText);
		});

		it('should update the table when a data item changes in an immutable way', () => {
			const cols = [
				{
					field: 'Name',
				},
			] as any;

			const data: PokedexInterface[] = [
				{
					id: 1,
					Name: 'Caterpie',
					Description: 'lorem ipsum dolor sit amet',
				},
				{
					id: 2,
					Name: 'Blastoise',
					Description: 'consecteur adipiscing elit, sed do eiusmod',
				},
			];

			const component = mount(
				React.createElement(
					(props) => (
						<Provider>
							<Table<PokedexInterface> {...props} />
						</Provider>
					),
					{ columns: cols, data },
				),
			);

			const cellsText = component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.map((element) => element.text());

			const dataText = map(data, 'Name');

			expect(cellsText).toEqual(dataText);

			data[0] = { id: 1, Name: 'Squirtle' };

			component.setProps({ data });

			const updatedCellsText = component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.map((element) => element.text());

			const updatedDataText = map(data, 'Name');

			expect(updatedCellsText).toEqual(updatedDataText);
		});
	});

	describe('getRowHref property', () => {
		it('should be used to generate an href for each row', () => {
			const cols = [
				{
					field: 'Name',
				},
			] as any;
			const fn = (row: any) => `https://www.pokemon.com/uk/pokedex/${row.Name}`;
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						getRowHref={fn}
						columns={cols}
						data={PokeDex}
					/>
				</Provider>,
			);

			const rowLinks = component
				.find('[data-display="table-body"] a')
				.map((element) => element.prop('href'));

			const dataLinks = PokeDex.map(fn);

			expect(rowLinks).toEqual(dataLinks);
		});
	});

	describe('onCheck property', () => {
		it('should cause a checkbox to be rendered in the header', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						rowKey="pokedex_number"
						onCheck={noop}
						columns={columns}
						data={PokeDex}
					/>
				</Provider>,
			);
			expect(
				component.find('[data-display="table-head"] input[type="checkbox"]'),
			).toHaveLength(1);
		});

		it('should cause a checkbox to be rendered on each row', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						rowKey="pokedex_number"
						onCheck={noop}
						columns={columns}
						data={PokeDex}
					/>
				</Provider>,
			);
			expect(
				component.find('[data-display="table-body"] input[type="checkbox"]'),
			).toHaveLength(PokeDex.length);
		});

		it('should show a disabled checkbox for disabled rows', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						rowKey="pokedex_number"
						onCheck={noop}
						columns={columns}
						data={PokeDex}
						disabledRows={PokeDex.slice(0, 2).map((r) => r.pokedex_number)}
					/>
				</Provider>,
			);
			expect(
				component.findWhere((n) => {
					return (
						n.type() === 'input' &&
						n.prop('type') === 'checkbox' &&
						n.prop('disabled') === true
					);
				}),
			).toHaveLength(2);
		});

		it('should select all rows except the disabled ones when clicking the header checkbox', () => {
			const disabled = 2;
			const spy = sinon.spy();
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						rowKey="pokedex_number"
						onCheck={spy}
						columns={columns}
						data={PokeDex}
						disabledRows={PokeDex.slice(0, disabled).map(
							(r) => r.pokedex_number,
						)}
					/>
				</Provider>,
			);

			component
				.find('[data-display="table-head"] input[type="checkbox"]')
				.simulate('change');
			component.update();

			const elements = component
				.find('[data-display="table-body"] input[type="checkbox"]')
				.filterWhere((element) => !!element.props().checked);

			expect(elements).toHaveLength(PokeDex.length - disabled);
			expect(spy.callCount).toEqual(1);
			expect(spy.firstCall.args).toEqual([PokeDex.slice(disabled)]);
		});

		it('should increment or decrement the checked rows as you check/uncheck checkboxes', () => {
			const spy = sinon.spy();
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						rowKey="pokedex_number"
						onCheck={spy}
						columns={columns}
						data={PokeDex}
					/>
				</Provider>,
			);

			const elements = component.find(
				'[data-display="table-body"] input[type="checkbox"]',
			);

			elements.first().simulate('change');
			component.update();
			expect(spy.callCount).toEqual(1);
			expect(spy.firstCall.args).toEqual([PokeDex.slice(0, 1)]);

			elements.at(1).simulate('change');
			component.update();
			expect(spy.callCount).toEqual(2);
			expect(spy.secondCall.args).toEqual([PokeDex.slice(0, 2)]);

			elements.at(2).simulate('change');
			component.update();
			expect(spy.callCount).toEqual(3);
			expect(spy.thirdCall.args).toEqual([PokeDex.slice(0, 3)]);

			elements.at(2).simulate('change');
			component.update();
			expect(spy.callCount).toEqual(4);
			expect(spy.getCall(3).args).toEqual([PokeDex.slice(0, 2)]);

			elements.at(1).simulate('change');
			component.update();
			expect(spy.callCount).toEqual(5);
			expect(spy.getCall(4).args).toEqual([PokeDex.slice(0, 1)]);
		});
	});

	describe('onRowClick property', () => {
		it('should be called when clicking a row', () => {
			const clickIndex = 5;
			const cols = [
				{
					field: 'Name',
				},
			] as Array<TableColumn<PokedexInterface>>;
			const spy = sinon.spy();
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						onRowClick={spy}
						rowKey="pokedex_number"
						columns={cols}
						data={PokeDex}
					/>
				</Provider>,
			);

			component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.first()
				.simulate('click');
			expect(spy.callCount).toEqual(1);
			expect(spy.firstCall.args[0]).toEqual(first(PokeDex));

			component
				.find('[data-display="table-body"] [data-display="table-cell"]')
				.at(clickIndex)
				.simulate('click');
			expect(spy.callCount).toEqual(2);
			expect(spy.secondCall.args[0]).toEqual(PokeDex[clickIndex]);
		});
	});

	describe('rowAnchorAttributes property', () => {
		it('should be added to each row', () => {
			const cols = [
				{
					field: 'Name',
				},
			] as any;
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						rowAnchorAttributes={{ 'data-foo': 'bar' } as any}
						columns={cols}
						data={PokeDex}
					/>
				</Provider>,
			);

			const elements = component.find(
				'[data-display="table-body"] [data-foo="bar"]',
			);
			expect(elements).toHaveLength(PokeDex.length);
		});
	});

	describe('tbodyPrefix property', () => {
		it('should insert an element at the top of the table body', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						tbodyPrefix={<span className="foobarbaz" />}
						columns={columns}
						data={PokeDex}
					/>
				</Provider>,
			);

			expect(
				component.find('[data-display="table-body"] span.foobarbaz'),
			).toHaveLength(1);
		});
	});

	describe('highlightedRows property', () => {
		it('should highlight the specified row', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						rowKey="pokedex_number"
						highlightedRows={[2]}
						columns={
							[{ field: 'Name' }] as Array<TableColumn<PokedexInterface>>
						}
						data={PokeDex}
					/>
				</Provider>,
			);

			const match = component.find('[data-highlight=true]');
			expect(match).toHaveLength(1);
			expect(match.text()).toEqual('Ivysaur');
		});

		it('should be able to highlight multiple rows', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						rowKey="pokedex_number"
						highlightedRows={[3, 5]}
						columns={
							[{ field: 'Name' }] as Array<TableColumn<PokedexInterface>>
						}
						data={PokeDex}
					/>
				</Provider>,
			);

			const match = component.find('[data-highlight=true]');
			expect(match).toHaveLength(2);
			expect(match.map((e) => e.text())).toEqual(['Venusaur', 'Charmeleon']);
		});
	});

	describe('itemsPerPage property', () => {
		it('should limit the number of items shown at one time', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						columns={
							[{ field: 'Name' }] as Array<TableColumn<PokedexInterface>>
						}
						data={PokeDex}
						usePager
						pagination={{ itemsPerPage: 3 }}
					/>
				</Provider>,
			);

			const match = component.find(
				'[data-display="table-body"] [data-display="table-row"]',
			);
			expect(match).toHaveLength(3);

			const result = PokeDex.slice(0, 3).map((p) => p.Name);

			expect(match.map((e) => e.text())).toEqual(result);
		});
	});

	describe('usePager property', () => {
		it('should display a pager', () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						columns={
							[{ field: 'Name' }] as Array<TableColumn<PokedexInterface>>
						}
						data={PokeDex}
						usePager
					/>
				</Provider>,
			);

			expect(component.find(Pager)).toHaveLength(1);
		});

		it("shouldn't display a pager if there are no items", () => {
			const component = mount(
				<Provider>
					<Table<PokedexInterface>
						columns={
							[{ field: 'Name' }] as Array<TableColumn<PokedexInterface>>
						}
						data={[]}
						usePager
					/>
				</Provider>,
			);

			expect(component.find(Pager)).toHaveLength(0);
		});

		it('should reset the page if the data length becomes less than the current pager value', () => {
			const component = mount(
				React.createElement(
					(props: any) => (
						<Provider>
							<Table<PokedexInterface> {...props} />
						</Provider>
					),
					{
						columns: [{ field: 'Name' }] as any,
						data: PokeDex,
						pagination: { itemsPerPage: 2 },
						usePager: true,
					},
				),
			);

			const table: any = component.find(TableBase).instance();
			expect(table.state.page).toEqual(0);
			table.incrementPage();
			table.incrementPage();
			expect(table.state.page).toEqual(2);
			component.setProps({ data: PokeDex.slice(0, 2) });
			expect(table.state.page).toEqual(0);
		});
	});
});

describe('getRowClass property', () => {
	it('should add a class to every row', () => {
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					getRowClass={getRowClass}
					columns={columns}
					data={PokeDex}
				/>
			</Provider>,
		);

		const elements = component.find(
			'[data-display="table-body"] [data-display="table-row"]',
		);
		expect(elements).toHaveLength(PokeDex.length);
		elements.forEach((node) => {
			expect(node.hasClass('pokemon')).toEqual(true);
		});
	});

	it('should not add any classes if not present', () => {
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					columns={columns}
					data={PokeDex}
				/>
			</Provider>,
		);

		const elements = component.find(
			'[data-display="table-body"] [data-display="table-row"]',
		);
		expect(elements).toHaveLength(PokeDex.length);
		elements.forEach((node) => {
			expect(node.hasClass('pokemon')).toEqual(false);
		});
	});
});

describe('control selected rows', () => {
	it('should select the first two rows', () => {
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					columns={columns}
					data={PokeDex}
					checkedItems={PokeDex.slice(0, 2)}
				/>
			</Provider>,
		);

		const table: any = component.find(TableBase).instance();
		expect(table.state.checkedItems.length).toEqual(2);
		expect(table.state.allChecked).toEqual('some');
	});
});

describe('manually select rows', () => {
	it('should select the first two rows', () => {
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					columns={columns}
					data={PokeDex}
				/>
			</Provider>,
		);

		const table: any = component.find(TableBase).instance();
		expect(table.state.checkedItems.length).toEqual(0);

		table.setRowSelection(PokeDex.slice(0, 2));
		expect(table.state.checkedItems.length).toEqual(2);
		expect(table.state.allChecked).toEqual('some');
	});

	it('should select all rows', () => {
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					columns={columns}
					data={PokeDex}
				/>
			</Provider>,
		);

		const table: any = component.find(TableBase).instance();
		expect(table.state.checkedItems.length).toEqual(0);

		table.setRowSelection(PokeDex);
		expect(table.state.checkedItems.length).toEqual(PokeDex.length);
		expect(table.state.allChecked).toEqual('all');
	});

	it('should clear all rows', () => {
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					columns={columns}
					data={PokeDex}
				/>
			</Provider>,
		);

		const table: any = component.find(TableBase).instance();
		expect(table.state.checkedItems.length).toEqual(0);

		table.setRowSelection(PokeDex);
		expect(table.state.checkedItems.length).toEqual(PokeDex.length);
		expect(table.state.allChecked).toEqual('all');

		table.setRowSelection([]);
		expect(table.state.checkedItems.length).toEqual(0);
		expect(table.state.allChecked).toEqual('none');
	});

	it('should clear selection if data is set to null after instantiation', () => {
		const component = mount(
			React.createElement(
				(props: any) => (
					<Provider>
						<Table<PokedexInterface> {...props} />
					</Provider>
				),
				{ columns, rowKey: 'pokedex_number', data: PokeDex as any },
			),
		);

		const table: any = component.find(TableBase).instance();
		expect(table.state.checkedItems.length).toEqual(0);

		table.setRowSelection(PokeDex);
		expect(table.state.checkedItems.length).toEqual(PokeDex.length);

		component.setProps({ data: null } as any);
		table.setRowSelection([]);

		expect(table.state.checkedItems.length).toEqual(0);
		expect(table.state.allChecked).toEqual('none');
	});
});

describe('sorting', () => {
	it('should invoke the sort callback when sort header is clicked', () => {
		const spy = sinon.spy();
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					onSort={spy}
					columns={columns}
					data={PokeDex}
				/>
			</Provider>,
		);

		const elements = component.find(
			'[data-display="table-head"] [data-display="table-cell"] button',
		);

		elements.first().simulate('click');
		component.update();
		expect(spy.callCount).toEqual(1);
		expect(spy.firstCall.args[0]).toEqual({ field: 'Name', reverse: false });
	});

	it('should set the sorted column based on the passed sort property', () => {
		const defaultSort = { field: 'Name', reverse: true };
		const updatedSort = { field: 'pokedex_number', reverse: false };
		const component = mount(
			React.createElement(
				(props: any) => (
					<Provider>
						<Table<PokedexInterface> {...props} />
					</Provider>
				),
				{
					rowKey: 'pokedex_number',
					sort: defaultSort,
					columns,
					data: PokeDex,
				},
			),
		);

		const table: any = component.find(TableBase).instance();
		expect(table.state.sort).toEqual(defaultSort);
		component.setProps({ sort: updatedSort });
		expect(table.state.sort).toEqual(updatedSort);
	});
});

describe('custom columns', () => {
	it('should render the Table component with a cog', () => {
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					columns={columns}
					data={PokeDex}
					enableCustomColumns
				/>
			</Provider>,
		);

		const cog = component.find(TableColumnSelectorSizer);
		expect(cog).toBeDefined();
	});
	it('should render only selected columns', () => {
		const component = mount(
			<Provider>
				<Table<PokedexInterface>
					rowKey="pokedex_number"
					columns={columns}
					data={PokeDex}
					enableCustomColumns
				/>
			</Provider>,
		);
		const cols = component.find(
			'[data-display="table-head"] [data-display="table-cell"]',
		);
		const numberOfColumnsToShow = columns.filter((c) => c.selected).length;

		expect(cols).toHaveLength(numberOfColumnsToShow);
	});
});
