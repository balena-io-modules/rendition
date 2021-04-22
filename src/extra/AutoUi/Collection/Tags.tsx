import React from 'react';
import { AutoUIContext, AutoUIBaseResource } from '../schemaOps';
import {
	ResourceTagSubmitInfo,
	SubmitInfo,
} from '../../../components/TagManagementModal/models';
import { TagManagementModal } from '../../../components/TagManagementModal';
import { getTagsDisabledReason } from '../utils';
import { Button } from '../../../components/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags';

interface TagsProps<T> {
	selected: T[];
	autouiContext: AutoUIContext<T>;
	changeTags: (
		tags: SubmitInfo<ResourceTagSubmitInfo, ResourceTagSubmitInfo>,
	) => void;
}

export const Tags = <T extends AutoUIBaseResource<T>>({
	selected,
	autouiContext,
	changeTags,
}: TagsProps<T>) => {
	const { t } = useTranslation();
	const [showModal, setShowModal] = React.useState(false);

	if (!autouiContext.tagField || !autouiContext.nameField) {
		return null;
	}

	const disabledReason = getTagsDisabledReason(
		selected,
		autouiContext.tagField as keyof T,
		t,
	);

	return (
		<>
			<Button
				tooltip={disabledReason}
				disabled={!!disabledReason}
				icon={<FontAwesomeIcon icon={faTags} />}
				onClick={() => setShowModal(true)}
				quartenary
				outline
			>
				{t('labels.tags')}
			</Button>
			{showModal && (
				<TagManagementModal<T>
					items={selected}
					itemType={autouiContext.resource}
					titleField={autouiContext.nameField as keyof T}
					tagField={autouiContext.tagField as keyof T}
					done={(tagSubmitInfo) => {
						changeTags(tagSubmitInfo);
						setShowModal(false);
					}}
					cancel={() => setShowModal(false)}
				/>
			)}
		</>
	);
};
