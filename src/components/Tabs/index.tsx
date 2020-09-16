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

const ButtonWrapper = styled(Button)<{
	compact?: boolean;
}>``;

export const Tab = ({ compact, title, ...props }: InnerTabProps) => {
	return (
		<Flex>
			<TabTitle compact={compact} title={title} {...props}>
				{title}
			</TabTitle>
		</Flex>
	);
};

const TabsBase = ({ children, ...props }: InnerTabsProps) => {
	const mapLength = React.Children.count(children);
	const zeroIndexMapLength = mapLength - 1;

	const [tabIndex, setTabIndex] = useState(0);

	const incrementTabIndex = () => {
		const newIndex = clamp(tabIndex + 1, 0, zeroIndexMapLength);
		setTabIndex(newIndex);
	};

	const decrementTabIndex = () => {
		const newIndex = clamp(tabIndex - 1, 0, zeroIndexMapLength);
		setTabIndex(newIndex);
	};

	return (
		<Flex>
			<Button m={2} plain primary onClick={decrementTabIndex}>
				left
			</Button>
			<ScrollWrapper
				activeIndex={tabIndex}
				onActive={setTabIndex}
				justify="start"
				{...props}
			>
				{React.Children.map(
					children,
					(tab: React.ReactElement<InnerTabProps>) => {
						return React.cloneElement(tab, {
							compact: props.compact,
						});
					},
				)}
			</ScrollWrapper>
			<ButtonWrapper m={2} plain primary onClick={incrementTabIndex}>
				right
			</ButtonWrapper>
		</Flex>
	);
};

export const Tabs = (asRendition(
	TabsBase,
) as unknown) as React.FunctionComponent<TabsProps>;
