import styled from 'styled-components';
import { Flex, FlexProps } from '../Flex';

export type ButtonGroupProps = FlexProps;

/**
 * Wrapper for buttons to make them stick together.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/ButtonGroup/ButtonGroup.stories.tsx)
 */
export const ButtonGroup = styled(Flex)`
	> * {
		&:first-child {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		&:last-child {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

		&:not(:last-child) {
			border-right: 0;
		}

		&:not(:last-child):not(:first-child) {
			border-radius: 0;
		}

		&:hover {
			z-index: 1;
		}
	}
`;
