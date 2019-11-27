import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons/faLightbulb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import asRendition from '../../asRendition';
import {
	Coloring,
	DefaultProps,
	RenditionSystemProps,
	Sizing,
	Theme,
} from '../../common-types';
import { DismissableContainer } from '../../internal/DismissableContainer';
import { getColor } from '../../utils';
import { Box } from '../Box';
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
		? 'Danger!'
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
	return props.danger
		? faExclamationCircle
		: props.warning
		? faExclamationTriangle
		: props.success
		? faCheckCircle
		: props.info
		? faLightbulb
		: '';
};

const Alert = (props: ThemedAlertProps) => {
	const { emphasized, plaintext, prefix, onDismiss, ...restProps } = props;
	const icon = getIcon(props);
	const title = plaintext ? null : getTitle(props);
	const color = getColor(props, 'color', 'main');
	const lineHeight = props.theme.fontSizes[1] * props.theme.lineHeight;

	if (plaintext) {
		return (
			<Flex color={color} {...restProps}>
				{icon && (
					<Txt fontSize={1} mb="auto" mr={2}>
						<FontAwesomeIcon icon={icon} />
					</Txt>
				)}
				<Txt.span fontSize={1}>{props.children}</Txt.span>
			</Flex>
		);
	}

	return (
		<DismissableContainer
			baselineHeight={lineHeight}
			solid={emphasized}
			color={color}
			onDismiss={onDismiss}
			{...restProps}
		>
			{icon && (
				<Txt fontSize={1} mb="auto" mr={3}>
					<FontAwesomeIcon icon={icon} />
				</Txt>
			)}
			<Box flex={1}>
				{title && (
					<Txt.span fontSize={1} bold mr={2}>
						{title}
					</Txt.span>
				)}
				<Txt.span
					fontSize={1}
					bold={emphasized}
					color={emphasized ? 'white' : 'text.main'}
				>
					{props.children}
				</Txt.span>
			</Box>
		</DismissableContainer>
	);
};

interface ThemedAlertProps extends InternalAlertProps {
	theme: Theme;
}

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
