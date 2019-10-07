import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ArrayFieldTemplateProps } from 'react-jsonschema-form';
import styled from 'styled-components';
import { Box, Button, Flex } from '../../../../';
import { WarningField } from '../WarningField';

interface ArrayFieldTitleProps {
	TitleField: ArrayFieldTemplateProps['TitleField'];
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
	DescriptionField: ArrayFieldTemplateProps['DescriptionField'];
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
						<Flex alignItems="flex-start">
							<Box flex="1">{element.children}</Box>

							{props.items.length > 1 && (
								<ActionButton
									type="button"
									className="rendition-form-array-item__move-up"
									mb="6px"
									px={1}
									mt={1}
									ml={1}
									plain
									disabled={
										element.disabled || element.readonly || !element.hasMoveUp
									}
									onClick={element.onReorderClick(
										element.index,
										element.index - 1,
									)}
								>
									<FontAwesomeIcon icon={faArrowUp} />
								</ActionButton>
							)}

							{props.items.length > 1 && (
								<ActionButton
									type="button"
									className="rendition-form-array-item__move-down"
									mb="6px"
									px={1}
									mt={1}
									ml={1}
									plain
									disabled={
										element.disabled || element.readonly || !element.hasMoveDown
									}
									onClick={element.onReorderClick(
										element.index,
										element.index + 1,
									)}
								>
									<FontAwesomeIcon icon={faArrowDown} />
								</ActionButton>
							)}

							{element.hasRemove && (
								<ActionButton
									type="button"
									className="rendition-form-array-item__remove-item"
									plain
									mb="6px"
									mt={1}
									px={1}
									ml={1}
									disabled={element.disabled || element.readonly}
									onClick={element.onDropIndexClick(element.index)}
								>
									<FontAwesomeIcon icon={faTimes} />
								</ActionButton>
							)}
						</Flex>
					</div>
				);
			})}

			{props.canAdd && (
				<Button
					type="button"
					className="rendition-form-array-item__add-item"
					icon={<FontAwesomeIcon icon={faPlus} />}
					onClick={props.onAddClick}
				>
					Add item
				</Button>
			)}
		</div>
	);
};
