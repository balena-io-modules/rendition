import map = require('lodash/map');
import * as React from 'react';
import { compose } from 'recompose';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import Button from './Button';
import { Box, Flex } from './Grid';
import Txt from './Txt';

export interface TabsProps {
	tabs: string[];
	help?: JSX.Element;
	children: JSX.Element[];
}

export interface TabsState {
	show: number;
}

const FlexTab = styled(Flex)`
	${props => `border-bottom: ${props.theme.colors.gray.main};
		border-color: ${props.theme.colors.gray.main};
	`}
	border-style: hidden;
	border-width: 1px;
	border-bottom-style: solid;
`;

const ButtonBase = styled(Button)`
	padding: 4px 10px 2px;
	border: 1px solid white;
	border-radius: 0;
	border-bottom: none;
	${props =>
		props.active
			? `
		border-style: solid;
		border-width: 1px;
		border-color: ${props.theme.colors.gray.main};
		border-top-right-radius: 4px;
		border-top-left-radius: 4px;
		transform: translateY(1px);
		&::after {
			content: '';
			height: 3px;
			background: white;
			position: absolute;
			bottom: -2px;
			left: 0;
			right: 0;
		}
		`
			: `
		`}
`;

class Tabs extends React.Component<TabsProps, TabsState> {
	constructor(props: TabsProps) {
		super(props);

		this.state = {
			show: 0,
		};
	}

	public showTab = (e: React.MouseEvent<HTMLElement>) => {
		const index = parseInt(e.currentTarget.dataset.index || '', 10);

		this.setState({ show: index });
	};

	public render() {
		const { tabs, help, children, ...props } = this.props;

		const visibleChild = children[this.state.show];

		return (
			<Box {...props}>
				<FlexTab justify="space-between" mb={1}>
					<Flex>
						{map(tabs, (tab, index: number) => {
							return (
								<ButtonBase
									key={index}
									plaintext
									active={index === this.state.show}
									data-index={index}
									mr={2}
									onClick={this.showTab}
								>
									<Txt>{tab}</Txt>
								</ButtonBase>
							);
						})}
					</Flex>

					{help}
				</FlexTab>

				{visibleChild}
			</Box>
		);
	}
}

export default compose(
	withTheme,
	asRendition,
)(Tabs) as React.ComponentClass<TabsProps>;
