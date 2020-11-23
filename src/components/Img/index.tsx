import styled from 'styled-components';
import { space, SpaceProps, width, WidthProps } from 'styled-system';

export interface ImgProps
	extends React.HTMLAttributes<HTMLImageElement>,
		SpaceProps,
		WidthProps {}

const BaseImg = styled.img<ImgProps>`
	display: block;
	max-width: 100%;
	height: auto;
	${space};
	${width};
`;

BaseImg.displayName = 'Img';

/**
 * Displays an image.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Img/Img.stories.tsx)
 */
export const Img = BaseImg;
