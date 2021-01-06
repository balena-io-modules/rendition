import * as React from 'react';
import { Renderer } from '../../../components/Renderer';
import Theme from '../../../theme';

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
		<Renderer
			id={id}
			className="rendition-form-description"
			color={Theme.colors.text.light}
			fontSize={1}
			value={description}
			schema={{
				type: 'string',
				format: 'markdown',
			}}
		/>
	);
};
