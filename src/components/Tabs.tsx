import map = require('lodash/map');
import * as React from 'react';
import { compose } from 'recompose';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import Button from './Button';
import { Box, Flex } from './Grid';
import Txt from './Txt';

interface TabsProps {
	tabs: string[];
	help?: JSX.Element;
	children: JSX.Element[];
}

interface TabsState {
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
	margin: 4px;
	margin-top: 6px;
	margin-left: 6px;
	padding: 10px;
	${props =>
		props.active
			? `
		border-style: solid;
		border-width: 1px;
		border-color: ${props.theme.colors.gray.main};
		border-top-right-radius: 4px;
		border-top-left-radius: 4px;
		transform: translateY(5px);
		border-bottom: white;
		border-bottom-width: 2px;
		border-bottom-style: solid;
		`
			: `
		transform: translateY(4px);
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
									mr={3}
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
