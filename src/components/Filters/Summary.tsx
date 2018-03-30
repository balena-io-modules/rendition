import every = require('lodash/every');
import * as React from 'react';
import { FaBookmarkO } from 'react-icons/lib/fa/';
import { FilterRule, FilterViewScope, Schema } from 'rendition';
import styled from 'styled-components';
import Button from '../Button';
import { Box, Flex } from '../Grid';
import Input from '../Input';
import Modal from '../Modal';
import types from '../PineTypes';
import Select from '../Select';
import Text from '../Text';
import FilterDescription from './FilterDescription';
import SchemaSieve from './SchemaSieve';

const sieve = SchemaSieve();

const BorderedDiv = styled.div`
	margin-top: 15px;
	padding: 6px 11px 0;
	border: solid 1px #979797;
`;

export const isValidRule = (rule: FilterRule) =>
	types.hasOwnProperty(rule.type);

interface FilterSummaryProps {
	edit: (rule: FilterRule) => void;
	delete: (rule: FilterRule) => void;
	saveView: (name: string, scope: string) => void;
	rules: FilterRule[];
	views: FilterViewScope[];
	schema: Schema;
	dark?: boolean;
}

interface FilterSummaryState {
	name: string;
	showForm: boolean;
	id: string;
	scope: string;
}

class FilterSummary extends React.Component<
	FilterSummaryProps,
	FilterSummaryState
> {
	constructor(props: FilterSummaryProps) {
		super(props);
		this.state = {
			name: '',
			showForm: false,
			id: '',
			scope: props.views[0].key,
		};
	}

	setExistingId(e: Event) {
		const id = (e.target as HTMLInputElement).value;
		this.setState({ id });
	}

	setViewScope(scope: string) {
		this.setState({ scope });
	}

	handleChange(e: Event) {
		const name = (e.target as HTMLInputElement).value;
		this.setState({ name });
	}

	save() {
		const { name, id, scope } = this.state;

		if (!name && !id) {
			return;
		}

		this.props.saveView(name, scope);

		this.setState({
			name: '',
			showForm: false,
			id: '',
		});
	}

	render() {
		if (every(this.props.rules, r => !isValidRule(r))) {
			return null;
		}

		return (
			<BorderedDiv>
				<Flex justify="space-between">
					<Text
						fontSize={13}
						mb={10}
						color={this.props.dark ? '#fff' : undefined}
					>
						Filters ({this.props.rules.length})
					</Text>

					<Button
						primary
						plaintext
						fontSize={13}
						mt={-7}
						onClick={() => this.setState({ showForm: !this.state.showForm })}
					>
						<FaBookmarkO style={{ marginRight: 6 }} />
						Save view
					</Button>
				</Flex>
				{this.state.showForm && (
					<Modal
						title="Save current view"
						cancel={() => this.setState({ showForm: false })}
						done={() => this.save()}
						action="Save"
					>
						<form onSubmit={e => e.preventDefault() || this.save()}>
							{this.props.views.length > 1 && (
								<Flex mb={30}>
									<Text width={90}>Visible to:</Text>
									<Select
										ml={10}
										mt="-7px"
										width="auto"
										value={this.state.scope}
										onChange={(e: Event) =>
											this.setViewScope((e.target as HTMLInputElement).value)
										}
									>
										{this.props.views.map(item => (
											<option key={item.key} value={item.key}>
												{item.scopeLabel}
											</option>
										))}
									</Select>
								</Flex>
							)}

							<Input
								width="100%"
								value={this.state.name}
								placeholder="Enter a name for the view"
								onChange={(e: Event) => this.handleChange(e)}
								autoFocus
							/>
						</form>
					</Modal>
				)}
				<Flex wrap>
					{this.props.rules.map(rule => {
						if (!isValidRule(rule)) {
							return null;
						}

						return (
							<Box mb={10} mr={10} key={rule.id}>
								<FilterDescription
									dark={this.props.dark}
									schema={this.props.schema[rule.name]}
									rule={rule}
									edit={
										rule.name === sieve.SIMPLE_SEARCH_NAME
											? false
											: () => this.props.edit(rule)
									}
									delete={() => this.props.delete(rule)}
								/>
							</Box>
						);
					})}
				</Flex>
			</BorderedDiv>
		);
	}
}

export default FilterSummary;
