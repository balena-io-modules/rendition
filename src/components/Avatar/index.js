import React from 'react';
import styled, { keyframes, withTheme } from 'styled-components';
import Identicon from 'identicon.js';
import random from 'lodash/random';

const GenerateIcon = (id, size) => {
  // key can be any unique id
  return new Identicon(id, size).toString();
};

const getImage = (image, id, size) => {
  if (!image) {
    return `data:image/png;base64,${GenerateIcon(id, size)}`;
  }
  return image;
};

const Container = styled.div`
  display: inline-block;
  box-sizing: border-box;
  vertical-align: middle;
  overflow: hidden;
  padding: 0.2rem;
  z-index: 2;
  border: ${props => props.border ? props.theme.colors.lightGray + ' 1px solid;' : ''}
  border-radius: ${props => props.borderRadius}
  width: ${props => props.size}
  height: ${props => props.size}
`;

const Image = styled.img`
  margin: 0;
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  border-radius: ${props => props.borderRadius}
`

const Avatar = ({
  src,
  id = random(9999).toString(),
  size = 100,
  borderRadius = '50%',
  border = true
}) => {
  return (
    <Container
      size={size}
      borderRadius={borderRadius}
      border={border}>
        <Image
        src={getImage(src, id, size)}
        alt={name}
        borderRadius={borderRadius}/>
    </Container>
  );
};

export default withTheme(Avatar);
