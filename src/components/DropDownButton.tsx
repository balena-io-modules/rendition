import * as React from 'react';
import IconCaretDown = require('react-icons/lib/fa/caret-down');
import IconCaretUp = require('react-icons/lib/fa/caret-up');
import styled from 'styled-components';
import asRendition from '../asRendition';
import { RenditionSystemProps } from '../common-types';
import { px } from '../utils';
import Button, { ButtonProps } from './Button';
import Divider from './Divider';
import Fixed from './Fixed';
import { Box, Flex } from './Grid';

const ToggleBase = styled(Button)`
	min-width: 0;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	margin-left: -1px;
	border-left: 0;
	margin: 0;
	vertical-align: top;
`;

const ButtonBase = styled(Button)`
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border-right: 0;
	margin: 0;
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
`;

const Item = styled.div<{ border: boolean }>`
	padding-top: 5px;
	padding-bottom: 5px;
	padding-left: 16px;
	padding-right: 16px;
	border-top: ${props =>
		props.border ? `1px solid ${props.theme.colors.gray.main}` : '0'};
	border-radius: ${props => px(props.theme.radius)};

	&:hover:enabled {
		background: ${props => props.theme.colors.gray.light};
	}
`;

const IconWrapper = styled.span`
	width: 28px;
`;

const JoinedButton = styled(Button)`
	margin: 0;
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
				<JoinedButton {...props} pl={16} pr={0} onClick={handler}>
					<Flex justifyContent="space-between" alignItems="center">
						<Box mt="1px">{label}</Box>
						<IconWrapper>
							{open ? <IconCaretUp /> : <IconCaretDown />}
						</IconWrapper>
					</Flex>
				</JoinedButton>
			);
		}
		return (
			<JoinedButton {...props} square onClick={handler}>
				{open ? <IconCaretUp /> : <IconCaretDown />}
			</JoinedButton>
		);
	}
	return (
		<ToggleBase {...props} onClick={handler}>
			{open ? <IconCaretUp /> : <IconCaretDown />}
		</ToggleBase>
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
	label?: JSX.Element;
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
>(DropDownButton, [], ['width', 'color', 'bg', 'backgroundColor']);
