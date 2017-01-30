import styled, { withTheme } from 'styled-components';
import React from 'react';
import chroma from 'chroma-js';

const disable = (props) => {
  return `
      background-color: ${chroma(props.bgColor).brighten()};
      cursor: not-allowed;
      pointer-events: none;
      `;
};

const Btn = styled.button`
  /* Adapt the colors based on primary prop */
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor ? props.textColor : 'white'};
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 3px;
  user-select: none;
  border: 1px solid transparent;
  padding: .5rem 1rem;
  box-sizing: border-box;
  margin: 0 .15rem;
  &:hover {
    background: ${props => chroma(props.bgColor).darken()}
  }
  ${props => props.disabled && disable(props)}
`;

const Button = ({ children, type, theme, disabled = false }) => {
  return (
    <Btn
      bgColor={type ? theme.colors[type] : theme.colors.gray}
      textColor="white"
      disabled={disabled}
    >
      {children}
    </Btn>
  );
};

export default withTheme(Button);
