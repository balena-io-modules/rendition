import React from 'react';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import { Flex } from '../Flex';
import { Modal } from '../Modal';
import { Select } from '../Select';
import debounce from 'lodash/debounce';
import {
	createFilter,
	EditSchema,
	getOperators,
	getSignatures,
	Operator,
	OperatorSlugs,
} from './SchemaSieve';
import { Txt } from '../Txt';
import { getDataModel } from '../DataTypes';
import { Form } from '../Form';
import { FilterSignature } from '.';
import {
	FilterSignatureWithKey,
	getPropertyScheme,
	getSchemaTitle,
	getSubSchemaFromRefScheme,
} from './SchemaSieve';
import { Button } from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

type FilterSignatureInternal = Omit<FilterSignatureWithKey, 'operator'> &
	Partial<Pick<FilterSignature, 'operator'>>;
interface PropertyOption {
	key: string;
	field: string;
	title: string;
	refScheme?: string;
}
export interface FilterModalProps {
	schema: JSONSchema;
	editFilter?: JSONSchema;
	addFilter: (filter: JSONSchema) => void;
	onClose: () => void;
}

export const FilterModal = ({
	schema,
	editFilter,
	addFilter,
	onClose,
}: FilterModalProps) => {
	const properties: PropertyOption[] | undefined = React.useMemo(() => {
		if (!schema.properties || typeof schema.properties === 'boolean') {
			return;
		}
		const constructedProperties: PropertyOption[] = Object.entries(
			schema.properties,
		).flatMap(([key, value]: [string, JSONSchema]) => {
			const refScheme = getPropertyScheme(value);
			if (!refScheme?.length) {
				return {
					key,
					field: key,
					title: getSchemaTitle(value, key),
				};
			} else {
				return refScheme.map((ref: string) => {
					return {
						key: `${key}__${ref}`,
						field: key,
						title: getSchemaTitle(value, key, ref),
						refScheme: ref,
					};
				});
			}
		});
		return constructedProperties.sort((a, b) => (a.title > b.title ? 1 : -1));
	}, [schema]);

	const newSignature: FilterSignatureInternal | null = properties
		? {
				key: properties[0].refScheme
					? `${properties[0].field}__${properties[0].refScheme}`
					: properties[0].field,
				title: properties[0].title,
				field: properties[0].field,
				operator: undefined,
				value: undefined,
				refScheme: properties[0].refScheme,
		  }
		: null;

	const [signatures, setSignatures] = React.useState<FilterSignatureInternal[]>(
		editFilter ? getSignatures(editFilter) : newSignature ? [newSignature] : [],
	);

	if (!properties || !newSignature) {
		return null;
	}

	const addSignature = (signature: FilterSignatureInternal, index: number) => {
		if (!signatures) {
			return;
		}
		if (!signatures.length) {
			setSignatures([{ ...signature }]);
		} else if (signatures.length >= index + 1) {
			signatures[index] = { ...signature };
			setSignatures([...signatures]);
		} else {
			setSignatures([...signatures, { ...signature }]);
		}
	};

	const removeSignature = (index: number) => {
		const newSignatures = signatures.filter((_f, i) => index !== i);
		setSignatures(newSignatures);
	};

	const isValid = (
		signs: FilterSignatureInternal[],
	): signs is Array<
		typeof signatures[number] &
			Required<Pick<typeof signatures[number], 'field' | 'operator' | 'value'>>
	> =>
		signs.every(
			(s) => s.field && s.operator && s.value != null && s.value !== '',
		);

	const createAndAddFilter = () => {
		if (!isValid(signatures)) {
			return;
		}
		const filter = createFilter(schema, signatures);
		return filter ? addFilter(filter) : onClose();
	};

	return (
		<Modal
			title="Filter by"
			cancel={onClose}
			done={createAndAddFilter}
			primaryButtonProps={{
				disabled: !isValid(signatures),
			}}
			action="Save"
		>
			{signatures.map((signature, index) => (
				<Flex flexDirection="column" key={(signature.field || '') + index}>
					{index > 0 && <Txt my={2}>OR</Txt>}
					<Flex>
						<FilterInputs
							properties={properties}
							signature={signature}
							schema={schema}
							onUpdate={(signature) => addSignature(signature, index)}
						/>
						{index > 0 && (
							<Button
								color="tertiary.main"
								ml={2}
								plain
								fontSize={1}
								p={1}
								onClick={() => removeSignature(index)}
							>
								<FontAwesomeIcon icon={faTimes} />
							</Button>
						)}
					</Flex>
				</Flex>
			))}
			<Button
				mb={2}
				mt={4}
				primary
				underline
				onClick={() => addSignature(newSignature, signatures.length)}
			>
				Add alternative
			</Button>
		</Modal>
	);
};

interface FilterInputs {
	properties: PropertyOption[];
	signature: FilterSignatureInternal;
	schema: JSONSchema;
	onUpdate: (signature: FilterSignatureInternal) => void;
}

const FilterInputs = ({
	properties,
	signature,
	schema,
	onUpdate,
}: FilterInputs) => {
	const [searchTerm, setSearchTerm] = React.useState('');
	const debouncedSetSearchTerm = debounce(setSearchTerm, 300);
	const operators = React.useMemo(
		() => (signature.field ? getOperators(schema, signature.field) : []),
		[signature.field, schema],
	);
	const filteredFieldOptions = React.useMemo(() => {
		if (!searchTerm) {
			return properties;
		}
		const searchTermRegEx = new RegExp(searchTerm, 'i');
		return properties.filter((property) => {
			return (
				property.title.match(searchTermRegEx) ||
				property.field.match(searchTermRegEx)
			);
		});
	}, [searchTerm, properties]);

	React.useEffect(() => {
		if (signature.operator) {
			return;
		}
		onUpdate({ ...signature, operator: operators[0] });
	}, [signature.field, operators]);
	return (
		<Flex justifyContent="space-between">
			<Select<PropertyOption>
				mr={1}
				id="filtermodal__fieldselect"
				options={filteredFieldOptions}
				onSearch={debouncedSetSearchTerm}
				searchPlaceholder="Search..."
				valueKey="key"
				labelKey="title"
				value={signature}
				onChange={({ option }) => {
					if (
						signature.field === option.field &&
						signature.title === option.title
					) {
						return;
					}
					onUpdate({
						...signature,
						...option,
						operator: undefined,
						value: undefined,
						refScheme: option.refScheme,
					});
				}}
			/>
			<Select<Operator<OperatorSlugs>>
				mr={1}
				options={operators}
				valueKey="slug"
				labelKey="label"
				value={signature.operator}
				onChange={({ option }) => {
					if (option.slug === signature.operator?.slug) {
						return;
					}
					onUpdate({ ...signature, operator: option });
				}}
			/>
			<Flex maxWidth={165}>
				<FilterInput
					schema={schema.properties![signature.field!]! as JSONSchema}
					value={signature.value}
					operator={signature.operator}
					onUpdate={(value) => {
						onUpdate({ ...signature, value });
					}}
					refScheme={signature.refScheme}
				/>
			</Flex>
		</Flex>
	);
};

interface FilterInputProps {
	schema: JSONSchema;
	value: any | undefined;
	operator: Operator<OperatorSlugs> | undefined;
	onUpdate: (value: any) => void;
	refScheme?: string;
}

const FilterInput = ({
	schema,
	value,
	operator,
	onUpdate,
	refScheme,
}: FilterInputProps) => {
	const subSchema = refScheme
		? { ...getSubSchemaFromRefScheme(schema, refScheme) }
		: { ...schema };
	if (Array.isArray(subSchema.type)) {
		subSchema.type = subSchema.type.find((t) => !!t);
	}
	const model = getDataModel(subSchema);
	const uiSchema =
		model && 'uiSchema' in model ? model.uiSchema?.(schema) || {} : {};
	const newSchema =
		model && operator && 'editSchema' in model
			? (model.editSchema as EditSchema)(subSchema, operator)
			: subSchema;

	return (
		<Form
			schema={newSchema}
			value={value}
			onFormChange={({ formData }) => onUpdate(formData)}
			uiSchema={{ 'ui:options': { label: false, inline: true }, ...uiSchema }}
			hideSubmitButton
		/>
	);
};
