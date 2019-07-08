import { Tabs as GrommetTabs, TabsProps } from 'grommet';
export { Tab, TabProps, TabsProps } from 'grommet';
import * as React from 'react';
import asRendition from '../asRendition';

const TabsBase = ({ ...props }: TabsProps) => {
	return <GrommetTabs justify="start" {...props} />;
};

export const Tabs = asRendition(TabsBase) as React.FunctionComponent<TabsProps>;
