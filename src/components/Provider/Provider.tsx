import {
	Grommet
} from 'grommet'
import * as React from 'react';

const Provider = ({ theme, ...props }: any) => {
	return (
		<Grommet theme={theme} {...props} />
	);
};

export default Provider;
