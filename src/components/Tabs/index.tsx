import styled from 'styled-components';
import {
	TabProps,
	Tab as GrommetTab,
	Tabs as GrommetTabs,
	TabsProps,
} from 'grommet';
export { TabProps, TabsProps } from 'grommet';
import React from 'react';
import asRendition from '../../asRendition';
import { Flex } from '../Flex';

interface InnerTabProps extends TabProps {
	compact?: boolean;
	index: number;
	length?: number;
}

interface InnerTabsProps extends TabsProps {
	compact?: boolean;
}

const ScrollWrapper = styled(GrommetTabs)<{
	compact?: boolean;
}>`
	position: relative;
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
			`;
		}
	}}
`;

const TabTitle = styled(GrommetTab)<{
	compact?: boolean;
}>`
	${(props) => {
		if (props.compact) {
			return `
			& > div {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				scroll-snap-align: center;
			}
			`;
		}
	}}
`;

export const Tab = ({ compact, title, ...props }: InnerTabProps) => {
	return <TabTitle compact={compact} title={title} {...props} />;
};

const TabsBase = ({ children, compact = false, ...props }: InnerTabsProps) => {
	return (
		<Flex>
			<ScrollWrapper justify="start" compact={compact} {...props}>
				{React.Children.map(
					children,
					(tab: React.ReactElement<InnerTabProps>) => {
						return React.cloneElement(tab, {
							compact,
						});
					},
				)}
			</ScrollWrapper>
		</Flex>
	);
};

export const Tabs = (asRendition(
	TabsBase,
) as unknown) as React.FunctionComponent<TabsProps>;
