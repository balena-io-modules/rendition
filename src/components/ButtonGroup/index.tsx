import styled from 'styled-components';
import { Flex } from '../Flex';

export default styled(Flex)`
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
