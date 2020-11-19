import styled from 'styled-components';
import {
	TabProps as GrommetTabProps,
	Tab as GrommetTab,
	Tabs as GrommetTabs,
	TabsProps as GrommetTabsProps,
} from 'grommet';
import React from 'react';
import asRendition from '../../asRendition';

export interface TabProps extends GrommetTabProps {
	/** Any content that is internally wrapped in a `Tab`component */
	children?: React.ReactNode;
}

export interface TabsProps extends GrommetTabsProps {
	/** If true, render tabs on a single line. (for mobile use) */
	compact?: boolean;
}

const ScrollWrapper = styled(GrommetTabs)<{
	compact?: boolean;
}>`
	position: relative;
	display: flex;
	align-items: stretch;
	height: 100%;

	div[role='tabpanel'] {
		display: flex;
		flex: 1;
	}

	${(props) => {
		if (props.compact) {
			return `
				width: 100%;

				& > div {
					scroll-snap-type: x mandatory;
					overflow-x: scroll;
					display: flex;
					flex-wrap: nowrap;
				}

				div[role=tabpanel] {
					overflow-x: auto;
				}
				
				div > button[role=tab] > div {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					scroll-snap-align: center;
				}
			`;
		}
	}}
`;

export const Tab = (props: TabProps) => <GrommetTab {...props} />;

const TabsBase = ({ children, compact = false, ...props }: TabsProps) => {
	return (
		<ScrollWrapper justify="start" compact={compact} {...props}>
			{children}
		</ScrollWrapper>
	);
};

/**
 * A component used to render tabbed children components.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Tabs/Tabs.stories.tsx)
 */
export const Tabs = (asRendition(
	TabsBase,
) as unknown) as React.FunctionComponent<TabsProps>;
