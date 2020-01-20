import assign from 'lodash/assign';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { Flex, FlexProps } from '../Flex';

const setDefaultProps = withProps((props: BannerProps) => {
	// set defaults
	// always allow override with provided props
	return assign(
		{
			p: [3, 4],
			minHeight: `80vh`,
			flexDirection: `column`,
			alignItems: `center`,
			justifyContent: `center`,
		},
		props,
	);
});

const setBgImage = (bgImage?: string) => (bgImage ? `url(${bgImage})` : 'none');

const Base = styled(Flex)`
	background-size: cover;
	background-position: center;
	background-image: ${(props: any) => setBgImage(props.backgroundImage)};
`;

export interface BannerProps extends FlexProps {
	backgroundImage?: string;
}

export default asRendition<
	React.ForwardRefExoticComponent<
		BannerProps & React.RefAttributes<HTMLDivElement>
	>
>(Base, [setDefaultProps]);
