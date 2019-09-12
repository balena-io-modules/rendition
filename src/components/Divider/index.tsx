import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';
import { Flex } from '../Flex';
import Txt from '../Txt';

const Base = styled.hr<InternalDividerProps>`
	border: ${props =>
		`${px(props.height || 0.5)} ${props.type || 'solid'} ${props.color ||
			props.theme.colors.quartenary.main}}`};
	width: 100%;
	height: 0;
`;

const FlexBase = styled(Base)`
	flex: 1 1 0;
	margin: auto;
`;

export interface InternalDividerProps extends DefaultProps {
	height?: number;
	color?: string;
	children?: string;
	type?: 'solid' | 'dashed';
}

const Divider = React.forwardRef(
	({ children, className, ...otherProps }: InternalDividerProps, ref) => {
		if (!children) {
			return <Base className={className} {...otherProps} ref={ref as any} />;
		}

		if (typeof children !== 'string') {
			throw new Error(
				`The child element of the Divider component must be a string, received: ${typeof children}`,
			);
		}

		return (
			<Flex
				className={className}
				width="100%"
				flexDirection="row"
				justifyContent="center"
				ref={ref as any}
			>
				<FlexBase {...otherProps} />
				<Txt.span color="tertiary.main" px={3}>
					{children}
				</Txt.span>
				<FlexBase {...otherProps} />
			</Flex>
		);
	},
);

export type DividerProps = InternalDividerProps & RenditionSystemProps;

export default asRendition<
	React.ForwardRefExoticComponent<
		DividerProps & React.RefAttributes<HTMLHRElement>
	>
>(Divider, [], ['color']);
