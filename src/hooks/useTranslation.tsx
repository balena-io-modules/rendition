import template from 'lodash/template';
import { TranslationContext } from '../contexts/TranslationContext';
import React from 'react';

const translationMap = {
	// TagManagement
	'labels.tags': 'Tags',
	'labels.shared': 'Shared',
	'labels.tag_name': 'Tag name',
	'labels.value': 'Value',
	'labels.tag_value': 'Tag value',

	'actions.ok': 'OK',
	'actions.add_tag': 'Add tag',
	'actions.continue': 'Continue',
	'actions.undo_add': 'Undo add',
	'actions.undo_edit': 'Undo edit',
	'actions.undo_delete': 'Undo delete',
	'actions.apply_item_type_count': 'Apply',
	'actions.apply_item_type_count_plural': 'Apply to {{count}} {{itemType}}',

	'actions_messages.confirmation': 'Are you sure?',

	'actions_confirmations.confirm_to_proceed': 'Do you want to proceed?',

	'no_data.no_name_set': 'No name set',

	'warnings.this_would_overwrite_tags':
		'Adding this would overwrite tags on {{itemType}}',
	'warnings.tag_name_group_exists_and_will_be_overwritten':
		'A tag name group exists on {{count}} other {{itemType}} and will be overwritten.',
	'warnings.tag_name_group_exists_and_will_be_overwritten_plural':
		'A tag name group exists on {{count}} other {{itemType}}s and will be overwritten.',

	'errors.no_tags_for_selected_itemtype':
		'The selected {{itemType}} has no tags',
	'errors.no_tags_for_selected_itemtype_plural':
		'The selected {{itemType}}s have no tags in common',

	'fields_errors.tag_name_cannot_be_empty': "The tag name can't be empty.",
	'fields_errors.tag_names_cannot_contain_whitespace':
		'Tag names cannot contain whitespace',
	'fields_errors.some_tag_keys_are_reserved':
		'Tag names beginning with {{namespace}} are reserved',
	'fields_errors.tag_with_same_name_exists':
		'A tag with the same name already exists',
};

const getTranslation = (str: string, opts?: any) => {
	let translation = translationMap[str as keyof typeof translationMap];
	if (!opts) {
		return translation;
	}
	if (opts.count != null && opts.count > 1) {
		const pluralKey = `${str}_plural` as keyof typeof translationMap;
		translation =
			translationMap[pluralKey] ??
			translationMap[str as keyof typeof translationMap];
	}
	const compiled = template(translation, { interpolate: /{{([\s\S]+?)}}/g });
	return compiled(opts);
};

export const useTranslation = () => {
	const externalT = React.useContext(TranslationContext);
	const t = (str: string, opts?: any) => {
		let result = str;
		if (!!externalT && typeof externalT === 'function') {
			result = externalT(str, opts);
		}
		if (result == null || result === str) {
			result = getTranslation(str, opts);
		}
		return result;
	};

	return { t };
};
