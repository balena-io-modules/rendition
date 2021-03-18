import * as React from 'react';
import startCase from 'lodash/startCase';
import { Box } from '../../Box';
import { Txt } from '../../Txt';
import { WidgetProps } from './widget-util';

type WidgetMetaProps = {
	valueKey?: string;
	schema: WidgetProps['schema'];
	uiSchema: WidgetProps['uiSchema'];
};

// Renders the title and description for a widget (if set)
export default function WidgetMeta({
	valueKey,
	schema = {},
	uiSchema = {},
}: WidgetMetaProps) {
	const title =
		uiSchema['ui:title'] !== undefined
			? uiSchema['ui:title']
			: schema.title || valueKey;
	const description = uiSchema['ui:description'] ?? schema.description;
	if (!title && !description) {
		return null;
	}
	return (
		<Box mr={2}>
			{title && <Txt bold>{startCase(title)}</Txt>}
			{description && (
				<Txt fontSize="85%" color="text.light">
					{description}
				</Txt>
			)}
		</Box>
	);
}
