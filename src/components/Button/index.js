import styled, { withTheme } from 'styled-components';
import React from 'react';
import chroma from 'chroma-js';

const disable = (props) => {
  return `
      background-color: ${chroma(props.type).brighten()};
      cursor: not-allowed;
      pointer-events: none;
      `;
};

const Btn = styled.button`
  /* Adapt the colors based on primary prop */
  background-color: ${props => props.theme.colors[props.type]};
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
    background: ${props => chroma(props.theme.colors[props.type]).darken()}
  }
  ${props => props.disabled && disable(props)}
`;

const Button = ({ children, type, disabled = false }) => {
  return (
    <Btn
      type={type}
      textColor="white"
      disabled={disabled}
    >
      {children}
    </Btn>
  );
};

Object.assign(Button, {
  displayName: 'Button',
  propTypes: {
    type: React.PropTypes.string,
    children: React.PropTypes.node,
    disabled: React.PropTypes.bool,
  },
  defaultProps: {
    type: 'gray',
  },
});

export default Button;
