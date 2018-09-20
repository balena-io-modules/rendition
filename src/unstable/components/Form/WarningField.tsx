import * as React from 'react';
import Alert from '../../../components/Alert';

export const WarningField = ({ warning }: { warning: string }) => {
	return (
		<Alert plaintext warning mb={2}>
			{warning}
		</Alert>
	);
};
