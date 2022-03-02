import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../';
import { Flex, FlexProps } from '../../components/Flex';
import { Heading } from '../../components/Heading';

interface NavbarProps extends FlexProps {
	title: string;
	logo?: string;
}

export const Navbar = ({ title, logo, ...flexProps }: NavbarProps) => {
	return (
		<Flex bg="secondary.main" alignItems="center" {...flexProps}>
			{logo && <img src={logo} alt={title} height="50px" />}
			<Heading color="white">{title}</Heading>
			{window.REACT_APP_AUTHENTICATION_PROCESS && (
				<Link style={{ textDecoration: 'none' }} to="/login">
					Login
				</Link>
			)}
		</Flex>
	);
};
