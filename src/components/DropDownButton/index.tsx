import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';
import { Box } from '../Box';
import Button, { ButtonProps } from '../Button';
import Divider from '../Divider';
import Fixed from '../Fixed';
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

const MenuBase = styled.div<{
	minWidth: string;
	alignRight?: boolean;
	maxHeight: string | number;
}>`
	background: white;
	position: absolute;
	min-width: ${props => props.minWidth};
	box-shadow: ${props => '1px 1px 5px' + props.theme.colors.gray.light};
	border-radius: ${props => px(props.theme.radius)};
	border: ${props => '1px solid ' + props.theme.colors.gray.main};
	z-index: 1;
	margin-top: 2px;
	left: ${props => (props.alignRight ? 'auto' : 0)};
	right: ${props => (!props.alignRight ? 'auto' : 0)};
	white-space: nowrap;
	max-height: ${props => props.maxHeight || 'auto'};
	overflow-y: auto;
`;

const Wrapper = styled(Box)`
	display: inline-block;
	border-radius: ${props => px(props.theme.radius)};
	vertical-align: top;
	position: relative;

	svg {
		width: ${px(CHEVRON_ICON_WIDTH)};
		height: translateY(1px);
	}
`;

const Item = styled.div<{ border: boolean }>`
	padding: 4px 16px;
	border-top: ${props =>
		props.border ? `1px solid ${props.theme.colors.gray.main}` : '0'};
	border-radius: ${props => px(props.theme.radius)};

	&:hover:enabled {
		background: ${props => props.theme.colors.gray.light};
	}
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
	...props
}: InternalDropDownButtonProps & {
	open: boolean;
	handler: React.MouseEventHandler<HTMLElement>;
}) => {
	if (joined) {
		if (label) {
			return (
				<JoinedButton {...props} onClick={handler}>
					<Flex justifyContent="space-between" alignItems="center">
						<Box mr={2}>{label}</Box>
						{open ? (
							<FontAwesomeIcon icon={faChevronUp} />
						) : (
							<FontAwesomeIcon icon={faChevronDown} />
						)}
					</Flex>
				</JoinedButton>
			);
		}
		return (
			<JoinedButton
				{...props}
				icon={
					open ? (
						<FontAwesomeIcon icon={faChevronUp} />
					) : (
						<FontAwesomeIcon icon={faChevronDown} />
					)
				}
				onClick={handler}
			/>
		);
	}
	return (
		<ToggleBase
			{...props}
			icon={
				open ? (
					<FontAwesomeIcon icon={faChevronUp} />
				) : (
					<FontAwesomeIcon icon={faChevronDown} />
				)
			}
			onClick={handler}
		/>
	);
};

interface DropDownButtonState {
	open: boolean;
	minWidth: number;
}

class DropDownButton extends React.Component<
	InternalDropDownButtonProps,
	DropDownButtonState
> {
	dropdownNode: HTMLDivElement | null;

	constructor(props: InternalDropDownButtonProps) {
		super(props);
		this.state = {
			open: false,
			minWidth: 0,
		};
	}

	componentWillUnmount() {
		if (this.state.open) {
			this.removeListener();
		}
	}

	handleOutsideClick = (e: MouseEvent) => {
		if (this.dropdownNode && !this.dropdownNode.contains(e.target as Node)) {
			if (this.state.open) {
				this.removeListener();
				this.setState({
					open: false,
				});
			}
		}
	};

	toggle = () => {
		const isNextOpen = !this.state.open;
		if (isNextOpen) {
			window.document.addEventListener('click', this.handleOutsideClick);
		} else {
			this.removeListener();
		}

		this.setState({
			open: isNextOpen,
			minWidth: (this as any).base && (this as any).base.offsetWidth,
		});
	};

	removeListener = () => {
		window.document.removeEventListener('click', this.handleOutsideClick);
	};

	render() {
		const {
			alignRight,
			children,
			label,
			border,
			joined,
			noListFormat,
			outline,
			className,
			...props
		} = this.props;

		return (
			<Wrapper
				className={className}
				{...props}
				ref={node => (this.dropdownNode = node)}
			>
				{joined ? (
					<Toggle
						{...props}
						outline={outline}
						joined={joined}
						label={label}
						handler={this.toggle}
						open={this.state.open}
					/>
				) : (
					<span>
						<ButtonBase {...props} outline={outline}>
							{label}
						</ButtonBase>
						<Toggle
							{...props}
							outline={outline}
							handler={this.toggle}
							open={this.state.open}
						/>
					</span>
				)}
				{this.state.open && <Fixed onClick={this.toggle} />}
				{this.state.open && (
					<MenuBase
						alignRight={alignRight}
						onClick={this.toggle}
						minWidth={`${this.state.minWidth}px`}
						maxHeight={px(this.props.maxHeight)}
					>
						{React.Children.map(children, (child, i) => {
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
								<Item border={Boolean(border && i)} key={i}>
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
	label?: string | JSX.Element;
	border?: boolean;
	joined?: boolean;
	alignRight?: boolean;
	noListFormat?: boolean;
	maxHeight?: string | number;
}

export type DropDownButtonProps = InternalDropDownButtonProps &
	RenditionSystemProps;

export default asRendition<
	React.ForwardRefExoticComponent<
		DropDownButtonProps & React.RefAttributes<DropDownButton>
	>
>(DropDownButton, [], ['color', 'bg', 'backgroundColor']);
