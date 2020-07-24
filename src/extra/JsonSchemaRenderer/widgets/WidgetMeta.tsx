import * as React from 'react';
import { get } from 'lodash';
import { Box } from '../../../components/Box';
import Txt from '../../../components/Txt';
import { WidgetProps } from './widget-util';

// Renders the title and description for a widget (if set)
export default function WidgetMeta({
	schema = {},
	uiSchema = {},
}: Pick<WidgetProps, 'schema' | 'uiSchema'>) {
	const title = get(uiSchema, 'ui:title', schema.title);
	const description = get(uiSchema, 'ui:description', schema.description);
	if (!title && !description) {
		return null;
	}
	return (
		<Box mr={2}>
			{title && <Txt bold>{title}</Txt>}
			{description && (
				<Txt fontSize="85%" color="text.light">
					{description}
				</Txt>
			)}
		</Box>
	);
}
