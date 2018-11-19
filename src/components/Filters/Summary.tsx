import { JSONSchema6 } from 'json-schema';
import * as React from 'react';
import { FaBookmarkO } from 'react-icons/lib/fa/';
import { FiltersView, ViewScope } from 'rendition';
import styled from 'styled-components';
import Button from '../Button';
import { Box, Flex } from '../Grid';
import Input from '../Input';
import Modal from '../Modal';
import Select from '../Select';
import Txt from '../Txt';
import FilterDescription from './FilterDescription';

const BorderedDiv = styled.div`
	margin-top: 15px;
	padding: 6px 11px 0;
	border: solid 1px #979797;
`;

interface FilterSummaryProps {
	edit: (rule: JSONSchema6) => void;
	delete: (rule: JSONSchema6) => void;
	saveView: (name: string, scope: string | null) => void;
	filters: JSONSchema6[];
	views: FiltersView[];
	scopes?: ViewScope[];
	schema: JSONSchema6;
	dark?: boolean;
}

interface FilterSummaryState {
	name: string;
	showForm: boolean;
	id: string;
	scope: string | null;
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
			scope: this.props.scopes ? this.props.scopes[0].slug : null,
		};
	}

	save() {
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
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.value;
		this.setState({ name });
	}

	render() {
		const { scopes } = this.props;
		return (
			<BorderedDiv>
				{this.state.showForm && (
					<Modal
						title="Save current view"
						cancel={() => this.setState({ showForm: false })}
						done={() => this.save()}
						action="Save"
					>
						<form onSubmit={e => e.preventDefault() || this.save()}>
							{!!scopes &&
								scopes.length > 1 && (
									<Flex mb={30}>
										<Txt width={90}>Visible to:</Txt>
										<Select
											ml={10}
											mt="-7px"
											width="auto"
											value={this.state.scope}
											onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
												this.setState({
													scope: e.target.value,
												})
											}
										>
											{scopes.map(({ name, slug }) => (
												<option key={slug} value={slug}>
													{name}
												</option>
											))}
										</Select>
									</Flex>
								)}

							<Input
								width="100%"
								value={this.state.name}
								placeholder="Enter a name for the view"
								onChange={e => this.handleChange(e)}
								autoFocus
							/>
						</form>
					</Modal>
				)}
				<Flex justify="space-between">
					<Txt
						fontSize={13}
						mb={10}
						color={this.props.dark ? '#fff' : undefined}
					>
						Filters ({this.props.filters.length})
					</Txt>

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
				<Flex wrap>
					{this.props.filters.map((filter, index) => {
						return (
							<Box mb={10} mr={10} key={index}>
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
			</BorderedDiv>
		);
	}
}

export default FilterSummary;
