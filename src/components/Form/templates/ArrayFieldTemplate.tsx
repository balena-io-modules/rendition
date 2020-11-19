import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ArrayFieldTemplateProps } from '@rjsf/core';
import { Flex } from '../../Flex';
import { Box } from '../../Box';
import { Button } from '../../Button';
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

export default (props: ArrayFieldTemplateProps) => {
	const warning = props.uiSchema['ui:warning'];
	const orderable = props.uiSchema['ui:options']?.orderable ?? true;

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

			{props.items.map((element) => {
				return (
					<div className="rendition-form__array-item" key={element.index}>
						<Flex alignItems="flex-start">
							<Box flex="1">{element.children}</Box>
							<Box>
								{orderable && props.items.length > 1 && (
									<Button
										type="button"
										className="rendition-form-array-item__move-up"
										py={1}
										px={2}
										primary
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
									</Button>
								)}

								{orderable && props.items.length > 1 && (
									<Button
										type="button"
										className="rendition-form-array-item__move-down"
										py={1}
										px={2}
										plain
										primary
										disabled={
											element.disabled ||
											element.readonly ||
											!element.hasMoveDown
										}
										onClick={element.onReorderClick(
											element.index,
											element.index + 1,
										)}
									>
										<FontAwesomeIcon icon={faArrowDown} />
									</Button>
								)}

								{element.hasRemove && (
									<Button
										type="button"
										className="rendition-form-array-item__remove-item"
										plain
										primary
										py={1}
										px={2}
										disabled={element.disabled || element.readonly}
										onClick={element.onDropIndexClick(element.index)}
									>
										<FontAwesomeIcon icon={faTrashAlt} />
									</Button>
								)}
							</Box>
						</Flex>
					</div>
				);
			})}

			{props.canAdd && (
				<Button
					mt={3}
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
