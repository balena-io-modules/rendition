import styled from 'styled-components';
import { space, width } from 'styled-system';

const Img = styled.img`
	display: block;
	max-width: 100%;
	height: auto;
	${space} ${width};
`;

Img.displayName = 'Img';

export default Img;
