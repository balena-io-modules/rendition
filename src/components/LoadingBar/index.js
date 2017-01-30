import React from 'react';
import styled, { keyframes, withTheme } from 'styled-components';
import isUndefined from 'lodash/isUndefined';

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
  height: ${props => props.height};
`;

const renderBars = (colors, duration) => {
  return colors.map((color, i) => {
    const AltBar = styled(Bar)`
      animation: ${animation} 2s linear ${i/2}s infinite;
      background-color: ${color};
    `;
    return (
      <AltBar key={i} />
    );
  });
};

const getColors = (colors, theme) => {
  if (isUndefined(colors)) {
    return [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.tertiary,
    ];
  }

  return colors;
};

const LoadingBar = ({ colors, theme, height = '5px'}) => {
  return (
    <Wrapper height={height}>
      {renderBars(getColors(colors, theme))}
    </Wrapper>
  );
};

export default withTheme(LoadingBar);
