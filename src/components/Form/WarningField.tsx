import * as React from 'react';
import { Alert } from '../Alert';
import { Renderer } from '../Renderer';

export const WarningField = ({ warning }: { warning: string }) => {
	return (
		<Alert plaintext warning mb={2}>
			<Renderer
				value={warning}
				schema={{
					type: 'string',
					format: 'markdown',
				}}
			/>
		</Alert>
	);
};
