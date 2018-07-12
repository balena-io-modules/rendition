import * as React from 'react';
import Txt from '../../../../components/Txt';
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
		<Txt mb={1} id={id} color={Theme.colors.text.light}>
			{description}
		</Txt>
	);
};
