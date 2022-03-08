import React from 'react';
import {
	AutoUIContext,
	AutoUIModel,
	AutoUIBaseResource,
	autoUIJsonSchemaPick,
} from '../schemaOps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionData } from '../schemaOps';
import { getCreateDisabledReason } from '../utils';
import { Button } from '../../../components/Button';
import { faMagic } from '@fortawesome/free-solid-svg-icons/faMagic';
import { useTranslation } from '../../../hooks/useTranslation';
import { Box } from '../../../components/Box';

interface CreateProps<T extends AutoUIBaseResource<T>> {
	model: AutoUIModel<T>;
	autouiContext: AutoUIContext<T>;
	hasOngoingAction: boolean;
	onActionTriggered: (data: ActionData<T>) => void;
}

export const Create = <T extends AutoUIBaseResource<T>>({
	model,
	autouiContext,
	hasOngoingAction,
	onActionTriggered,
}: CreateProps<T>) => {
	const { t } = useTranslation();
	const { actions } = autouiContext;
	const createActions = actions?.filter((action) => action.type === 'create');

	if (!createActions || createActions.length < 1) {
		return null;
	}

	if (createActions.length > 1) {
		throw new Error('Only one create action per resource is allowed');
	}

	const disabledReason = !!createActions[0].isDisabled
		? createActions[0].isDisabled({})
		: getCreateDisabledReason(model.permissions, hasOngoingAction, t);

	return (
		<Box>
			<Button
				data-action={`create-${model.resource}`}
				onClick={() =>
					onActionTriggered({
						action: createActions[0],
						schema: autoUIJsonSchemaPick(
							model.schema,
							model.permissions.create,
						),
					})
				}
				icon={<FontAwesomeIcon icon={faMagic} />}
				tooltip={
					typeof disabledReason === 'string' ? disabledReason : undefined
				}
				disabled={!!disabledReason}
				primary
			>
				{createActions[0].title}
			</Button>
		</Box>
	);
};
