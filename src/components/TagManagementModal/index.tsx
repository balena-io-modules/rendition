import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { stopKeyDownEvent, withPreventDefault } from '../../utils';
import { AddTagForm } from './AddTagForm';
import {
	ResourceTagInfo,
	ResourceTagInfoState,
	ResourceTagSubmitInfo,
	SubmitInfo,
	TaggedResource,
} from './models';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toString from 'lodash/toString';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { Heading } from '../Heading';
import { Modal } from '../Modal';
import { Flex } from '../Flex';
import { Input } from '../Input';
import { Button } from '../Button';
import { CollectionSummary } from './CollectionSummary/CollectionSummary';
import { useTranslation } from '../../hooks/useTranslation';
import {
	getResourceTagSubmitInfo,
	groupResourcesByTags,
} from './tag-management-service';
import partition from 'lodash/partition';

const NBSP = '\u00a0';

const iconStyles = (props: any) => `
	font-size: 14px;
	color: ${props.theme.colors.text.main};
`;

const FaPencil = (props: any) => (
	<FontAwesomeIcon icon={faPencilAlt} {...props} />
);

const EditButtonIcon = styled(FaPencil)`
	${iconStyles} margin-left: 10px;
`;

const FaTrashAlt = (props: any) => (
	<FontAwesomeIcon icon={faTrashAlt} {...props} />
);

const DeleteButtonIcon = styled(FaTrashAlt)`
	${iconStyles};
`;

export const UndoButtonMinWidth = 100;

const UndoButton = styled(Button)`
	width: ${UndoButtonMinWidth}px;
	text-align: left;
`;

const InputPadder = styled.div`
	padding-left: 17px;
	padding-right: 17px;
`;

const TdThHorizontalPadding = 10;

const TagTable = styled.table`
	width: 100%;
	max-width: 100%;
	border: none;
	border-collapse: collapse;
	font-size: 14px;

	& > thead > tr > th,
	& > thead > tr > td {
		padding: 11px ${TdThHorizontalPadding}px;
	}

	& > thead > tr > th {
		height: 42px;
		font-size: 16px;
		font-weight: bold;
		background-color: #f2f2f2;
	}

	& > tbody > tr > td {
		padding: 8px ${TdThHorizontalPadding}px;
		height: 50px;
	}

	& > tbody > tr:nth-of-type(even) {
		background-color: #f8f8f8;
	}

	& > thead > tr > th,
	& > tbody > tr > td {
		border: none;
		vertical-align: middle;
	}
`;

const TagTr = styled.tr`
	&:hover {
		${DeleteButtonIcon}, ${EditButtonIcon} {
			opacity: 0.7;
		}
	}

	${DeleteButtonIcon}, ${EditButtonIcon} {
		opacity: 0;
		cursor: pointer;

		&:hover {
			opacity: 1;
		}
	}
`;

const TagDeleteTh = styled.th`
	width: 36px;
`;

const TagDeleteTd = styled(TagDeleteTh.withComponent('td'))`
	table > tbody > tr > & {
		padding-left: 11px;
		padding-right: 11px;
	}
`;

const TagPropertyTh = styled.th`
	width: 30%;
	max-width: 300px;
	text-align: left;
`;

const TagPropertyTd = TagPropertyTh.withComponent('td');

const TagKeyTd = styled(TagPropertyTd)<{ state?: ResourceTagInfoState }>`
	font-weight: bold;
	color: ${(props) =>
		props.state === 'added' ? props.theme.colors.warning.main : 'inherit'};
`;

const TagValueTd = styled(TagPropertyTd)``;

const TagProperty = styled.div<{ state?: ResourceTagInfoState }>`
	display: flex;
	max-width: 100%;

	color: ${(props) =>
		props.state === 'added'
			? props.theme.colors.warning.main
			: props.state === 'updated'
			? props.theme.colors.warning.main
			: props.state === 'deleted'
			? props.theme.colors.gray.main
			: 'inherit'};

	& > ${InputPadder} {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

const EdittableTagValue = styled(TagProperty)`
	display: flex;
	cursor: pointer;

	& > ${InputPadder} {
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		max-width: 100%;
	}
`;

const EdittableTagValueText = styled.div`
	flex: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

const PreviousTagProperty = styled(TagProperty)`
	display: inline-flex;
	width: 100%;
	margin-bottom: ${(props) => (props.state === 'deleted' ? 0 : 6)}px;

	position: relative;

	&:after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		display: block;
		background: ${(props) => props.theme.colors.warning.main};
		height: 2px;
		top: 50%;
	}

	${TagKeyTd} > &, ${TagValueTd} > & {
		color: ${(props) => props.theme.colors.gray.main};
	}

	${TagKeyTd} > &:after {
		right: ${-TdThHorizontalPadding}px;
	}

	${TagValueTd} > & {
		width: auto;
		&:after {
			left: ${-TdThHorizontalPadding}px;
		}
	}
`;

const TagUndoChangedTh = styled.th`
	min-width: ${UndoButtonMinWidth}px;
`;

const TagUndoChangedTd = styled(TagUndoChangedTh.withComponent('td'))`
	text-align: right;
`;

export interface TagManagementModalProps<T> {
	/** Selected items to tag */
	items: T[];
	/** Selected items type */
	itemType: string;
	/** Tag field title */
	titleField: keyof T | ((item: T) => string);
	/** Tags property in the selected item */
	tagField: keyof T;
	/** On cancel press event */
	cancel: () => void;
	/** On done press event */
	done: (
		tagSubmitInfo: SubmitInfo<ResourceTagSubmitInfo, ResourceTagSubmitInfo>,
	) => void;
}

/**
 * Displays a Modal to manage Tags.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/TagManagementModal/TagManagementModal.stories.tsx)
 *
 *
 *
 * Modal Strings:
 *
 * | `Name |` Description |
 * |------|-------------|
 * | `labels.tags` | Tags |
 * | `labels.shared` | Shared |
 * | `labels.tag_name` | Tag name |
 * | `labels.value` | Value |
 * | `labels.tag_value` | Tag value |
 * | `actions.ok` | OK |
 * | `actions.add_tag` | Add tag |
 * | `actions.continue` | Continue |
 * | `actions.undo_add` | Undo add |
 * | `actions.undo_edit` | Undo edit |
 * | `actions.undo_delete` | Undo delete |
 * | `actions.apply_item_type_count` | Apply |
 * | `actions.apply_item_type_count_plural` | Apply to {{count}} {{itemType}} |
 * | `actions_messages.confirmation` | Are you sure? |
 * | `actions_confirmations.confirm_to_proceed` | Do you want to proceed? |
 * | `no_data.no_name_set` | No name set |
 * | `warnings.this_would_overwrite_tags` | Adding this would overwrite tags on {{itemType}} |
 * | `warnings.tag_name_group_exists_and_will_be_overwritten` | A tag name group exists on {{count}} other {{itemType}} and will be overwritten. |
 * | `warnings.tag_name_group_exists_and_will_be_overwritten_plural` | A tag name group exists on {{count}} other {{itemType}}s and will be overwritten. |
 * | `errors.no_tags_for_selected_itemtype` | The selected {{itemType}} has no tags |
 * | `errors.no_tags_for_selected_itemtype_plural` | The selected {{itemType}}s have no tags in common |
 * | `fields_errors.tag_name_cannot_be_empty` | The tag name can't be empty. |
 * | `fields_errors.tag_names_cannot_contain_whitespace` | Tag names cannot contain whitespace |
 * | `fields_errors.some_tag_keys_are_reserved` | Tag names beginning with {{namespace}} are reserved |
 * | `fields_errors.tag_with_same_name_exists` | A tag with the same name already exists |
 */

export const TagManagementModal = <T extends TaggedResource>({
	items,
	itemType,
	titleField,
	tagField,
	cancel,
	done,
}: TagManagementModalProps<T>) => {
	const { t } = useTranslation();
	const [editingTag, setEditingTag] = React.useState<
		ResourceTagInfo<T> | undefined
	>(undefined);
	const [tags, setTags] = React.useState<Array<ResourceTagInfo<T>>>();
	const [partialTags, setPartialTags] =
		React.useState<Array<ResourceTagInfo<T>>>();

	React.useEffect(() => {
		const allTags = groupResourcesByTags(items, tagField);
		const [commonTags, $partialTags] = partition(
			allTags,
			(t) => t.items.length === items.length,
		);
		setTags(commonTags);
		setPartialTags($partialTags);
		// TODO: This snapshots the item at the moment the modal is open.
		// Consider using a separate state for editing tags.
	}, [items.length > 0]);

	if (!tags || !partialTags) {
		return null;
	}

	const addTag = (tag: ResourceTagInfo<T>) => {
		let slicedTags = tags.slice();

		const existingDeletedTag = slicedTags.find(
			(existingTag) =>
				existingTag.state === 'deleted' && existingTag.tag_key === tag.tag_key,
		);
		if (existingDeletedTag) {
			existingDeletedTag.initialValue = existingDeletedTag.value;
			existingDeletedTag.value = tag.value;
			existingDeletedTag.state = 'updated';
		} else {
			const newTag: ResourceTagInfo<T> = {
				tag_key: tag.tag_key,
				value: tag.value,
				items: items.slice(),
				state: 'added',
			};

			slicedTags.push(newTag);
			slicedTags = sortBy(slicedTags, 'tag_key');
		}

		setEditingTag(undefined);
		setTags(slicedTags);
	};

	const undoTagChanges = (tag: ResourceTagInfo<T>) => {
		if (tag.state === 'added') {
			setTags(tags.filter((t) => t !== tag));
			return;
		}
		if (tag.state === 'updated') {
			tag.value = tag.initialValue || '';
			tag.state = undefined;
		}
		if (tag.state === 'deleted') {
			tag.state = undefined;
		}
		setTags(tags.slice());
	};

	const startTagEdit = (tag: ResourceTagInfo<T>) => {
		if (tag && tag.initialValue === undefined) {
			tag.initialValue = tag.value || '';
		}
		setEditingTag(tag);
	};

	const endTagEdit = () => {
		if (editingTag) {
			const tagKey = editingTag.tag_key;
			const newTags = tags.map((tag) =>
				tag.tag_key === tagKey ? editingTag : tag,
			);
			setTags(newTags);
		}
		setEditingTag(undefined);
	};

	const setEditingTagValue = (value: string) => {
		if (!editingTag) {
			return;
		}
		const newTag = { ...editingTag };
		newTag.value = value;
		if (!newTag.state && newTag.initialValue !== value) {
			newTag.state = 'updated';
		}
		setEditingTag(newTag);
	};

	const deleteTag = (tag: ResourceTagInfo<T>) => {
		if (tag.state === 'added') {
			setTags(tags.filter((t) => t !== tag));
			return;
		}

		tag.state = 'deleted';
		setTags(tags.slice());
	};

	const getItemTitle = (item: T) => {
		const title =
			typeof titleField === 'function'
				? titleField(item)
				: toString(item[titleField]);
		return title || `(${t('no_data.no_name_set')})`;
	};

	return (
		<Modal
			width={1000}
			titleElement={
				<div>
					<Heading.h3 mt={0} mb={10}>
						{items.length > 1 && <span>{t('labels.shared')} </span>}
						{t('labels.tags')}
					</Heading.h3>
					<CollectionSummary
						items={items.map(getItemTitle).sort()}
						itemsType={itemType}
						maxVisibleItemCount={10}
					/>
				</div>
			}
			cancel={cancel}
			done={withPreventDefault(() => done(getResourceTagSubmitInfo(tags)))}
			action={t(`actions.apply_item_type_count`, {
				count: items.length,
				itemType: t('labels.' + itemType, {
					count: items.length,
				}).toLowerCase(),
			})}
		>
			<Flex>
				<TagTable>
					<AddTagForm<T>
						itemType={itemType}
						existingTags={tags}
						overwritableTags={partialTags}
						addTag={addTag}
						t={t}
					/>
					<thead>
						<tr>
							<TagDeleteTh />
							<TagPropertyTh>
								<InputPadder>{t('labels.tag_name')}</InputPadder>
							</TagPropertyTh>
							<TagPropertyTh>
								<InputPadder>{t('labels.value')}</InputPadder>
							</TagPropertyTh>
							<TagUndoChangedTh />
						</tr>
					</thead>
					<tbody>
						{!tags.length ? (
							<tr>
								<td />
								<td colSpan={3}>
									<InputPadder>
										{t(`errors.no_tags_for_selected_itemtype`, {
											count: items.length,
											itemType,
										})}
									</InputPadder>
								</td>
							</tr>
						) : (
							map(tags, (tag) => {
								const showPreviousTagProperties =
									editingTag?.tag_key !== tag.tag_key &&
									(tag.state === 'deleted' || tag.state === 'updated');
								return (
									<TagTr key={tag.tag_key} {...tag}>
										<TagDeleteTd>
											{tag.state !== 'deleted' && (
												<Flex alignItems="center">
													<DeleteButtonIcon onClick={() => deleteTag(tag)} />
												</Flex>
											)}
										</TagDeleteTd>
										<TagKeyTd state={tag.state}>
											{showPreviousTagProperties && (
												<PreviousTagProperty state={tag.state}>
													<InputPadder>{tag.tag_key}</InputPadder>
												</PreviousTagProperty>
											)}
											{tag.state !== 'deleted' && (
												<TagProperty state={tag.state}>
													<InputPadder>{tag.tag_key}</InputPadder>
												</TagProperty>
											)}
										</TagKeyTd>
										<TagValueTd>
											{showPreviousTagProperties && (
												<PreviousTagProperty state={tag.state}>
													<InputPadder>{tag.value || NBSP}</InputPadder>
												</PreviousTagProperty>
											)}
											{editingTag?.tag_key !== tag.tag_key &&
												tag.state !== 'deleted' && (
													<EdittableTagValue
														state={tag.state}
														onClick={() => startTagEdit(tag)}
													>
														<InputPadder>
															<EdittableTagValueText>
																{tag.value || NBSP}
															</EdittableTagValueText>
															<EditButtonIcon />
														</InputPadder>
													</EdittableTagValue>
												)}
											{editingTag?.tag_key === tag.tag_key && (
												<Input
													width="100%"
													autoFocus
													onKeyDown={(e) => stopKeyDownEvent(e, 13, endTagEdit)}
													onFocus={(e) => {
														// move the cursor to the end
														const target = e.target as HTMLInputElement;
														const len = (target.value || '').length;
														if (len) {
															target.setSelectionRange(len, len);
														}
													}}
													onChange={(e) => setEditingTagValue(e.target.value)}
													onBlur={() => endTagEdit()}
													value={editingTag.value}
													placeholder={t('labels.tag_value')}
												/>
											)}
										</TagValueTd>
										<TagUndoChangedTd>
											{tag.state && (
												<Flex alignItems="center" justifyContent="flex-end">
													<UndoButton
														plain
														primary
														icon={<FontAwesomeIcon icon={faUndo} />}
														onClick={() => undoTagChanges(tag)}
													>
														<span>
															{tag.state === 'added'
																? t('actions.undo_add')
																: tag.state === 'updated'
																? t('actions.undo_edit')
																: t('actions.undo_delete')}
														</span>
													</UndoButton>
												</Flex>
											)}
										</TagUndoChangedTd>
									</TagTr>
								);
							})
						)}
					</tbody>
				</TagTable>
			</Flex>
		</Modal>
	);
};
