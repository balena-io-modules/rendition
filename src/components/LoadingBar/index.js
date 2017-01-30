import React from 'react';
import styled, { keyframes } from 'styled-components';

const animation = () => {
  return keyframes`
  from { left: 50%; width: 0; z-index:100; }
  33.3333% { left: 0; width: 100%; z-index: 10; }
  to { left: 0; width: 100%; }
  `;
};

const Bar = styled.div`
  content: "";
  display: inline;
  position: absolute;
  width: 0;
  height: 100%;
  left: 50%;
  text-align: center;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.height + 'px'};
`;

const isValidColor = (color) => {
  return (color.charAt(0) === '#');
};

const renderBars = (colors) => {
  return colors.map((color, i) => {
    const AltBar = styled(Bar)`
      animation: ${animation} 2s linear ${i / 2}s infinite;
      background-color: ${props => isValidColor(color) ? color : props.theme.colors[color]};
    `;
    return (
      <AltBar key={i} />
    );
  });
};

const LoadingBar = ({ colors, theme, height }) => {
  return (
    <Wrapper height={height}>
      {renderBars(colors)}
    </Wrapper>
  );
};

Object.assign(LoadingBar, {
  displayName: 'LoadingBar',
  propTypes: {
    colors: React.PropTypes.array,
    height: React.PropTypes.number,
  },
  defaultProps: {
    height: 5,
    colors: ['primary', 'secondary', 'gray'],
  },
});

export default LoadingBar;
