import React from 'react';
import { AutoUIContext, AutoUIBaseResource } from '../schemaOps';
import {
	ResourceTagSubmitInfo,
	SubmitInfo,
} from '../../../components/TagManagementModal/models';
import { TagManagementModal } from '../../../components/TagManagementModal';
import { useTranslation } from '../../../hooks/useTranslation';
import { notifications } from '../../../components/Notifications';

interface TagsProps<T> {
	selected: T[];
	autouiContext: AutoUIContext<T>;
	setIsBusyMessage: (message: string | undefined) => void;
	onDone: () => void;
	refresh?: () => void;
}

export const Tags = <T extends AutoUIBaseResource<T>>({
	selected,
	autouiContext,
	setIsBusyMessage,
	refresh,
	onDone,
}: TagsProps<T>) => {
	const { t } = useTranslation();

	const { sdk } = autouiContext;

	const changeTags = React.useCallback(
		async (tags: SubmitInfo<ResourceTagSubmitInfo, ResourceTagSubmitInfo>) => {
			if (!sdk?.tags) {
				return;
			}

			setIsBusyMessage(t(`loading.updating_tags`));
			notifications.addNotification({
				id: 'change-tags-loading',
				content: t(`loading.updating_tags`),
			});

			try {
				await sdk.tags.submit(tags);
				notifications.addNotification({
					id: 'change-tags',
					content: 'Tags updated successfully',
					type: 'success',
				});
				refresh?.();
			} catch (err) {
				notifications.addNotification({
					id: 'change-tags',
					content: err.message,
					type: 'danger',
				});
			} finally {
				notifications.removeNotification('change-tags-loading');
				setIsBusyMessage(undefined);
			}
		},
		[sdk?.tags, refresh, selected],
	);

	if (!autouiContext.tagField || !autouiContext.nameField) {
		return null;
	}

	return (
		<TagManagementModal<T>
			items={selected}
			itemType={autouiContext.resource}
			titleField={autouiContext.nameField as keyof T}
			tagField={autouiContext.tagField as keyof T}
			done={(tagSubmitInfo) => {
				changeTags(tagSubmitInfo);
				onDone();
			}}
			cancel={() => onDone()}
		/>
	);
};
