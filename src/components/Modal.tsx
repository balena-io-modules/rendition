import assign = require('lodash/assign');
import * as React from 'react';
import styled, { injectGlobal, withTheme } from 'styled-components';
import { DefaultProps, Theme } from '../common-types';
import { stopPropagation } from '../utils';
import { px } from '../utils';
import Button, { ButtonAnchorProps, ButtonProps } from './Button';
import Fixed from './Fixed';
import { Box, Flex } from './Grid';
import Txt from './Txt';

export interface ModalProps extends DefaultProps {
	title?: string;
	titleElement?: string | JSX.Element;
	titleDetails?: string | JSX.Element;
	action?: string | JSX.Element;
	cancel?: () => any;
	done: () => any;
	primaryButtonProps?: ButtonProps | ButtonAnchorProps;
	secondaryButtonProps?: ButtonProps | ButtonAnchorProps;
	cancelButtonProps?: ButtonProps | ButtonAnchorProps;
	containerStyle?: React.CSSProperties;
}

export interface ThemedModalProps extends ModalProps {
	theme: Theme;
}

const bodyNoOverflowClass = `rendition-modal-open`;

// tslint:disable-next-line no-unused-expression
injectGlobal`
	.${bodyNoOverflowClass} {
		overflow: hidden;
	}
`;

const ModalWrapper = styled(Flex)`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	pointer-events: none;
`;

const ModalBackdrop = styled(Fixed)`
	pointer-events: auto;
`;

const DEFAULT_MODAL_WIDTH = 700;

const ModalHeader = styled(Txt)`
	margin-bottom: 50px;
	font-size: ${props => px(props.theme.fontSizes[4])};
`;

const ModalTitleDetails = styled(Txt)`
	color: ${props => props.theme.colors.text.light};
	font-size: ${props => px(props.theme.fontSizes[2])};
`;

const ModalSizer = styled(Box)`
	position: relative;
	width: 100%;
	max-height: 100%;
	padding: 0 15px;
	overflow-y: auto;
	background-color: transparent;
	z-index: 9999;
	pointer-events: auto;
`;

const ModalPanel = styled(Box)`
	max-width: 100%;
	min-height: 50px;
	margin: 15px auto;
	border: solid 0.5px #9b9b9b;
	border-radius: 2px;
	background-color: #ffffff;
	box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.4);
`;

const ModalButton = (props: ButtonProps | ButtonAnchorProps) => {
	return 'href' in props && props.href ? (
		<Button.a {...props} />
	) : (
		<Button {...props as ButtonProps} />
	);
};

class Modal extends React.Component<ThemedModalProps, any> {
	static mountedCount = 0;

	ownIndex = 0;

	constructor(props: ThemedModalProps) {
		super(props);
	}

	componentDidMount() {
		if (!Modal.mountedCount) {
			document.body.classList.add(bodyNoOverflowClass);
		}

		window.document.addEventListener('keydown', this.handleKeyDown);
		Modal.mountedCount++;
		this.ownIndex = Modal.mountedCount;
	}

	componentWillUnmount() {
		Modal.mountedCount--;
		if (!Modal.mountedCount) {
			document.body.classList.remove(bodyNoOverflowClass);
		}

		window.document.removeEventListener('keydown', this.handleKeyDown);
	}

	handleKeyDown = (e: KeyboardEvent) => {
		// Only trigger on top-most modal if there are multiple nested modals.
		if (Modal.mountedCount !== this.ownIndex) {
			return;
		}

		if (!e.defaultPrevented && (e.which === 13 || e.which === 27)) {
			e.preventDefault();
			e.stopPropagation();

			// Enter key
			if (e.which === 13) {
				this.props.done();
			}

			// Escape key
			if (e.which === 27) {
				(this.props.cancel || this.props.done)();
			}
		}
	};

	render() {
		const { w, width, theme, ...props } = this.props;

		const cancelButtonProps = assign(
			{ style: { marginRight: 20 } },
			props.cancelButtonProps,
		);

		const secondaryButtonProps = assign(
			{
				primary: true,
				outline: true,
				style: { marginRight: 20 },
			},
			props.secondaryButtonProps,
		);

		const primaryButtonProps = assign(
			{ primary: true },
			props.primaryButtonProps,
		);

		return (
			<ModalWrapper
				align="center"
				justify="center"
				onClick={() => (props.cancel || props.done)()}
			>
				<ModalBackdrop z={8888} bg="rgba(0,0,0,0.4)" top right bottom left />
				<ModalSizer style={props.containerStyle}>
					<ModalPanel
						p={[px(theme.space[3]), '30px 50px']}
						w={w || width || DEFAULT_MODAL_WIDTH}
						onClick={stopPropagation}
						style={props.style}
					>
						{props.titleElement ? (
							<ModalHeader>{props.titleElement}</ModalHeader>
						) : (
							!!props.title && (
								<ModalHeader>
									<strong>{props.title}</strong>
									{!!props.titleDetails && (
										<ModalTitleDetails>{props.titleDetails}</ModalTitleDetails>
									)}
								</ModalHeader>
							)
						)}
						{props.children}
						<Flex mt={50} align="center" justify="flex-end">
							{props.cancel && (
								<ModalButton {...cancelButtonProps} onClick={props.cancel}>
									{(cancelButtonProps && cancelButtonProps.children) ||
										'Cancel'}
								</ModalButton>
							)}
							{props.secondaryButtonProps && (
								<ModalButton {...secondaryButtonProps} />
							)}
							<ModalButton {...primaryButtonProps} onClick={props.done}>
								{props.action || 'OK'}
							</ModalButton>
						</Flex>
					</ModalPanel>
				</ModalSizer>
			</ModalWrapper>
		);
	}
}

export default withTheme(Modal);
