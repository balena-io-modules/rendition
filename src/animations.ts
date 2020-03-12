import { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
`;

const fadeOut = keyframes`
	from {
		opacity: 1;
	}

	to {
		opacity: 0;
	}
`;

export const rotate360 = keyframes`
  0% {transform: rotate(0deg)}
  100% {transform: rotate(360deg)}
`;

export const animations = css`
	.fadeIn {
		animation: ${fadeIn};
	}

	.fadeOut {
		animation: ${fadeOut};
	}

	.animated.faster {
		animation-duration: 500ms;
	}
`;
