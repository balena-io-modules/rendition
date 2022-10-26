import { AutoUIBaseResource, Permissions, Priorities } from './schemaOps';
import { TFunction } from '../../hooks/useTranslation';
import { TableSortFunction } from '../../components/Table/TableRow';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import { JsonTypes } from '../../components/Renderer/types';
import { diff } from '../../utils';
import castArray from 'lodash/castArray';
import get from 'lodash/get';
import { getPropertyScheme } from '../../components/Filters/SchemaSieve';

export const ObjectFromEntries = (entries: any[]) => {
	const obj = {} as any;
	for (const [key, value] of entries) {
		obj[key] = value;
	}
	return obj;
};

export const getTagsDisabledReason = <T extends AutoUIBaseResource<T>>(
	selected: T[],
	tagField: keyof T,
	t: TFunction,
) => {
	if (selected.length === 0) {
		return t('info.no_selected');
	}

	const lacksPermissionsOnSelected = selected.some((entry) => {
		return (
			!entry.__permissions.delete &&
			!entry.__permissions.create.includes(tagField) &&
			!entry.__permissions.update.includes(tagField as keyof T)
		);
	});

	if (lacksPermissionsOnSelected) {
		// TODO: Pass the resource name instead.
		return t('info.edit_tag_no_permissions', { resource: 'item' });
	}

	return false;
};

export const getCreateDisabledReason = <T extends AutoUIBaseResource<T>>(
	permissions: Permissions<T>,
	hasOngoingAction: boolean,
	t: TFunction,
) => {
	if (hasOngoingAction) {
		return t('info.ongoing_action_wait');
	}

	if (!permissions.create?.length) {
		return t('info.create_item_no_permissions', { resource: 'item' });
	}
};

export const autoUIGetDisabledReason = <T extends AutoUIBaseResource<T>>(
	selected: T[],
	hasOngoingAction: boolean,
	actionType: 'update' | 'delete' | null,
	t: TFunction,
) => {
	if (selected.length === 0) {
		return t('info.no_selected');
	}

	if (hasOngoingAction) {
		return t('info.ongoing_action_wait');
	}

	if (!actionType) {
		return;
	}

	const lacksPermissionsOnSelected = selected.some((entry) => {
		return (
			!entry.__permissions[actionType] ||
			(Array.isArray(entry.__permissions[actionType]) &&
				(entry.__permissions[actionType] as Array<keyof T>).length <= 0)
		);
	});

	if (lacksPermissionsOnSelected) {
		return t('info.update_item_no_permissions', {
			action: actionType,
			resource: 'item',
		});
	}
};

const sortFn = (
	a: string | unknown,
	b: string | unknown,
	ref: string | string[],
) => {
	const aa = get(a, ref) ?? '';
	const bb = get(b, ref) ?? '';
	if (typeof aa === 'string' && typeof bb === 'string') {
		return aa.toLowerCase().localeCompare(bb.toLowerCase());
	}
	return diff(aa, bb);
};

export const getSortingFunction = <T extends any>(
	schemaKey: keyof T,
	schemaValue: JSONSchema,
): TableSortFunction<T> => {
	const types = castArray(schemaValue.type);
	const refScheme = getPropertyScheme(schemaValue);
	if (types.includes(JsonTypes.string)) {
		return (a: T, b: T) => sortFn(a, b, schemaKey);
	}
	if (types.includes(JsonTypes.object) && refScheme) {
		return (a: T, b: T) => sortFn(a, b, [schemaKey, ...refScheme]);
	}
	if (types.includes(JsonTypes.array) && refScheme) {
		return (a: T, b: T) => sortFn(a, b, [schemaKey, '0', ...refScheme]);
	}
	return (a: T, b: T) => diff(a[schemaKey], b[schemaKey]);
};

export const getSelected = <T, K extends keyof T>(
	key: K,
	priorities?: Priorities<T>,
) => {
	if (!priorities) {
		return true;
	}
	return (
		priorities?.primary.includes(key) || priorities?.secondary.includes(key)
	);
};
