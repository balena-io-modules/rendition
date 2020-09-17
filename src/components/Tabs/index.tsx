import styled from 'styled-components';
import {
	TabProps,
	Tab as GrommetTab,
	Tabs as GrommetTabs,
	TabsProps,
} from 'grommet';
export { TabProps, TabsProps } from 'grommet';
import React, { useState } from 'react';
import asRendition from '../../asRendition';
import { Flex } from '../Flex';
import Button from '../Button';
import clamp from 'lodash/clamp';

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
	position: relative;
	${(props) => {
		console.log('props.compact', props.theme.fontSizes[6]);
		if (props.compact) {
			return `
			// padding-right: ${props.theme.fontSizes[7]}px !important;
			& > div {
					scroll-snap-type: x mandatory;
					overflow-x: scroll;
					display: flex;
					flex-wrap: nowrap;

					// scrollbar-width: none;
					// -ms-overflow-style: none;

					// &::-webkit-scrollbar {
					// 	width: 0px;
					// }
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

const ButtonWrapper = styled(Button)<{
	compact?: boolean;
}>`
	// position: absolute;
	// right: 0;
`;

export const Tab = ({ compact, title, ...props }: InnerTabProps) => {
	return (
		<Flex>
			<TabTitle compact={compact} title={title} {...props}>
				{title}
			</TabTitle>
		</Flex>
	);
};

const TabsBase = ({ children, compact = false, ...props }: InnerTabsProps) => {
	const childrenCount = React.Children.count(children);
	const startIndex = 1;
	const [tabIndex, setTabIndex] = useState(startIndex);

	const incrementTabIndex = () => {
		const newIndex = clamp(tabIndex + 1, startIndex, childrenCount);
		setTabIndex(newIndex);
	};

	const decrementTabIndex = () => {
		const newIndex = clamp(tabIndex - 1, startIndex, childrenCount);
		setTabIndex(newIndex);
	};

	return (
		<Flex>
			{compact && (
				<Button m={2} plain primary onClick={decrementTabIndex}>
					left
				</Button>
			)}
			<ScrollWrapper
				activeIndex={tabIndex}
				onActive={setTabIndex}
				justify="start"
				compact={compact}
				{...props}
			>
				{React.Children.map(
					children,
					(tab: React.ReactElement<InnerTabProps>) => {
						return React.cloneElement(tab, {
							compact,
						});
					},
				)}
			</ScrollWrapper>
			{compact && (
				<ButtonWrapper m={2} plain primary onClick={incrementTabIndex}>
					right
				</ButtonWrapper>
			)}
		</Flex>
	);
};

export const Tabs = (asRendition(
	TabsBase,
) as unknown) as React.FunctionComponent<TabsProps>;
