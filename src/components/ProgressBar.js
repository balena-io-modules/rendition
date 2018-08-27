import * as React from 'react'
import styled, { withTheme } from 'styled-components'
import { compose, withProps } from 'recompose'
const get = require('lodash/get')
const assign = require('lodash/assign')
import asRendition from '../asRendition'
import { px } from '../utils'
import { radius } from '../theme'

const transition = 'width linear 250ms'

const Bar = styled.div`
  position: relative;
  height: ${props =>
    px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
  overflow: hidden;
  background: ${props => props.bg};
  transition: ${transition};
  text-align: center;
`

const LoadingContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
  color: #000;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
`

const Content = styled.div`
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  transition: ${transition};
`

const Sleeve = styled.div`
  position: relative;
  border-radius: ${px(radius)};
  height: ${props =>
    px(props.emphasized ? props.theme.space[4] : props.theme.space[3])};
  line-height: ${props =>
    px(props.emphasized ? props.theme.space[4] : props.theme.space[3])};
  background: ${props => props.theme.colors.quartenary.main};
  font-size: ${props => (props.emphasized ? 1 : 0.6)}em;
  overflow: hidden;
`

const getType = withProps(props => {
  // get primary, tertiary, secondary and set as props.type
  const type = Object.keys(props).find(b =>
    Object.keys(props.theme.colors).find(k => k === b)
  )
  return assign({}, props, { type })
})

const setTypeProps = withProps(({ type, theme }) => {
  // set type colors
  if (!type) return

  return {
    color: '#fff',
    background: get(theme.colors[type], 'main')
  }
})

const Base = ({ children, color, background, value, ...props }) => {
  return (
    <Sleeve {...props}>
      <LoadingContent>{children}</LoadingContent>
      <Bar bg={background} style={{ width: `${value}%` }}>
        <Content style={{ width: `${value && 100 * 100 / value}%` }}>
          {children}
        </Content>
      </Bar>
    </Sleeve>
  )
}

export default compose(withTheme, getType, setTypeProps, asRendition)(Base)
