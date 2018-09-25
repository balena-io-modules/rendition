import * as React from 'react';
import { FaArrowDown, FaArrowUp, FaClose, FaPlus } from 'react-icons/lib/fa';
import { ArrayFieldTemplateProps } from 'react-jsonschema-form';
import styled from 'styled-components';
import { Box, Button, Flex } from '../../../../';
import { WarningField } from '../WarningField';

interface ArrayFieldTitleProps {
	// TODO: type this property correctly one this PR is merged https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27164
	TitleField: any;
	idSchema: ArrayFieldTemplateProps['idSchema'];
	title?: string;
	required: boolean;
}

const ArrayFieldTitle = ({
	TitleField,
	idSchema,
	required,
	title,
}: ArrayFieldTitleProps) => {
	if (!title) {
		return null;
	}
	const id = `${idSchema.$id}__title`;
	return <TitleField id={id} title={title} required={required} />;
};

interface ArrayFieldDescriptionProps {
	// TODO: type this property correctly one this PR is merged https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27164
	DescriptionField: any;
	idSchema: ArrayFieldTemplateProps['idSchema'];
	description?: string | JSX.Element;
}

const ArrayFieldDescription = ({
	DescriptionField,
	idSchema,
	description,
}: ArrayFieldDescriptionProps) => {
	if (!description) {
		return null;
	}
	const id = `${idSchema.$id}__description`;
	return <DescriptionField id={id} description={description} />;
};

const ActionButton = styled(Button)`
	color: ${({ theme }) => theme.colors.text.light};
`;

export default (props: ArrayFieldTemplateProps) => {
	const warning = props.uiSchema['ui:warning'];

	return (
		<div className={props.uiSchema.classNames}>
			<ArrayFieldTitle
				TitleField={props.TitleField}
				idSchema={props.idSchema}
				title={props.uiSchema['ui:title'] || props.title}
				required={props.required}
			/>

			{!!warning && <WarningField warning={warning} />}

			<ArrayFieldDescription
				DescriptionField={props.DescriptionField}
				idSchema={props.idSchema}
				description={
					props.uiSchema['ui:description'] || props.schema.description
				}
			/>

			{props.items.map(element => {
				return (
					<div className="rendition-form__array-item" key={element.index}>
						<Flex>
							<Box flex="1">{element.children}</Box>

							{props.items.length > 1 && (
								<ActionButton
									className="rendition-form-array-item__move-up"
									mb="6px"
									px={1}
									ml={1}
									plaintext
									disabled={
										element.disabled || element.readonly || !element.hasMoveUp
									}
									onClick={element.onReorderClick(
										element.index,
										element.index - 1,
									)}
								>
									<FaArrowUp />
								</ActionButton>
							)}

							{props.items.length > 1 && (
								<ActionButton
									className="rendition-form-array-item__move-down"
									mb="6px"
									px={1}
									ml={1}
									plaintext
									disabled={
										element.disabled || element.readonly || !element.hasMoveDown
									}
									onClick={element.onReorderClick(
										element.index,
										element.index + 1,
									)}
								>
									<FaArrowDown />
								</ActionButton>
							)}

							{element.hasRemove && (
								<ActionButton
									className="rendition-form-array-item__remove-item"
									plaintext
									mb="6px"
									px={1}
									ml={1}
									disabled={element.disabled || element.readonly}
									onClick={element.onDropIndexClick(element.index)}
								>
									<FaClose />
								</ActionButton>
							)}
						</Flex>
					</div>
				);
			})}

			{props.canAdd && (
				<Button
					className="rendition-form-array-item__add-item"
					iconElement={<FaPlus />}
					onClick={props.onAddClick}
				>
					Add item
				</Button>
			)}
		</div>
	);
};
