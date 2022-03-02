import React from 'react';
import { JSONSchema } from '../../components/Renderer/types';
import { Flex } from '../../components/Flex';
import { Txt } from '../../components/Txt';
import { Form } from '../../components/Form';
import { Link } from 'react-router-dom';
import { Location } from 'history';
import styled from 'styled-components';
import { px } from '../../utils';
import { Divider } from '../../components/Divider';
import { ISubmitEvent } from '@rjsf/core';
import { pine } from './odata';
import { notifications } from '../../components/Notifications';

const StyledForm = styled(Form)`
	min-width: 350px;
	font-family: ${(props) => props.theme.font};
	legend {
		font-size: ${(props) => px(props.theme.fontSizes[5])};
		text-align: center;
	}
`;

interface AuthPaths {
	[key: string]: JSONSchema;
}

const properties: JSONSchema['properties'] = {
	username: {
		title: 'Username',
		type: 'string',
	},
	password: {
		title: 'Password',
		type: 'string',
	},
};

// TODO: Routes are hardcoded, check if we can get these from the generated openapi file
export const authPaths: AuthPaths = {
	'/login': {
		title: 'Login Form',
		type: 'object',
		properties,
	},
	'/user/register': {
		title: 'Sign up Form',
		type: 'object',
		properties,
	},
	'/user/reset-password': {
		title: 'Forgot password Form',
		type: 'object',
		properties: { username: properties.username },
	},
	'/user/reset-password/:loginCode': {
		title: 'Reset password Form',
		type: 'object',
		properties: {
			password: {
				title: 'New password',
				type: 'string',
			},
			confirmPassword: {
				title: 'Confirm password',
				type: 'string',
			},
		},
	},
};

const uiSchema = {
	password: {
		'ui:options': {
			inputType: 'password',
		},
	},
};

interface AuthenticationProps {
	location: Location;
}

export const Authentication = ({ location }: AuthenticationProps) => {
	const pathSchema = authPaths[location.pathname];
	const pathIncludes = (pathName: string) =>
		location.pathname.includes(pathName);
	console.log(location);

	const submit = async ({
		formData,
	}: ISubmitEvent<JSONSchema['properties']>) => {
		try {
			await pine.post({
				url: location.pathname.replace('/', ''), // This will not work because of the V6
				body: formData,
			});
			notifications.addNotification({
				content: '',
				type: 'success',
			});
		} catch (err) {
			notifications.addNotification({
				content: err.message ?? err,
				type: 'danger',
			});
		}
	};

	return (
		<Flex justifyContent="center" alignItems="center">
			<Flex flexDirection="column">
				<StyledForm
					schema={pathSchema}
					uiSchema={uiSchema}
					onFormSubmit={submit}
				/>
				{pathIncludes('login') && (
					<Flex flexDirection="column" alignItems="center" mt={3}>
						<Divider />
						<Txt py={2}>
							Are you new? <Link to="/user/register">Sign up</Link>
						</Txt>
						<Link to="/forgot-password">Forgot password?</Link>
					</Flex>
				)}
				{pathIncludes('register') && (
					<Flex flexDirection="column" alignItems="center" mt={3}>
						<Divider />
						<Txt py={2}>
							Already have an account? <Link to="/login">Log in</Link>
						</Txt>
					</Flex>
				)}
				{pathIncludes('reset-password') && (
					<Flex flexDirection="column" alignItems="center" mt={3}>
						<Divider />
						<Txt py={2}>
							Go back to <Link to="/login">Login page</Link>
						</Txt>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};
