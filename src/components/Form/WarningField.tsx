import * as React from 'react';
import { Alert } from '../Alert';
import { Markdown } from '../../extra/Markdown';
import { Txt } from '../Txt';

export const WarningField = ({ warning }: { warning: string }) => {
	return (
		<Alert plaintext warning mb={2}>
			<Markdown
				componentOverrides={{
					p: (props: any) => <Txt.p {...props} margin={0} />,
				}}
			>
				{warning}
			</Markdown>
		</Alert>
	);
};
