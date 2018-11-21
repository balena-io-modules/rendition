import assign = require('lodash/assign');
import * as React from 'react';
import CloseIcon = require('react-icons/lib/md/close');
import MenuIcon = require('react-icons/lib/md/dehaze');
import { compose, withProps } from 'recompose';
import { BoxProps, FlexProps, NavbarProps } from 'rendition';
import styled, { StyledFunction, withTheme } from 'styled-components';
import { responsiveStyle } from 'styled-system';
import Container from './Container';
import { Box, Flex } from './Grid';

const display = responsiveStyle('display', 'display');
const maxHeight = responsiveStyle('max-height', 'maxHeight');

const BrandBox = styled(Box)`
	display: flex;
	height: auto;
	min-width: 150px;
	align-self: center;
`;

const IconBox = (styled(Box) as StyledFunction<
	BoxProps & { display?: string | string[] }
>)`
  ${display} align-self: center;
  cursor: pointer;
`;

const MenuBox = (styled(Flex) as StyledFunction<
	FlexProps & { maxHeight?: string | string[] }
>)`
  ${display} ${maxHeight};
  text-align: center;
  transition: max-height 0.4s ease-in-out;
  align-self: center;
  overflow: hidden;

  a {
    width: 100%;
    display: inline-block;
  }
`;

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

export default compose(withTheme, setDefaultProps)(Navbar);
