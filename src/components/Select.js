import * as React from 'react'
import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { px } from '../utils'
import { radius } from '../theme'
import { compose } from 'recompose'

const Base = styled.select`
  border-radius: ${px(radius)};
  height: ${props =>
    px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
  font-size: inherit;
  border: 1px solid ${props => props.theme.colors.gray.main};
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 16px;
  padding-right: ${props =>
    px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
  background-color: white;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;

  &:hover {
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
  }
`

const Wrapper = styled.span`
  display: inline-block;
  position: relative;

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid ${props => props.theme.colors.gray.dark};

    position: absolute;
    right: 16px;
    top: ${props => px(props.emphasized ? 20 : 16)};
  }
`

const Component = ({ emphasized, children, value, onChange, ...props }) => {
  return (
    <Wrapper emphasized={emphasized} {...props}>
      <Base
        emphasized={emphasized}
        value={value}
        onChange={onChange}
        children={children}
      />
    </Wrapper>
  )
}

export default compose(withTheme, hoc)(Component)
