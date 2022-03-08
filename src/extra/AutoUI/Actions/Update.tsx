import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
	AutoUIContext,
	AutoUIModel,
	AutoUIBaseResource,
	autoUIJsonSchemaPick,
} from '../schemaOps';
import { ActionData } from '../schemaOps';
import { autoUIGetDisabledReason } from '../utils';
import { DropDownButton } from '../../../components/DropDownButton';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import { useTranslation } from '../../../hooks/useTranslation';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { Button } from '../../../components/Button';
import { Box } from '../../../components/Box';

interface UpdateProps<T extends AutoUIBaseResource<T>> {
	model: AutoUIModel<T>;
	autouiContext: AutoUIContext<T>;
	selected: T[];
	hasOngoingAction: boolean;
	onActionTriggered: (data: ActionData<T>) => void;
}

export const Update = <T extends AutoUIBaseResource<T>>({
	model,
	autouiContext,
	selected,
	hasOngoingAction,
	onActionTriggered,
}: UpdateProps<T>) => {
	const { t } = useTranslation();
	const { actions } = autouiContext;
	const updateActions = actions
		?.filter((action) => action.type === 'update' || action.type === 'delete')
		.sort((a) => (a.type === 'delete' ? 1 : -1))
		.sort((a) => (a.isDangerous ? 1 : a.type === 'delete' ? 0 : -1));

	if (!updateActions || updateActions.length < 1) {
		return null;
	}

	if (updateActions.length === 1) {
		const action = updateActions[0];
		const disabledReason =
			autoUIGetDisabledReason(
				selected,
				hasOngoingAction,
				action.type as 'update' | 'delete',
				t,
			) ?? action.isDisabled?.({ affectedEntries: selected });
		return (
			<Box alignSelf="flex-start">
				<Button
					key={action.title}
					data-action={`${action.type}-${model.resource}`}
					onClick={() =>
						onActionTriggered({
							action,
							schema:
								action.type === 'delete'
									? {}
									: autoUIJsonSchemaPick(
											model.schema,
											model.permissions[action.type],
									  ),
							affectedEntries: selected,
						})
					}
					tooltip={
						typeof disabledReason === 'string' ? disabledReason : undefined
					}
					disabled={!!disabledReason}
					plain={updateActions.length > 1}
					danger={action.isDangerous}
					secondary
				>
					{action.title}
				</Button>
			</Box>
		);
	}

	const groupedActions = groupBy(
		updateActions,
		(action) => !!action.isDangerous,
	);
	const actionHandlers = map(groupedActions, (actions) =>
		actions.map((action) => {
			const disabledReason =
				autoUIGetDisabledReason(
					selected,
					hasOngoingAction,
					action.type as 'update' | 'delete',
					t,
				) ?? action.isDisabled?.({ affectedEntries: selected });

			return {
				content: action.title,
				onClick: () =>
					onActionTriggered({
						action,
						schema:
							action.type === 'delete'
								? {}
								: autoUIJsonSchemaPick(
										model.schema,
										model.permissions[action.type],
								  ),
						affectedEntries: selected,
					}),
				tooltip:
					typeof disabledReason === 'string' ? disabledReason : undefined,
				disabled: !!disabledReason,
				danger: action.isDangerous,
			};
		}),
	);

	const disabledReason = autoUIGetDisabledReason(
		selected,
		hasOngoingAction,
		null,
		t,
	);

	return (
		<Box alignSelf="flex-start">
			<DropDownButton
				compact={[true, true, false, false]}
				joined
				alignRight
				secondary
				disabled={!!disabledReason}
				tooltip={disabledReason}
				icon={<FontAwesomeIcon icon={faEllipsisH} />}
				label={t('labels.actions')}
				items={actionHandlers}
			/>
		</Box>
	);
};
