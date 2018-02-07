import assign = require('lodash/assign');
import cloneDeep = require('lodash/cloneDeep');
import find = require('lodash/find');
import first = require('lodash/first');
import map = require('lodash/map');
import * as moment from 'moment';
import * as React from 'react';
import { FaFilter, FaSearch } from 'react-icons/lib/fa';
import { FilterRule, FiltersProps, SingleFilterView } from 'rendition';
import styled from 'styled-components';
import Theme from '../../theme';
import * as utils from '../../utils';
import Button from '../Button';
import { Box, Flex } from '../Grid';
import Modal from '../Modal';
import PineTypes from '../PineTypes';
import Select from '../Select';
import SchemaSieve from './SchemaSieve';
import FilterSummary from './Summary';
import ViewsMenu from './ViewsMenu';

/**
 * The filter component requires the following props:
 * rules - an array of filter rule objects
 * schema - a SchemaSieve schema
 * views - an array of objects, each of which contains an array of predefined filter views,
 * setRules - a method that is called to set rules
 * setViews - a method that is called to set views
 */

const sieve = SchemaSieve();

const SimpleSearchBox = styled.div`
	position: relative;
	width: 500px;
	border-bottom: 2px solid ${Theme.colors.gray.main};
	padding-left: 20px;
	padding-top: 3px;
	margin-left: 30px;
	margin-right: 30px;

	.search-icon {
		position: absolute;
		top: 7px;
		left: 0;
		color: ${Theme.colors.gray.main};
	}

	input {
		background: transparent;
		box-shadow: none;
		border: none;
		width: 100%;
		font-size: inherit;
		padding: 5px;
		::placeholder {
			font-style: italic;
			color: ${Theme.colors.gray.main};
		}
	}
`;

const FilterWrapper = styled(Box)`
	position: relative;
`;

const FilterInput = (props: any) => {
	const PineTypeInput = PineTypes[props.type].Edit;

	return (
		<PineTypeInput
			schema={props.schema}
			value={props.value}
			operator={props.operator}
			onChange={props.onChange}
		/>
	);
};

interface FiltersState {
	showModal: boolean;
	edit: Partial<FilterRule>;
	searchString: string;
}

class Filters extends React.Component<FiltersProps, FiltersState> {
	constructor(props: FiltersProps) {
		super(props);
		this.handleEditChange = this.handleEditChange.bind(this);
		this.generateFreshEdit = this.generateFreshEdit.bind(this);

		const { rules } = this.props;
		const existingRule = find(rules, { name: sieve.SIMPLE_SEARCH_NAME });

		this.state = {
			showModal: false,
			edit: this.generateFreshEdit(),
			searchString: (existingRule && existingRule.value) || '',
		};

		// Clean exsting rules on load
		this.filterAndSetRules(rules);
	}

	componentWillReceiveProps(nextProps: FiltersProps) {
		const currentRules = nextProps.rules;
		const existing = find(currentRules, { name: sieve.SIMPLE_SEARCH_NAME });
		if (existing) {
			const { value } = existing;
			if (value !== this.state.searchString) {
				this.setState({ searchString: value });
			}
		} else {
			this.setState({ searchString: '' });
		}
	}

	/**
	 * Remove filter rules that don't have a matching schema entry.
	 * This can happen if the provided rules are from an old version of the
	 * provided schema. Rather than making wrapper code handle this, we just clean
	 * up rules as they are output from this component.
	 */
	filterInvalidRules(rules: FilterRule[]) {
		return rules.filter(
			rule =>
				(rule.name === sieve.SIMPLE_SEARCH_NAME && rule.value) ||
				this.props.schema.hasOwnProperty(rule.name),
		);
	}

	filterAndSetRules(rules: FilterRule[]) {
		this.props.setRules(this.filterInvalidRules(rules));
	}

	generateFreshEdit() {
		if (!this.props.schema) {
			return {};
		}
		const inputModels = sieve.makeFilterInputs(this.props.schema);

		const edit: Partial<FilterRule> = {
			name: Object.keys(inputModels).shift(),
			value: '',
		};

		edit.operator = inputModels[edit.name!].availableOperators[0].value;
		edit.label = inputModels[edit.name!].label;
		edit.type = inputModels[edit.name!].type;

		return this.setDefaultEditData(edit, edit.name!);
	}

	addFilterRule(rule: FilterRule) {
		const { rules } = this.props;
		rules.push(rule);
		this.filterAndSetRules(rules);
	}

	editFilterRule(rule: FilterRule) {
		const { rules } = this.props;
		const updatedRules = rules.map(r => (r.id === rule.id ? rule : r));

		this.filterAndSetRules(updatedRules);
	}

	addRule() {
		const inputModels = sieve.makeFilterInputs(this.props.schema);

		const rule = cloneDeep(this.state.edit);
		const baseRule = inputModels[rule.name!];
		const newRule = assign(cloneDeep(baseRule), rule);

		if (newRule.id) {
			this.editFilterRule(newRule as FilterRule);
		} else {
			newRule.id = utils.randomString();
			this.addFilterRule(newRule as FilterRule);
		}
		this.setState({
			showModal: false,
			edit: this.generateFreshEdit(),
		});
	}

	updateSimpleSearch(val: string) {
		this.setState({ searchString: val });
		const { rules } = this.props;
		const existingRule = find(rules, { name: sieve.SIMPLE_SEARCH_NAME });
		if (existingRule) {
			existingRule.value = val;
			this.editFilterRule(existingRule);
		} else {
			this.addFilterRule({
				name: sieve.SIMPLE_SEARCH_NAME,
				value: val,
				id: utils.randomString(),
			} as FilterRule);
		}
	}

	showEditModal(rule: FilterRule) {
		this.setState({
			showModal: true,
			edit: cloneDeep(rule),
		});
	}

	removeRule(rule: FilterRule) {
		if (rule.name === sieve.SIMPLE_SEARCH_NAME) {
			this.setState({ searchString: '' });
		}

		const { rules } = this.props;

		const updatedRules = rules.filter(r => r.id !== rule.id);
		this.filterAndSetRules(updatedRules);
	}

	setDefaultEditData(data: Partial<FilterRule>, value: string) {
		const update = cloneDeep(data);
		const inputModels = sieve.makeFilterInputs(this.props.schema);
		const model = inputModels[value];
		update.type = model.type;
		update.name = value;
		update.operator = model.availableOperators[0].value;
		update.label = model.label;
		if (model.type === 'Date Time') {
			update.value = moment().format('YYYY-MM-DDTHH:mm');
		} else if (model.type === 'Date') {
			update.value = moment().format('YYYY-MM-DD');
		} else if (model.type === 'Time') {
			update.value = moment().format('HH:mm');
		} else if (model.type === 'Enum') {
			update.value = first(this.props.schema[model.name].values);
		} else {
			update.value = '';
		}

		return update;
	}

	handleEditChange(value: string, attribute: keyof FilterRule) {
		let update = this.state.edit;

		if (attribute === 'name' && update.name !== value) {
			update = this.setDefaultEditData(update, value);
		} else if (attribute === 'operator') {
			update.value = null;
			update[attribute] = value;
		} else {
			update[attribute] = value;
		}

		this.setState({ edit: update });
	}

	saveView(name: string, scopeKey: string) {
		const { rules } = this.props;
		let { views } = this.props;

		const newView = {
			name,
			rules: cloneDeep(rules),
			id: utils.randomString(),
			scopeKey,
		};

		if (!views) {
			views = [];
		}

		const store = find(views, item => item.key === scopeKey);

		if (store) {
			store.data.push(newView);

			this.props.setViews(views);
		}
	}

	deleteView(view: SingleFilterView, scopeKey: string) {
		const { views } = this.props;

		const store = find(views, item => item.key === scopeKey);

		if (store) {
			store.data = store.data.filter(v => v.id !== view.id);

			this.props.setViews(views);
		}
	}

	showNewFilterModal() {
		this.setState({
			showModal: true,
			edit: this.generateFreshEdit(),
		});
	}

	render() {
		const inputModels = sieve.makeFilterInputs(this.props.schema);
		const rules = this.props.rules || [];

		return (
			<FilterWrapper mb={3}>
				<Flex justify="space-between">
					<Button
						disabled={this.props.disabled}
						primary
						onClick={() => this.showNewFilterModal()}
						{...this.props.addFilterButtonProps}
					>
						<FaFilter style={{ marginRight: 10 }} />
						Add filter
					</Button>

					<SimpleSearchBox>
						<input
							style={{ color: this.props.dark ? '#fff' : null }}
							disabled={this.props.disabled}
							placeholder="Search entries..."
							value={this.state.searchString}
							onChange={e => this.updateSimpleSearch(e.target.value)}
						/>
						<FaSearch className="search-icon" name="search" />
					</SimpleSearchBox>

					<ViewsMenu
						buttonProps={this.props.viewsMenuButtonProps}
						disabled={this.props.disabled}
						rules={rules}
						views={this.props.views || []}
						schema={this.props.schema}
						setRules={rules => this.filterAndSetRules(rules)}
						deleteView={(view, scopeKey) => this.deleteView(view, scopeKey)}
					/>
				</Flex>

				{this.state.showModal && (
					<div>
						<Modal
							title="Filter by"
							cancel={() => this.setState({ showModal: false })}
							done={() => this.addRule()}
							action={this.state.edit.id ? 'Update filter' : 'Add filter'}
						>
							<form onSubmit={e => e.preventDefault() || this.addRule()}>
								<Flex>
									<Select
										mr={20}
										value={this.state.edit.name}
										onChange={(e: Event) =>
											this.handleEditChange(
												(e.target as HTMLSelectElement).value,
												'name',
											)
										}
									>
										{map(inputModels, ({ name, label }) => (
											<option key={name} value={name}>
												{label || name}
											</option>
										))}
									</Select>
									<Select
										mr={20}
										value={this.state.edit.operator}
										onChange={(e: Event) =>
											this.handleEditChange(
												(e.target as HTMLSelectElement).value,
												'operator',
											)
										}
									>
										{map(
											inputModels[this.state.edit.name!].availableOperators,
											({ value, label }) => (
												<option value={value} key={value}>
													{label}
												</option>
											),
										)}
									</Select>
									{inputModels[this.state.edit.name!].type !== 'Boolean' && (
										<FilterInput
											operator={this.state.edit.operator}
											schema={this.props.schema[this.state.edit.name!]}
											value={this.state.edit.value}
											onChange={(value: string) =>
												this.handleEditChange(value, 'value')
											}
											type={inputModels[this.state.edit.name!].type}
											autoFocus
										/>
									)}
								</Flex>
							</form>
						</Modal>
					</div>
				)}

				{!!rules.length &&
					!this.props.disabled && (
						<FilterSummary
							edit={(rule: FilterRule) => this.showEditModal(rule)}
							delete={(rule: FilterRule) => this.removeRule(rule)}
							saveView={(name, scope) => this.saveView(name, scope)}
							rules={rules}
							views={this.props.views || []}
							schema={this.props.schema}
							dark={!!this.props.dark}
						/>
					)}
			</FilterWrapper>
		);
	}
}

export default Filters;
