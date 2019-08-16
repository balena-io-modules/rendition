import { JSONSchema6 } from 'json-schema';
import * as React from 'react';
import { FiltersView, ViewScope } from '.';
import Button from '../Button';
import { Box, Flex } from '../Grid';
import Input from '../Input';
import Modal from '../Modal';
import Select from '../Select';
import Txt from '../Txt';
import FilterDescription from './FilterDescription';

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
			scope: this.props.scopes ? this.props.scopes[0].slug : null,
		};
	}

	save = (event?: React.FormEvent<HTMLFormElement>) => {
		if (event) {
			event.preventDefault();
		}

		const { name, scope } = this.state;

		if (!name) {
			return;
		}

		this.props.saveView(name, scope);

		this.setState({
			name: '',
			showForm: false,
			id: '',
		});
	};

	handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.value;
		this.setState({ name });
	}

	render() {
		const { scopes } = this.props;
		return (
			<Box p={3} mt={3} width="100%" bg="quartenary.light">
				{this.state.showForm && (
					<Modal
						title="Save current view"
						cancel={() => this.setState({ showForm: false })}
						done={this.save}
						action="Save"
					>
						<form onSubmit={this.save}>
							{!!scopes && scopes.length > 1 && (
								<Flex mb={4} alignItems="center">
									<Txt width={90}>Visible to:</Txt>
									<Select<ViewScope>
										ml={2}
										width="auto"
										options={scopes}
										valueKey="slug"
										labelKey="name"
										// TODO: Remove this logic and pass the primitive value when this is fixed: https://github.com/grommet/grommet/issues/3154
										value={scopes.find(x => x.slug === this.state.scope)}
										onChange={({ option }) =>
											this.setState({
												scope: option.slug,
											})
										}
									/>
								</Flex>
							)}

							<Input
								width="100%"
								value={this.state.name}
								placeholder="Enter a name for the view"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									this.handleChange(e)
								}
								autoFocus
							/>
						</form>
					</Modal>
				)}
				<Flex mb={2} justifyContent="space-between">
					<Flex>
						<Txt
							fontSize={13}
							color={this.props.dark ? '#fff' : 'secondary.main'}
						>
							Filters ({this.props.filters.length})
						</Txt>

						<Button
							primary
							plain
							fontSize={13}
							ml={3}
							onClick={() => this.setState({ showForm: !this.state.showForm })}
						>
							Save view
						</Button>
					</Flex>
					<Button
						danger
						plain
						fontSize={13}
						onClick={this.props.clearAllFilters}
					>
						Clear all filters
					</Button>
				</Flex>
				<Flex flexWrap="wrap">
					{this.props.filters.map((filter, index) => {
						return (
							<Box mr={3} mt={2} key={index}>
								<FilterDescription
									dark={this.props.dark}
									filter={filter}
									edit={() => this.props.edit(filter)}
									delete={() => this.props.delete(filter)}
								/>
							</Box>
						);
					})}
				</Flex>
			</Box>
		);
	}
}

export interface FilterSummaryProps {
	edit: (rule: JSONSchema6) => void;
	delete: (rule: JSONSchema6) => void;
	saveView: (name: string, scope: string | null) => void;
	clearAllFilters: () => void;
	filters: JSONSchema6[];
	views: FiltersView[];
	scopes?: ViewScope[];
	schema: JSONSchema6;
	dark?: boolean;
}

export interface FilterSummaryState {
	name: string;
	showForm: boolean;
	id: string;
	scope: string | null;
}

export default FilterSummary;
