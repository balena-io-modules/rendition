import { Layer } from 'grommet';
import assign from 'lodash/assign';
import * as React from 'react';
import styled, { createGlobalStyle, withTheme } from 'styled-components';
import { DefaultProps, ResponsiveStyle, Theme } from '../common-types';
import { stopPropagation } from '../utils';
import { px } from '../utils';
import Button, { ButtonProps } from './Button';
import { Box, Flex } from './Grid';
import Heading from './Heading';
import Txt from './Txt';

const bodyNoOverflowClass = `rendition-modal-open`;

// tslint:disable-next-line no-unused-expression
const GlobalStyle = createGlobalStyle`
	.${bodyNoOverflowClass} {
		overflow: hidden;
	}
`;

const DEFAULT_MODAL_WIDTH = 700;

const ModalSizer = styled(Box)`
	max-width: 100%;
	overflow-y: auto;
`;

const HeadingDescription = styled(Txt)`
	font-weight: normal;
`;

const ModalButton = (props: ButtonProps) => {
	return 'href' in props && props.href ? (
		<Button as="a" {...props} />
	) : (
		<Button {...props} />
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
		const { width, theme, ...props } = this.props;

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
			<Layer
				onEsc={() => (props.cancel || props.done)()}
				onClickOutside={() => (props.cancel || props.done)()}
				responsive={false}
				margin="small"
				animate={false}
			>
				<GlobalStyle />
				<ModalSizer
					p={[px(theme.space[3]), '40px 50px 30px']}
					width={width || DEFAULT_MODAL_WIDTH}
					onClick={stopPropagation}
					style={props.style}
					id={props.id}
					className={props.className}
				>
					{props.titleElement ? (
						<Heading.h3 mb={50}>{props.titleElement}</Heading.h3>
					) : (
						!!props.title && (
							<Heading.h3 mb={50}>
								{props.title}
								{!!props.titleDetails && (
									<HeadingDescription color="text.light" fontSize={2}>
										{props.titleDetails}
									</HeadingDescription>
								)}
							</Heading.h3>
						)
					)}
					{props.children}
					<Flex mt={50} alignItems="center" justifyContent="flex-end">
						{props.cancel && (
							<ModalButton {...cancelButtonProps} onClick={props.cancel}>
								{(cancelButtonProps && cancelButtonProps.children) || 'Cancel'}
							</ModalButton>
						)}
						{props.secondaryButtonProps && (
							<ModalButton {...secondaryButtonProps} />
						)}
						<ModalButton {...primaryButtonProps} onClick={props.done}>
							{props.action || 'OK'}
						</ModalButton>
					</Flex>
				</ModalSizer>
			</Layer>
		);
	}
}

export interface ModalProps extends DefaultProps {
	title?: string;
	width?: ResponsiveStyle;
	titleElement?: string | JSX.Element;
	titleDetails?: string | JSX.Element;
	action?: string | JSX.Element;
	cancel?: () => any;
	done: () => any;
	primaryButtonProps?: ButtonProps;
	secondaryButtonProps?: ButtonProps;
	cancelButtonProps?: ButtonProps;
}

export interface ThemedModalProps extends ModalProps {
	theme: Theme;
}

export default withTheme(Modal);
