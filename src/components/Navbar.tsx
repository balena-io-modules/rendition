import assign = require('lodash/assign');
import * as React from 'react';
import CloseIcon = require('react-icons/lib/md/close');
import MenuIcon = require('react-icons/lib/md/dehaze');
import { compose, withProps } from 'recompose';
import styled from 'styled-components';
import {
	display,
	DisplayProps,
	maxHeight,
	MaxHeightProps,
} from 'styled-system';
import { DefaultProps, EnhancedType } from '../common-types';
import Container from './Container';
import { Box, BoxProps, Flex, FlexProps } from './Grid';

export interface NavbarProps extends DefaultProps {
	brand?: JSX.Element;
}

const BrandBox = styled(Box)`
	display: flex;
	height: auto;
	min-width: 150px;
	align-self: center;
` as React.ComponentType<EnhancedType<BoxProps>>;

const IconBox = styled(Box)`
	${display} align-self: center;
	cursor: pointer;
` as React.ComponentType<EnhancedType<BoxProps & DisplayProps>>;

const MenuBox = styled(Flex)`
	${display}
	${maxHeight};
	text-align: center;
	transition: max-height 0.4s ease-in-out;
	align-self: center;
	overflow: hidden;

	a {
		width: 100%;
		display: inline-block;
	}
` as React.ComponentType<
	EnhancedType<FlexProps & DisplayProps & MaxHeightProps>
>;

interface NavbarState {
	open: boolean;
}

class Navbar extends React.Component<NavbarProps, NavbarState> {
	constructor(props: NavbarProps) {
		super(props);
		this.state = {
			open: false,
		};
	}

	toggle() {
		this.setState({
			open: !this.state.open,
		});
	}

	render() {
		const { brand, children, ...props }: NavbarProps = this.props;
		return (
			<Box {...props}>
				<Container>
					<Flex flexDirection={['column', 'row']}>
						<Flex>
							<BrandBox p={2}>{brand}</BrandBox>
							<IconBox
								onClick={() => this.toggle()}
								ml={['auto', 0]}
								p={2}
								display={['block', 'none']}
							>
								{this.state.open ? <CloseIcon /> : <MenuIcon />}
							</IconBox>
						</Flex>
						<MenuBox
							maxHeight={[this.state.open ? '100vh' : '0vh', 'none']}
							width={['100%', 'auto']}
							ml={[0, 'auto']}
						>
							{children && (
								<Flex
									width={['100%', 'auto']}
									flexDirection={['column', 'row']}
								>
									{React.Children.map(children, (child, i) => {
										return (
											<Box
												onClick={() => this.toggle()}
												width={['100%', 'auto']}
												p={2}
												key={i}
											>
												{child}
											</Box>
										);
									})}
								</Flex>
							)}
						</MenuBox>
					</Flex>
				</Container>
			</Box>
		);
	}
}

const setDefaultProps = withProps((props: NavbarProps) => {
	return assign(
		{
			color: 'white',
			bg: 'gray.dark',
		},
		props,
	);
});

export default compose(setDefaultProps)(Navbar) as React.ComponentType<
	NavbarProps
>;
