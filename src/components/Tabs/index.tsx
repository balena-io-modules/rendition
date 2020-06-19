import styled from 'styled-components';
import {
	TabProps,
	Tab as GrommetTab,
	Tabs as GrommetTabs,
	TabsProps,
} from 'grommet';
export { TabProps, TabsProps } from 'grommet';
import * as React from 'react';
import asRendition from '../../asRendition';
import { Flex } from '../Flex';

interface InnerTabProps extends TabProps {
	compact?: boolean;
	index: number;
	length?: any;
}

interface InnerTabsProps extends TabsProps {
	compact?: boolean;
}

const ScrollWrapper = styled(GrommetTabs)<{
	compact?: boolean;
}>`
	${(props) => {
		if (props.compact) {
			return `
				& > div {
					scroll-snap-type: x mandatory;
					overflow-x: scroll;
					display: flex;
					flex-wrap: nowrap;

					scrollbar-width: none;
					-ms-overflow-style: none;

					&::-webkit-scrollbar {
						width: 0px;
					}
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

export const Tab = ({
	compact,
	title,
	index,
	length,
	...props
}: InnerTabProps) => {
	console.log(index, length);

	return (
		<Flex>
			{index === 0 && <button>left</button>}
			<TabTitle compact={compact} title={title} {...props}>
				{title}
			</TabTitle>
			{index + 1 === length && <button>right</button>}
		</Flex>
	);
};

const TabsBase = ({ children, ...props }: InnerTabsProps) => {
	const mapLength = React.Children.count(children);

	return (
		<ScrollWrapper justify="start" {...props}>
			{React.Children.map(
				children,
				(tab: React.ReactElement<InnerTabProps>, index: number) => {
					return React.cloneElement(tab, {
						compact: props.compact,
						index,
						length: mapLength,
					});
				},
			)}
		</ScrollWrapper>
	);
};

export const Tabs = (asRendition(
	TabsBase,
) as unknown) as React.FunctionComponent<TabsProps>;
