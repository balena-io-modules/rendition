import assign = require('lodash/assign');
import { compose, withProps } from 'recompose';
import { BannerProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';

const setDefaultProps = withProps((props: BannerProps) => {
	// set defaults
	// always allow override with provided props
	return assign(
		{
			p: [3, 4],
			minHeight: `80vh`,
		},
		props,
	);
});

const setBgImage = (bgImage?: string) => (bgImage ? `url(${bgImage})` : 'none');

const Base = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: ${(props: any) => props.minHeight};
	background-size: cover;
	background-position: center;
	background-image: ${(props: any) => setBgImage(props.backgroundImage)};
`;

export default compose(withTheme, setDefaultProps, asRendition)(
	Base,
) as React.ComponentClass<BannerProps>;
