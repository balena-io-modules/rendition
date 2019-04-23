import {
	Tab as GrommetTab,
	Tabs as GrommetTabs,
	TabsProps as GrommetTabsProps,
} from 'grommet';
import map = require('lodash/map');
import * as React from 'react';
import asRendition from '../asRendition';
import { EnhancedType } from '../common-types';

export interface TabsProps extends GrommetTabsProps {
	tabs: string[];
	children: JSX.Element[];
}

const TabsBase = ({ children, tabs, ...props }: TabsProps) => {
	return (
		<GrommetTabs justify="start" {...props}>
			{map(children, (child, index) => {
				return (
					<GrommetTab key={tabs[index]} title={tabs[index]}>
						{child}
					</GrommetTab>
				);
			})}
		</GrommetTabs>
	);
};

export default asRendition<TabsProps>(TabsBase) as React.ComponentClass<
	EnhancedType<TabsProps>
>;
