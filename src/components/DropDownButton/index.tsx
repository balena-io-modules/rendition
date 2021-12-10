import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { px, stopEvent } from '../../utils';
import { Box } from '../Box';
import { Button, ButtonProps } from '../Button';
import { Divider } from '../Divider';
import { Fixed } from '../Fixed';
import { Flex } from '../Flex';

const TOGGLE_BUTTON_X_PADDING = 16;
const CHEVRON_ICON_WIDTH = 12;
const TOGGLE_BUTTON_WIDTH = 2 * TOGGLE_BUTTON_X_PADDING + CHEVRON_ICON_WIDTH;

const ToggleBase = styled(Button)`
	min-width: 0;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	border-left: 0;
	margin: 0;
	vertical-align: top;
	padding: 0 ${px(TOGGLE_BUTTON_X_PADDING)};
	width: ${px(TOGGLE_BUTTON_WIDTH)};
`;

const ButtonBase = styled(Button)`
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border-right: 0;
	margin: 0;
	width: calc(100% - ${px(TOGGLE_BUTTON_WIDTH)});
`;

const MenuBase = styled(Box)<{
	alignRight?: boolean;
	dropUp?: boolean;
}>`
	background: white;
	position: absolute;
	border-radius: ${(props) => px(props.theme.radius)};
	border: ${(props) => '1px solid ' + props.theme.colors.gray.main};
	z-index: 1;
	margin-top: ${(props) => (props.dropUp ? 0 : '2px')};
	margin-bottom: ${(props) => (props.dropUp ? '2px' : 0)};
	bottom: ${(props) => (props.dropUp ? props.theme.button.height : 'auto')};
	left: ${(props) => (props.alignRight ? 'auto' : 0)};
	right: ${(props) => (!props.alignRight ? 'auto' : 0)};
	width: 200px;
	overflow-y: auto;
	overflow-x: hidden;
`;

const Wrapper = styled(Box)`
	display: inline-block;
	border-radius: ${(props) => px(props.theme.radius)};
	vertical-align: top;
	position: relative;

	svg {
		width: ${px(CHEVRON_ICON_WIDTH)};
		transform: translateY(1px);
	}
`;

const getHoverStyle = (props: any) => `
	${
		props.hasActionFn &&
		`&:hover {
	background: #dde1f0; // This is the background color Select uses for entities on hover. We do not have it in our theme
	cursor: ${props.disabled ? 'not-allowed' : 'pointer'};}`
	}`;

const getDangerStyle = (props: any) => `
	${props.danger && `color: ${props.theme.colors.danger.main};`}
	`;

const getDisabledStyle = (props: any) => `
	${props.disabled && `opacity: 1; color: ${props.theme.colors.gray.main};`}
	`;

const Item = styled(Box)<{
	disabled?: boolean;
	danger?: boolean;
	hasActionFn: boolean;
}>`
	${getHoverStyle}
	${getDangerStyle}
	${getDisabledStyle}
`;

const JoinedButton = styled(Button)`
	margin: 0;
	width: 100%;
`;

const Toggle = ({
	open,
	handler,
	label,
	joined,
	compact,
	items,
	...props
}: InternalDropDownButtonProps & {
	open: boolean;
	handler: React.MouseEventHandler<HTMLElement>;
}) => {
	const toggleProps = {
		...props,
		// Avoid submitting parent forms when
		// clicking on the toggle.
		type: 'button',
		onClick: handler,
	};
	const icon = open ? faChevronUp : faChevronDown;
	const shouldCompact = useBreakpoint(compact || [false]);
	if (joined) {
		if (label || props.icon) {
			return (
				<JoinedButton {...toggleProps}>
					<Flex justifyContent="space-between" alignItems="center">
						{!shouldCompact && <Box mr={2}>{label}</Box>}
						<FontAwesomeIcon icon={icon} />
					</Flex>
				</JoinedButton>
			);
		}
		return (
			<JoinedButton {...toggleProps} icon={<FontAwesomeIcon icon={icon} />} />
		);
	}
	return <ToggleBase {...toggleProps} icon={<FontAwesomeIcon icon={icon} />} />;
};

interface DropDownButtonState {
	open: boolean;
}

export interface DropdownOption {
	content: string | JSX.Element;
	onClick?: React.MouseEventHandler<HTMLElement>;
	tooltip?: string;
	disabled?: boolean;
	danger?: boolean;
}

class BaseDropDownButton extends React.Component<
	InternalDropDownButtonProps,
	DropDownButtonState
> {
	public dropdownNode: HTMLDivElement | null;

	constructor(props: InternalDropDownButtonProps) {
		super(props);
		this.state = {
			open: false,
		};
	}

	public componentWillUnmount() {
		if (this.state.open) {
			this.removeListener();
		}
	}

	public handleOutsideClick = (e: MouseEvent) => {
		if (this.dropdownNode && !this.dropdownNode.contains(e.target as Node)) {
			if (this.state.open) {
				this.removeListener();
				this.setState({
					open: false,
				});
			}
		}
	};

	public toggle = () => {
		const isNextOpen = !this.state.open;
		if (isNextOpen) {
			window.document.addEventListener('click', this.handleOutsideClick);
		} else {
			this.removeListener();
		}

		this.setState({
			open: isNextOpen,
		});
	};

	public removeListener = () => {
		window.document.removeEventListener('click', this.handleOutsideClick);
	};

	public render() {
		const {
			dropUp,
			alignRight,
			children,
			label,
			border,
			joined,
			noListFormat,
			outline,
			className,
			onClick,
			items,
			...props
		} = this.props;
		return (
			<Wrapper
				className={className}
				onClick={joined ? onClick : undefined}
				{...props}
				ref={(node: any) => (this.dropdownNode = node)}
			>
				{joined ? (
					<Toggle
						{...props}
						onClick={onClick}
						outline={outline}
						joined={joined}
						label={label}
						handler={this.toggle}
						open={this.state.open}
						items={items}
					/>
				) : (
					<span>
						<ButtonBase {...props} onClick={onClick} outline={outline}>
							{label}
						</ButtonBase>
						<Toggle
							{...props}
							outline={outline}
							onMouseEnter={stopEvent}
							handler={this.toggle}
							open={this.state.open}
							items={items}
							// TODO: when children handling is removed, add tooltip and disabled for if items is empty
						/>
					</span>
				)}
				{this.state.open && <Fixed onClick={this.toggle} />}
				{this.state.open && (
					<MenuBase
						dropUp={dropUp}
						alignRight={alignRight}
						onClick={() => (!items ? this.toggle() : undefined)}
						maxHeight={px(this.props.listMaxHeight ?? 300)}
					>
						{items
							? items.map((itemGroup, i) => (
									<Box key={i}>
										{itemGroup.map(
											(item, j) =>
												item && (
													<Item
														px={3}
														py={1}
														onClick={(event) => {
															if (!item.disabled && item.onClick) {
																item.onClick(event);
																this.toggle();
															}
														}}
														tooltip={item.tooltip}
														disabled={item.disabled}
														danger={item.danger}
														hasActionFn={!!item.onClick}
														key={j}
													>
														{item.content}
													</Item>
												),
										)}
										{i < items.length - 1 && <Divider />}
									</Box>
							  ))
							: React.Children.map(children, (child, i) => {
									if (noListFormat) {
										return child;
									}
									if (!child) {
										return;
									}
									if ((child as any).type === Divider) {
										return child;
									}
									return (
										<Item px={3} py={1} hasActionFn={false} key={i}>
											{child}
										</Item>
									);
							  })}
					</MenuBase>
				)}
			</Wrapper>
		);
	}
}

export interface InternalDropDownButtonProps extends ButtonProps {
	/** A 2D array. Each child array contains a group of items. Each child array is separated by Dividers */
	items?: Array<Array<DropdownOption | undefined>>;
	/** Optionally provide a JSX element that will be displayed inside the main button */
	label?: string | JSX.Element;
	/** If true, place a border between each item in the dropdown */
	border?: boolean;
	/** If true, render the component as a single button instead of two */
	joined?: boolean;
	/** If true, put the dropdown list on the right */
	alignRight?: boolean;
	/** If true, the dropdown list will open up, rather than down */
	dropUp?: boolean;
	/** If true, render children as a single JSX element instead of iterating over each of them */
	noListFormat?: boolean;
	/** If set, it defines the maximum height of the dropdown list */
	listMaxHeight?: string | number;
}

export type DropDownButtonProps = InternalDropDownButtonProps &
	RenditionSystemProps;

/**
 * Displays a button with an attached dropdown list, `children` of the component are rendered inside a dropdown list.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/DropDownButton/DropDownButton.stories.tsx)
 */
export const DropDownButton = asRendition<
	React.ForwardRefExoticComponent<
		DropDownButtonProps & React.RefAttributes<BaseDropDownButton>
	>
>(BaseDropDownButton, [], ['color', 'bg', 'backgroundColor']);
