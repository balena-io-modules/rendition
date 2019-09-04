import styled from 'styled-components';
import { space, SpaceProps, width, WidthProps } from 'styled-system';
import { DefaultProps } from '../../common-types';

interface ImgProps extends DefaultProps, SpaceProps, WidthProps {}

const Img = styled.img<ImgProps>`
	display: block;
	max-width: 100%;
	height: auto;
	${space};
	${width};
`;

Img.displayName = 'Img';

export default Img;
