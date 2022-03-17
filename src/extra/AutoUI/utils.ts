import { AutoUIBaseResource, Permissions, Priorities } from './schemaOps';
import { TFunction } from '../../hooks/useTranslation';
import { TableSortFunction } from '../../components/Table/TableRow';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import { JsonTypes } from '../../components/Renderer/types';
import { diff } from '../../utils';
import castArray from 'lodash/castArray';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const findInObject = (obj: any, key: string): any => {
	let result;
	for (const property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (property === key) {
				return obj[key]; // returns the value
			} else if (typeof obj[property] === 'object') {
				// in case it is an object
				result = findInObject(obj[property], key);

				if (typeof result !== 'undefined') {
					return result;
				}
			}
		}
	}
};

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

export const getSortingFunction = <T extends any>(
	schemaKey: keyof T,
	schemaValue: JSONSchema,
): TableSortFunction<T> => {
	const types = castArray(schemaValue.type);
	if (types.includes(JsonTypes.string)) {
		return (a: T, b: T) => {
			const aa = a[schemaKey] ?? '';
			const bb = b[schemaKey] ?? '';
			if (typeof aa === 'string' && typeof bb === 'string') {
				return aa.toLowerCase().localeCompare(bb.toLowerCase());
			}
			return diff(a[schemaKey], b[schemaKey]);
		};
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

export const onClickOutOrEsc = (
	wrapper: HTMLDivElement,
	callback: () => void,
) => {
	const handleClickOutside = (event: MouseEvent) => {
		if (!wrapper.contains(event.target as Node)) {
			handler();
		}
	};
	const handleEsc = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			handler();
		}
	};
	const handler = () => {
		callback();
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
		document.removeEventListener('mousedown', handleClickOutside);
		document.removeEventListener('keydown', handleEsc);
	};
	document.addEventListener('mousedown', handleClickOutside);
	document.addEventListener('keydown', handleEsc);
};
