import * as React from 'react';
import FaBan from 'react-icons/lib/fa/ban';
import FaCheckCircle from 'react-icons/lib/fa/check-circle';
import FaClose from 'react-icons/lib/fa/close';
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle';
import FaLightbulb from 'react-icons/lib/fa/lightbulb-o';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import {
	Coloring,
	DefaultProps,
	RenditionSystemProps,
	Sizing,
} from '../../common-types';
import { getColor, px } from '../../utils';
import { Box } from '../Box';
import Button from '../Button';
import { Flex } from '../Flex';
import Txt from '../Txt';

const getTitle = (props: AlertProps) => {
	if (props.prefix === false) {
		return;
	}
	if (props.prefix !== undefined) {
		return props.prefix;
	}
	return props.danger
		? 'Oh snap!'
		: props.warning
		? 'Warning!'
		: props.success
		? 'Success!'
		: props.info
		? 'Note!'
		: '';
};

const getIcon = (props: InternalAlertProps) => {
	if (props.prefix === false) {
		return;
	}
	if (props.prefix !== undefined) {
		return;
	}
	return props.danger ? (
		<FaBan />
	) : props.warning ? (
		<FaExclamationTriangle />
	) : props.success ? (
		<FaCheckCircle />
	) : props.info ? (
		<FaLightbulb />
	) : (
		''
	);
};

// We set the line-height to be the same with the alert title so everything lines up nicely and still stays at top when the content is multiple lines.
const AlertIcon = styled(Txt)<{ plaintext: boolean | undefined }>`
	line-height: ${props => px(props.theme.fontSizes[2] * 1.5)};
`;

// We define these so we can refer to them in the styled-components functions for overriding the color.
const DismissButtonIcon = styled(AlertIcon)``;
const AlertTitle = styled(Txt.span)``;

const AlertBase = styled(Flex)<InternalAlertProps>`
	justify-content: space-between;
	margin: 0;
	border: 1px solid ${props => getColor(props, 'bg', 'main')};
	min-height: ${props => px(props.theme.space[4])};
	padding: ${props =>
		`${px(props.theme.space[2])} ${px(props.theme.space[3])}`};
	border-radius: ${props => px(props.theme.radius)};
	font-size: ${props => px(props.theme.fontSizes[2])};
`;

// That's the normal alert
const Outline = styled(AlertBase)<InternalAlertProps>`
	background: ${props => props.bg || getColor(props, 'bg', 'light')};
	color: ${props => props.theme.colors.text.main};

	& ${AlertIcon}, & ${AlertTitle}, & ${DismissButtonIcon} {
		color: ${props => getColor(props, 'color', 'main')};
	}
`;

const Filled = styled(AlertBase)<InternalAlertProps>`
	background: ${props => props.bg || getColor(props, 'bg', 'main')};
	color: ${props => props.color || '#fff'};

	& ${AlertTitle}, & ${DismissButtonIcon} {
		color: #fff;
	}
`;

const Plaintext = styled(AlertBase)<InternalAlertProps>`
	min-height: auto;
	padding: 0;
	border: 0;

	&,
	& ${DismissButtonIcon} {
		color: ${props => props.color || getColor(props, 'color', 'main')};
	}
`;

const getWrapper = (
	plaintext: boolean | undefined,
	emphasized: boolean | undefined,
) => {
	if (plaintext) {
		return Plaintext;
	}

	if (emphasized) {
		return Filled;
	}

	return Outline;
};

const Alert = (props: InternalAlertProps) => {
	const { emphasized, plaintext, prefix, onDismiss, ...restProps } = props;
	const icon = getIcon(props);
	const iconMargin = plaintext ? 2 : 3;
	const title = plaintext ? null : getTitle(props);
	const Wrapper = getWrapper(plaintext, emphasized);

	return (
		<Wrapper emphasized={emphasized} {...restProps}>
			{icon && (
				<AlertIcon plaintext={plaintext} mt={'-1px'} mb="auto" mr={iconMargin}>
					{icon}
				</AlertIcon>
			)}
			<Box flex={1}>
				{title && (
					<AlertTitle fontSize={2} bold mr={2}>
						{title}
					</AlertTitle>
				)}
				{props.children}
			</Box>
			{onDismiss && (
				<Button mt={'-1px'} mb="auto" ml={iconMargin} plain onClick={onDismiss}>
					<DismissButtonIcon plaintext={plaintext}>
						<FaClose />
					</DismissButtonIcon>
				</Button>
			)}
		</Wrapper>
	);
};

interface InternalAlertProps extends DefaultProps, Coloring, Sizing {
	plaintext?: boolean;
	bg?: string;
	prefix?: JSX.Element | string | false;
	onDismiss?: () => void;
}

export type AlertProps = InternalAlertProps & RenditionSystemProps;
export default asRendition<React.FunctionComponent<AlertProps>>(
	Alert,
	[],
	['bg'],
);
