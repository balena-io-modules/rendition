import * as React from 'react';
import { Drop, DropProps } from 'grommet';
import styled from 'styled-components';
import { px } from '../../utils';
import TooltipArrow, { TooltipArrowProps } from '../../internal/TooltipArrow';

const StyledDrop = styled(Drop)`
	border: 0;
`;

const StyledDropOuter = styled.div`
	max-width: 200px;
	overflow: auto;
	margin: 5px;
	background: white;
	box-shadow: ${(props) => '1px 1px 5px' + props.theme.colors.gray.light};
	border-radius: ${(props) => px(props.theme.radius)};
	border: ${(props) => '1px solid ' + props.theme.colors.gray.main};
`;

const StyledDropInner = styled.div`
	position: relative;
`;

const getDropAlign = (
	placement: TooltipArrowProps['placement'],
): DropProps['align'] => {
	switch (placement) {
		case 'bottom':
			return {
				top: 'bottom',
			};
		case 'top':
			return {
				bottom: 'top',
			};
		case 'left':
			return {
				right: 'left',
			};
		case 'right':
			return {
				left: 'right',
			};
	}
};

export interface PopoverOptions {
	/** Placement of the popover */
	placement?: TooltipArrowProps['placement'];
}

export interface PopoverProps
	extends React.PropsWithChildren<DropProps & PopoverOptions> {
	/** Called when clicked outside a popover on esc key press */
	onDismiss: () => any;
}

const BasePopover = ({
	placement,
	target,
	onDismiss,
	children,
	...rest
}: PopoverProps) => {
	const dropAlign = React.useMemo(() => {
		return getDropAlign(placement);
	}, [placement]);

	return (
		<StyledDrop
			{...rest}
			target={target}
			onClickOutside={onDismiss}
			onEsc={onDismiss}
			align={dropAlign}
			plain
		>
			<TooltipArrow placement={placement} />
			<StyledDropOuter>
				<StyledDropInner>{children}</StyledDropInner>
			</StyledDropOuter>
		</StyledDrop>
	);
};

BasePopover.defaultProps = {
	placement: 'top',
};

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Popover/Popover.stories.tsx) */
export const Popover = BasePopover;
