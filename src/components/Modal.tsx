import assign = require('lodash/assign');
import * as React from 'react';
import { ModalProps } from 'rendition';
import styled, { injectGlobal } from 'styled-components';
import { stopPropagation } from '../utils';
import Button from './Button';
import Fixed from './Fixed';
import { Box, Flex } from './Grid';
import Txt from './Txt';

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
	font-size: 24px;
`;

const ModalTitleDetails = styled(Txt)`
	color: ${props => props.theme.colors.text.light};
	font-size: 16px;
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
	padding: 30px 50px;
	margin: 15px auto;
	border: solid 0.5px #9b9b9b;
	border-radius: 2px;
	background-color: #ffffff;
	box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.4);
`;

class Modal extends React.Component<ModalProps, any> {
	static mountedCount = 0;

	constructor(props: ModalProps) {
		super(props);
	}

	componentDidMount() {
		if (!Modal.mountedCount) {
			document.body.classList.add(bodyNoOverflowClass);
		}
		Modal.mountedCount++;
	}

	componentWillUnmount() {
		Modal.mountedCount--;
		if (!Modal.mountedCount) {
			document.body.classList.remove(bodyNoOverflowClass);
		}
	}

	render() {
		const { w, width, ...props } = this.props;

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
								<Button {...cancelButtonProps} onClick={props.cancel}>
									{(cancelButtonProps && cancelButtonProps.children) ||
										'Cancel'}
								</Button>
							)}
							{props.secondaryButtonProps && (
								<Button {...secondaryButtonProps} />
							)}
							<Button {...primaryButtonProps} onClick={props.done}>
								{props.action || 'OK'}
							</Button>
						</Flex>
					</ModalPanel>
				</ModalSizer>
			</ModalWrapper>
		);
	}
}

export default Modal;
