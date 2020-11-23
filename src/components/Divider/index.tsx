import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';
import { Flex } from '../Flex';
import { Txt } from '../Txt';

const Base = styled.hr<InternalDividerProps>`
	border: 0 none;
	border-top: ${(props) =>
		/*
		TODO: The 2 * height here is for backwards compatibility reasons.
		The reason was to fix sub-pixed border rendering in FF.
		Consider dropping it in one of the next major releases.
		*/
		`${px(2 * (props.height || 0.5))} ${props.type || 'solid'} ${
			props.color || props.theme.colors.quartenary.main
		}}`};
	width: 100%;
	height: 0;
`;

const FlexBase = styled(Base)`
	flex: 1 1 0;
	margin: auto;
`;

export interface InternalDividerProps
	extends React.HTMLAttributes<HTMLElement> {
	/** The height of the divider */
	height?: number;
	/** The color of the divider */
	color?: string;
	/** Textual explanation to go in the middle of the divider */
	children?: string;
	/** The type of the divider */
	type?: 'solid' | 'dashed';
}

const BaseDivider = React.forwardRef(
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

/**
 * A styled horizontal rule.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Divider/Divider.stories.tsx)
 */
export const Divider = asRendition<
	React.ForwardRefExoticComponent<
		DividerProps & React.RefAttributes<HTMLHRElement>
	>
>(BaseDivider, [], ['color', 'height']);
