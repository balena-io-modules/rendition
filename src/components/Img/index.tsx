import * as React from 'react';
import styled from 'styled-components';
import { space, width } from 'styled-system';

const StyledImg = styled.img<ImgProps>`
	display: block;
	max-width: 100%;
	height: auto;
	${space};
	${width};
`;

export const BaseImg = ({ fallback, src, ...props }: ImgProps) => {
	const [normalizedSrc, setNormalizedSrc] = React.useState<string | undefined>(
		src,
	);

	React.useEffect(() => {
		setNormalizedSrc(src);
	}, [src]);

	// if the image fails to load show the next fallback image
	const onError = React.useCallback(() => {
		setNormalizedSrc(fallback);
	}, []);

	return <StyledImg onError={onError} src={normalizedSrc} {...props} />;
};

BaseImg.displayName = 'Img';

export interface ImgProps extends React.HTMLAttributes<HTMLImageElement> {
	fallback?: string;
	src?: string;
}

/**
 * Displays an image and gracefully handles errors.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Img/Img.stories.tsx)
 */
export const Img = BaseImg;
