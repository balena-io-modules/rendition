import { Layer } from 'grommet';
import merge from 'lodash/merge';
import * as React from 'react';
import styled, { createGlobalStyle, withTheme } from 'styled-components';
import { ResponsiveStyle, Theme } from '../../common-types';
import { px } from '../../utils';
import { Box } from '../Box';
import { Button, ButtonProps } from '../Button';
import { Flex } from '../Flex';
import { Heading } from '../Heading';
import { Txt } from '../Txt';

const bodyNoOverflowClass = `rendition-modal-open`;

// tslint:disable-next-line no-unused-expression
const GlobalStyle = createGlobalStyle`
	.${bodyNoOverflowClass} {
		overflow: hidden;
	}
`;

const DEFAULT_MODAL_WIDTH = 700;

const ModalSizer = styled(Box)`
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

class BaseModal extends React.Component<ThemedModalProps, any> {
	public static mountedCount = 0;

	public ownIndex = 0;

	constructor(props: ThemedModalProps) {
		super(props);
	}

	public componentDidMount() {
		if (!BaseModal.mountedCount) {
			document.body.classList.add(bodyNoOverflowClass);
		}

		window.addEventListener('keydown', this.handleKeyDown);
		BaseModal.mountedCount++;
		this.ownIndex = BaseModal.mountedCount;
	}

	public componentWillUnmount() {
		BaseModal.mountedCount--;
		if (!BaseModal.mountedCount) {
			document.body.classList.remove(bodyNoOverflowClass);
		}

		window.removeEventListener('keydown', this.handleKeyDown);
	}

	public handleKeyDown = (e: KeyboardEvent) => {
		// Only trigger on top-most modal if there are multiple nested modals.
		if (BaseModal.mountedCount !== this.ownIndex) {
			return;
		}

		if (!e.defaultPrevented && e.which === 13) {
			e.preventDefault();
			e.stopPropagation();

			if (this.props.primaryButtonProps?.disabled) {
				return;
			}

			// Enter key
			if (e.which === 13) {
				this.props.done();
			}
		}
	};

	public stopPropagation = (e: Event | React.MouseEvent<any>) =>
		e.stopPropagation();

	public popModal = () => {
		if (BaseModal.mountedCount !== this.ownIndex) {
			return;
		}

		(this.props.cancel || this.props.done)();
	};

	public render() {
		const { width, theme, ...props } = this.props;

		const cancelButtonProps = Object.assign({ ml: 3 }, props.cancelButtonProps);

		const secondaryButtonProps = Object.assign(
			{
				primary: true,
				outline: true,
				ml: 3,
			},
			props.secondaryButtonProps,
		);

		const shouldChangePrimaryButtonOrder =
			(props.primaryButtonProps?.danger ??
				props.primaryButtonProps?.warning) === true;

		const primaryButtonProps = merge(
			{
				primary: true,
				ml: 3,
				...(shouldChangePrimaryButtonOrder && {
					style: { order: -1 },
				}),
			},
			props.primaryButtonProps,
		);

		return (
			<Layer
				onEsc={this.popModal}
				onClickOutside={this.popModal}
				responsive={false}
				position={props.position || 'center'}
				margin="small"
				animate={false}
				style={{
					marginTop: props.position === 'top' ? theme.header.height : undefined,
				}}
			>
				<GlobalStyle />
				<ModalSizer
					width={width || DEFAULT_MODAL_WIDTH}
					maxWidth="100%"
					onClick={this.stopPropagation}
					style={props.style}
					id={props.id}
					className={props.className}
				>
					<Box p={[px(theme.space[3]), '40px 50px 30px']}>
						{props.titleElement ? (
							<Heading.h3 mb={4}>{props.titleElement}</Heading.h3>
						) : (
							!!props.title && (
								<Heading.h3 mb={4}>
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
						<Flex mt={5} alignItems="center" justifyContent="flex-end">
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
					</Box>
				</ModalSizer>
			</Layer>
		);
	}
}

export interface ModalProps extends React.HTMLAttributes<HTMLElement> {
	/** A title to display at the top of the Modal, only displayed if the `titleElement` property is not used */
	title?: string;
	width?: ResponsiveStyle;
	/** Start the modal from the center (default) or top */
	position?: 'center' | 'top';
	/** A string or JSX element to display at the top of the modal */
	titleElement?: string | JSX.Element;
	/** A string or JSX element to display underneath the modal's `title`, only displayed if the `titleElement` property is not used and a `title` property is provided */
	titleDetails?: string | JSX.Element;
	/** A string or JSX element to display in the primary modal button, defaults to 'OK' */
	action?: string | JSX.Element;
	/** A function that is called if the modal is dismissed */
	cancel?: () => any;
	/** A function that is called if the primary modal button is clicked */
	done: () => any;
	/** Properties that are passed to the primary button, these are the same props used for the [`Button`](#button) component */
	primaryButtonProps?: ButtonProps;
	/** If provided, will cause a secondary button to appear on the modal. These properties that are passed to that button, these are the same props used for the [`Button`](#button) component */
	secondaryButtonProps?: ButtonProps;
	/** Properties that are passed to the cancel button, these are the same props used for the [`Button`](#button) component */
	cancelButtonProps?: ButtonProps;
}

export interface ThemedModalProps extends ModalProps {
	theme: Theme;
}

/**
 * Displays a centrally position modal overlay. Children passed to this component are rendered inside the modal.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Modal/Modal.stories.tsx)
 */
export const Modal = withTheme(
	BaseModal,
) as React.FunctionComponent<ModalProps>;
