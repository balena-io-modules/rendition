import * as React from 'react';
import FaCheckCircle = require('react-icons/lib/fa/check-circle');
import FaClose = require('react-icons/lib/fa/close');
import FaExclamationCircle = require('react-icons/lib/fa/exclamation-circle');
import FaExclamationTriangle = require('react-icons/lib/fa/exclamation-triangle');
import FaInfoCircle = require('react-icons/lib/fa/info-circle');
import styled, { StyledFunction, withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { bold, getColor, normal, px } from '../utils';

interface AlertProps extends DefaultProps, Coloring, Sizing {
	plaintext?: boolean;
	prefix?: JSX.Element | string | false;
	onDismiss?: () => void;
}

const getPadding = (props: AlertProps) =>
	props.emphasized ? '15px 40px' : '8px 32px';

const getTitle = (props: AlertProps) => {
	if (props.prefix === false) {
		return;
	}
	if (props.prefix !== undefined) {
		return props.prefix;
	}
	return props.danger
		? 'Oh no!'
		: props.warning
			? 'Warning!'
			: props.success
				? 'Great!'
				: props.info
					? 'Hey!'
					: '';
};

const AlertTitle = styled.span`
	display: inline-block;
	margin-right: 8px;
`;

// Firefox didn't middle align absolute positioned elements
// using flex, so we had to use an extra wrapper element
const DismissButtonWrapper = (styled.div as StyledFunction<AlertProps>)`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0;
	bottom: 0;
	right: ${props => px(props.emphasized ? 20 : 12)}
`;

const DismissButton = styled.button`
	padding: 0;
	border: 0;
	background: none;
	line-height: 0;
	font-size: 14px;
	cursor: pointer;

	&:hover {
		color: black;
	}
`;

const AlertBase = (styled.div as StyledFunction<AlertProps>)`
	display: flex;
	align-items: center;
	justify-content: normal;

	position: relative;
	min-height: ${props =>
		px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
	padding: ${props => getPadding(props)};
	margin: 0;
	border-radius: ${props => px(props.theme.radius)};
	font-family: inherit;
	font-size: 16px;
	font-kerning: none;
	font-weight: ${props => normal(props)};
	appearance: none;
	text-decoration: none;
	vertical-align: middle;
	line-height: 1.1;
`;

// That's the normal alert
const Outline = AlertBase.extend`
	padding-left: 19px;
	border: 1px solid ${props => getColor(props, 'bg', 'main')};
	background: ${props => props.bg || getColor(props, 'bg', 'light')};
	color: ${props => props.theme.colors.text.main};

	& ${AlertTitle}, & ${DismissButtonWrapper} > ${DismissButton} {
		font-weight: ${props => bold(props)};
		color: ${props => getColor(props, 'color', 'main')};
	}
`;

const Filled = AlertBase.extend`
	border: 0;
	font-weight: ${props => bold(props)};
	text-align: center;
	background: ${props => props.bg || getColor(props, 'bg', 'main')};
	color: ${props => props.color || '#fff'};
`;

const Plaintext = AlertBase.extend`
	min-height: auto;
	padding: 0;
	font-size: 14px;

	&,
	& ${DismissButtonWrapper} > ${DismissButton} {
		color: ${props =>
			props.color ||
			(props.info
				? props.theme.colors.gray.main
				: getColor(props, 'color', 'main'))};
	}
`;

const getIcon = (props: AlertProps) => {
	if (props.prefix === false) {
		return;
	}
	if (props.prefix !== undefined) {
		return props.prefix;
	}
	return props.danger ? (
		<FaExclamationCircle />
	) : props.warning ? (
		<FaExclamationTriangle />
	) : props.success ? (
		<FaCheckCircle />
	) : props.info ? (
		<FaInfoCircle />
	) : (
		''
	);
};

const DismissAlert = (props: AlertProps) => (
	<DismissButtonWrapper {...props}>
		<DismissButton onClick={() => props.onDismiss && props.onDismiss()}>
			<FaClose />
		</DismissButton>
	</DismissButtonWrapper>
);

export default withTheme(
	asRendition((props: AlertProps) => {
		const { emphasized, plaintext, prefix, ...restProps } = props;
		const title = plaintext ? getIcon(props) : getTitle(props);
		if (plaintext) {
			return (
				<Plaintext {...restProps}>
					<div>
						{title && <AlertTitle children={title} />}
						{props.children}
					</div>
					{props.onDismiss && <DismissAlert {...restProps} />}
				</Plaintext>
			);
		} else if (emphasized) {
			return (
				<Filled emphasized {...restProps}>
					<div>
						{title && <AlertTitle children={title} />}
						{props.children}
					</div>
					{props.onDismiss && <DismissAlert {...restProps} />}
				</Filled>
			);
		} else {
			return (
				<Outline {...restProps}>
					<div>
						{title && <AlertTitle children={title} />}
						{props.children}
					</div>
					{props.onDismiss && <DismissAlert {...restProps} />}
				</Outline>
			);
		}
	}),
) as React.ComponentClass<AlertProps>;
