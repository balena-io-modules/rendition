import React from 'react';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { Form } from '../Form';
import { Modal } from '../Modal';
import { Txt } from '../Txt';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import FilterDescription from './FilterDescription';

interface ViewData {
	name: string;
}

export interface SummaryProps {
	filters: JSONSchema[];
	onEdit: (filter: JSONSchema) => void;
	onDelete: (filter: JSONSchema) => void;
	onClearFilters: () => void;
	showSaveView?: boolean;
	onSaveView: (viewData: ViewData) => void;
}

const schema: JSONSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
	},
};

export const Summary = ({
	filters,
	onEdit,
	onDelete,
	onClearFilters,
	showSaveView,
	onSaveView,
}: SummaryProps) => {
	const [showViewForm, setShowViewForm] = React.useState(false);
	const [viewData, setViewData] = React.useState<ViewData | undefined>();
	return (
		<>
			<Flex flex="1" flexDirection="column">
				<Flex flex="1" justifyContent="space-between">
					<Flex>
						<Txt bold>Filters</Txt>
						<Txt mr={1}>({filters.length})</Txt>
						<Button plain primary onClick={onClearFilters}>
							Clear all
						</Button>
					</Flex>
					{showSaveView && (
						<Flex>
							<Button plain primary onClick={() => setShowViewForm(true)}>
								Save view
							</Button>
						</Flex>
					)}
				</Flex>
				<Flex flexWrap="wrap">
					{filters.map((filter, index) => (
						<FilterDescription
							key={filter.$id || index}
							filter={filter}
							onClick={() => {
								onEdit(filter);
							}}
							onClose={() => onDelete(filter)}
						/>
					))}
				</Flex>
			</Flex>
			{showViewForm && (
				<Modal
					title="Save current view"
					cancel={() => setShowViewForm(false)}
					done={() => {
						if (!viewData?.name) {
							return;
						}
						onSaveView(viewData);
						setShowViewForm(false);
					}}
					action="Save"
					primaryButtonProps={{
						disabled: !viewData?.name,
					}}
				>
					<Form
						width="100%"
						hideSubmitButton
						liveValidate
						onFormChange={({ formData }: { formData: { name: string } }) =>
							setViewData(formData)
						}
						schema={schema}
						value={viewData}
					/>
				</Modal>
			)}
		</>
	);
};
