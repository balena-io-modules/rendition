import styled from 'styled-components';
import { Flex } from './Grid';

export default styled(Flex)`
	> * {
		margin-right: -1px;

		&:first-child {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		&:last-child {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

		&:not(:last-child):not(:first-child) {
			border-radius: 0;
		}

		&:hover {
			z-index: 1;
		}
	}
`;
