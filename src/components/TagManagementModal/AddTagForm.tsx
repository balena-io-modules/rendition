import * as React from 'react';
import styled from 'styled-components';
import * as uuid from 'uuid';

import { ResourceTagInfo } from './models';
import some from 'lodash/some';
import find from 'lodash/find';
import startsWith from 'lodash/startsWith';
import isEmpty from 'lodash/isEmpty';
import { Alert as AlertBase } from '../Alert';
import { Txt } from '../Txt';
import { Input } from '../Input';
import { Button } from '../Button';
import {
	SimpleConfirmationModal,
	SimpleConfirmationModalProps,
} from '../../internal/SimpleConfirmationModal';
import { withPreventDefault, stopKeyDownEvent } from '../../utils';
import { useTranslation, TFunction } from '../../hooks/useTranslation';

const Alert = styled(AlertBase)`
	padding: 8px 0 18px;
`;

const NewTagTr = styled.tr`
	table > thead > & > td {
		padding-top: 0;
		padding-bottom: 0;
	}
`;

const NewTagErrorsTr = styled.tr`
	table > thead > & > td {
		height: 30px;
		padding-top: 5px;
		padding-bottom: 5px;
	}
`;

const RESERVED_NAMESPACE = 'io.resin.';

const newTagValidationRules = <T extends {}>(
	t: ReturnType<typeof useTranslation>['t'],
	key: string,
	existingTags: Array<ResourceTagInfo<T>>,
) => {
	return [
		{
			test: () => !key || isEmpty(key),
			message: t('fields_errors.tag_name_cannot_be_empty'),
		},
		{
			test: () => /\s/.test(key!),
			message: t('fields_errors.tag_names_cannot_contain_whitespace'),
		},
		{
			test: () => startsWith(key, RESERVED_NAMESPACE),
			message: t(`fields_errors.some_tag_keys_are_reserved`, {
				namespace: RESERVED_NAMESPACE,
			}),
		},
		{
			test: () =>
				some(
					existingTags,
					(tag) => tag.state !== 'deleted' && tag.tag_key === key,
				),
			message: t('fields_errors.tag_with_same_name_exists'),
		},
	];
};

interface AddTagFormProps<T> {
	t: TFunction;
	itemType: string;
	existingTags: Array<ResourceTagInfo<T>>;
	overwritableTags?: Array<ResourceTagInfo<T>>;
	addTag: (tag: ResourceTagInfo<T>) => void;
}

export const AddTagForm = <T extends {}>({
	itemType,
	existingTags,
	overwritableTags,
	addTag,
}: AddTagFormProps<T>) => {
	const { t } = useTranslation();
	const [tagKey, setTagKey] = React.useState('');
	const [value, setValue] = React.useState('');
	const [tagKeyIsInvalid, setTagKeyIsInvalid] = React.useState(false);
	const [error, setError] = React.useState<{ message: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);
	const [confirmationModalOptions, setConfirmationModalOptions] =
		React.useState<SimpleConfirmationModalProps>();

	const tagKeyInput = React.useRef<HTMLInputElement>(null);
	const valueInput = React.useRef<HTMLInputElement>(null);
	const formUuid: string = `add-tag-form-${uuid.v1()}`;

	const checkNewTagValidity = (key: string) => {
		const failedRule = newTagValidationRules<T>(t, key, existingTags).find(
			(rule) => rule.test(),
		);

		const hasErrors = !!failedRule;

		setTagKeyIsInvalid(hasErrors);
		setError(failedRule);
		setCanSubmit(!hasErrors);
		return hasErrors;
	};

	const checkTagOverwrites = async () => {
		const overwritableTag = find(overwritableTags || [], {
			tag_key: tagKey,
		});

		if (!overwritableTag) {
			return true;
		}
		const count = overwritableTag.items.length;
		const result = await new Promise<boolean>((resolve) => {
			const confirmationModalOptions = {
				title: t('warnings.this_would_overwrite_tags', {
					itemType,
					count,
				}),
				children: (
					<Txt>
						{t(`warnings.tag_name_group_exists_and_will_be_overwritten`, {
							itemType,
							count,
						})}
						<br />
						{t('actions_confirmations.confirm_to_proceed')}
					</Txt>
				),
				action: t('actions.continue'),
				onClose: resolve,
			} as SimpleConfirmationModalProps;

			setConfirmationModalOptions(confirmationModalOptions);
		});
		setConfirmationModalOptions(undefined);
		return result;
	};

	const internalAddTag = withPreventDefault(() => {
		if (checkNewTagValidity(tagKey)) {
			return;
		}

		return checkTagOverwrites().then((confirmed) => {
			if (!confirmed) {
				return;
			}

			addTag({
				tag_key: tagKey,
				value,
			} as ResourceTagInfo<T>);

			setTagKey('');
			setValue('');
			setTagKeyIsInvalid(false);
			setError(undefined);
			setCanSubmit(false);

			if (tagKeyInput && tagKeyInput.current) {
				tagKeyInput.current.blur();
			}
			if (valueInput && valueInput.current) {
				valueInput.current.blur();
			}
		});
	});

	return (
		<thead>
			<NewTagTr onKeyDown={(e) => stopKeyDownEvent(e, 13, internalAddTag)}>
				<td />
				<td>
					<Input
						form={formUuid}
						width="100%"
						ref={tagKeyInput}
						onChange={(e) => {
							setTagKey(e.target.value);
							checkNewTagValidity(e.target.value);
						}}
						value={tagKey}
						invalid={tagKeyIsInvalid}
						placeholder={t('labels.tag_name')}
					/>
				</td>
				<td>
					<Input
						form={formUuid}
						width="100%"
						ref={valueInput}
						onChange={(e) => setValue(e.target.value)}
						value={value}
						placeholder={t('labels.value')}
					/>
				</td>
				<td>
					<form id={formUuid} onSubmit={internalAddTag}>
						<Button
							width="120px"
							tertiary
							onClick={internalAddTag}
							disabled={!canSubmit}
						>
							{t('actions.add_tag')}
						</Button>
					</form>
					{confirmationModalOptions && (
						<SimpleConfirmationModal {...confirmationModalOptions} />
					)}
				</td>
			</NewTagTr>
			<NewTagErrorsTr>
				<td />
				<td colSpan={2}>
					{error && (
						<Alert danger plaintext>
							{error.message}
						</Alert>
					)}
				</td>
				<td />
			</NewTagErrorsTr>
		</thead>
	);
};
