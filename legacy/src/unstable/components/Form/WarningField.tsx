import * as React from 'react';
import Alert from '../../../components/Alert';
import { Markdown } from '../../../extra/Markdown';

export const WarningField = ({ warning }: { warning: string }) => {
	return (
		<Alert plaintext warning mb={2}>
			<Markdown>{warning}</Markdown>
		</Alert>
	);
};
