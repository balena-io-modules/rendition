import * as React from 'react';
import { Markdown } from '../../../../extra/Markdown';
import Theme from '../../../../theme';

export const DescriptionField = ({
	id,
	description,
}: {
	id: string;
	description?: string;
}) => {
	if (!description) {
		return null;
	}

	return (
		<Markdown
			mb={1}
			id={id}
			className="rendition-form-description"
			color={Theme.colors.text.light}
		>
			{description}
		</Markdown>
	);
};
