import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import assign from 'lodash/assign';
import * as React from 'react';
import { compose, withProps } from 'recompose';
import styled from 'styled-components';
import {
	display,
	DisplayProps,
	maxHeight,
	MaxHeightProps,
} from 'styled-system';
import { DefaultProps } from '../../common-types';
import { Box, BoxProps } from '../Box';
import Container from '../Container';
import { Flex, FlexProps } from '../Flex';

const BrandBox = styled(Box)`
	display: flex;
	height: auto;
	min-width: 150px;
	align-self: center;
`;

const IconBox = styled(Box)<BoxProps & DisplayProps>`
	${display} align-self: center;
	cursor: pointer;
`;

const MenuBox = styled(Flex)<FlexProps & MaxHeightProps & DisplayProps>`
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
								{this.state.open ? (
									<FontAwesomeIcon icon={faTimes} />
								) : (
									<FontAwesomeIcon icon={faBars} />
								)}
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

export interface NavbarProps extends DefaultProps {
	brand?: JSX.Element;
}

export default (compose(setDefaultProps)(
	Navbar,
) as unknown) as React.ForwardRefExoticComponent<
	NavbarProps & React.RefAttributes<Navbar>
>;
