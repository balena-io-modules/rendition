import React from 'react';
import styled from 'styled-components';
import Identicon from 'identicon.js';
import random from 'lodash/random';
import chroma from 'chroma-js';

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
  border: ${props => props.border && chroma(props.theme.colors.gray).brighten(4) + ' 1px solid;'}
  border-radius: ${props => props.borderRadius}
  width: ${props => props.size + 'px'}
  height: ${props => props.size + 'px'}
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
  border = true,
}) => {
  return (
    <Container
      size={size}
      borderRadius={borderRadius}
      border={border}
    >
      <Image
        src={getImage(src, id, size)}
        borderRadius={borderRadius}
      />
    </Container>
  );
};

Object.assign(Avatar, {
  displayName: 'Avatar',
  propTypes: {
    src: React.PropTypes.string,
    id: React.PropTypes.string,
    borderRadius: React.PropTypes.number,
    border: React.PropTypes.bool,
  },
});

export default Avatar;
