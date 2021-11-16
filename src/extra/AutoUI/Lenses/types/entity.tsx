import React from 'react';
import { LensTemplate } from '..';
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { Flex } from '../../../../components/Flex';
import { Card } from '../../../../components/Card';
import { Txt } from '../../../../components/Txt';
import { Heading } from '../../../../components/Heading';
import { Divider } from '../../../../components/Divider';
import { AutoUIContext, AutoUIModel } from '../../schemaOps';
import { Update } from '../../Collection/Actions/Update';
import { ActionData } from '../../Collection';
import styled from 'styled-components';

interface EntityProps<T> {
	entity: T;
	properties: Array<any & { key: string }>;
	autouiContext: AutoUIContext<T>;
	model: AutoUIModel<T>;
	hasUpdateActions: boolean;
}

const Label = styled(Txt)`
	color: #252629;
	font-size: 11px;
	text-transform: uppercase;
	margin-bottom: 6px;
`;

export const entity: LensTemplate = {
	slug: 'entity',
	name: 'Default entity lens',
	data: {
		label: 'Entity',
		format: 'summary',
		renderer: ({
			entity,
			properties,
			hasUpdateActions,
			model,
			autouiContext,
		}: EntityProps<any>) => {
			const [actionData, setActionData] = React.useState<
				ActionData<any> | undefined
			>();
			const onActionTriggered = React.useCallback(
				(actionData: ActionData<any>) => {
					setActionData(actionData);
					if (actionData.action.actionFn) {
						actionData.action.actionFn({
							affectedEntries: actionData.affectedEntries || [],
						});
					}
				},
				[],
			);

			const onActionDone = React.useCallback(() => {
				setActionData(undefined);
			}, []);

			return (
				<Card>
					{entity && (
						<>
							<Flex flexDirection="row" justifyContent="space-between">
								<Flex flexDirection="column">
									<Heading.h2>
										{properties.length > 0 &&
											properties[0].render(entity[properties[0].key], entity)}
									</Heading.h2>
								</Flex>
								<Flex flexDirection="column" alignItems="flex-end">
									{hasUpdateActions && (
										<Update
											model={model}
											selected={[entity]}
											autouiContext={autouiContext}
											hasOngoingAction={false}
											onActionTriggered={onActionTriggered}
										/>
									)}
								</Flex>
							</Flex>
							<Divider />
							<Flex
								flexDirection="row"
								flexWrap="wrap"
								justifyContent="space-between"
								alignItems="center"
							>
								{properties.map(
									(property) =>
										property.priority !== 'primary' && (
											<Flex
												flexDirection="column"
												m={10}
												key={property.key}
												flex={['100%', '0 0 30%']}
											>
												<Label>{property.title}</Label>
												<Txt>
													{property.render(entity[property.key], entity)}
												</Txt>
											</Flex>
										),
								)}
							</Flex>
							{actionData?.action?.renderer &&
								actionData.action.renderer({
									schema: actionData.schema,
									affectedEntries: actionData.affectedEntries,
									onDone: onActionDone,
								})}
						</>
					)}
				</Card>
			);
		},
		icon: faCube,
		type: '*',
		filter: {
			type: 'object',
			properties: {
				id: {
					type: 'number',
				},
			},
		},
	},
};
