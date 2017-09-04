import { h } from 'preact'
import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { px } from '../utils'
import {
  colors,
  radius,
  defaultControlHeight,
  emphasizedControlHeight
} from '../theme'
import { compose, withProps } from 'recompose'

const Base = styled.select`
  border-radius: ${px(radius)};
  height: ${props =>
    px(props.emphasized ? emphasizedControlHeight : defaultControlHeight)};
  font-size: inherit;
  border: 1px solid ${colors.gray.main};
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 16px;
  padding-right: 40px;
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
    border-top: 5px solid ${colors.gray.dark};

    position: absolute;
    right: 16px;
    top: 16px;
  }
`

const Component = ({ children, value, onChange, ...props }) => {
  return (
    <Wrapper {...props}>
      <Base value={value} onChange={onChange} children={children} />
    </Wrapper>
  )
}

const emphasized = withProps(props => {
  if (props.emphasized) {
    return {
      pr: 5
    }
  }
})

export default compose(withTheme, emphasized, hoc)(Component)
