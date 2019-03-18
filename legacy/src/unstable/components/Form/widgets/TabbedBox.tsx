import map = require('lodash/map');
import * as React from 'react';
import { Box, Button, Flex, Txt } from '../../../../';

interface TabbedBoxProps {
	tabs: string[];
	help?: JSX.Element;
	children: JSX.Element[];
}

interface TabbedBoxState {
	show: number;
}

export class TabbedBox extends React.Component<TabbedBoxProps, TabbedBoxState> {
	constructor(props: TabbedBoxProps) {
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
		const visibleChild = this.props.children[this.state.show];

		return (
			<Box>
				<Flex justify="space-between" mb={1}>
					<Flex>
						{map(this.props.tabs, (tab, index: number) => {
							return (
								<Button
									key={index}
									plaintext
									data-index={index}
									mr={3}
									onClick={this.showTab}
								>
									<Txt bold={index === this.state.show}>{tab}</Txt>
								</Button>
							);
						})}
					</Flex>

					{this.props.help}
				</Flex>

				{visibleChild}
			</Box>
		);
	}
}
