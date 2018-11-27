import * as React from 'react';
import IconCaretDown = require('react-icons/lib/fa/caret-down');
import IconCaretUp = require('react-icons/lib/fa/caret-up');
import { compose } from 'recompose';
import { DropDownButtonProps } from 'rendition';
import styled, { StyledFunction, withTheme } from 'styled-components';
import { color, fontSize, space, width } from 'styled-system';
import theme from '../theme';
import { px } from '../utils';
import Button from './Button';
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

const MenuBase = (styled.div as StyledFunction<
	DropDownButtonProps & { minWidth: string }
>)`
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

MenuBase.defaultProps = { theme };

const Wrapper = styled.div`
  ${space} ${width} ${fontSize} ${color} display: inline-block;
  border-radius: ${props => px(props.theme.radius)};
  vertical-align: top;
  position: relative;
`;

const Item = (styled.div as StyledFunction<DropDownButtonProps>)`
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  border-top: ${props =>
		props.border ? `1px solid ${props.theme.colors.gray.main}` : '0'};
  border-radius: ${props => px(props.theme.radius)};

  &:hover {
    background: ${props => props.theme.colors.gray.light};
  }
`;

Item.defaultProps = { theme };

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
}: DropDownButtonProps & {
	open: boolean;
	handler: React.MouseEventHandler<HTMLElement>;
}) => {
	if (joined) {
		if (label) {
			return (
				<JoinedButton {...props} pl={16} pr={0} onClick={handler}>
					<Flex justify="space-between" align="center">
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
	DropDownButtonProps,
	DropDownButtonState
> {
	constructor(props: DropDownButtonProps) {
		super(props);
		this.state = {
			open: false,
			minWidth: 0,
		};
	}

	toggle = () => {
		this.setState({
			open: !this.state.open,
			minWidth: (this as any).base && (this as any).base.offsetWidth,
		});
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
			tooltip,
			...props
		} = this.props;

		return (
			<Wrapper {...props}>
				{joined ? (
					<Toggle
						{...props}
						tooltip={tooltip}
						outline={outline}
						joined={joined}
						label={label}
						handler={this.toggle}
						open={this.state.open}
					/>
				) : (
					<span>
						<ButtonBase {...props} tooltip={tooltip} outline={outline}>
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

export default compose(withTheme)(DropDownButton) as React.ComponentClass<
	DropDownButtonProps
>;
