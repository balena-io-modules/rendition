import { AutoUIBaseResource, Permissions } from './schemaOps';
import { TFunction } from '../../hooks/useTranslation';

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
