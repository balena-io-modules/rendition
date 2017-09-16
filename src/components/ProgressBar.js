import { h } from 'preact'
import styled, { withTheme } from 'styled-components'
import { compose, withProps } from 'recompose'
import get from 'lodash/get'
import hoc from '../hoc'
import { px } from '../utils'
import { radius } from '../theme'

const Bar = styled.div`
  height: ${props =>
    px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
  background: ${props => props.bg};
  transition: width linear 250ms;
  text-align: center;
`

const Content = styled.div`
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
`

const Sleeve = styled.div`
  position: relative;
  border-radius: ${px(radius)};
  height: ${props =>
    px(props.emphasized ? props.theme.space[4] : props.theme.space[3])};
  line-height: ${props =>
    px(props.emphasized ? props.theme.space[4] : props.theme.space[3])};
  background: ${props => props.theme.colors.gray.light};
  font-size: ${props => (props.emphasized ? 1 : 0.6)}em;
  overflow: hidden;
`

const getType = withProps(props => {
  // get primary, tertiary, secondary and set as props.type
  const type = Object.keys(props).find(b =>
    Object.keys(props.theme.colors).find(k => k === b)
  )
  props.type = type
  return props
})

const setTypeProps = withProps(({ type, theme }) => {
  // set type colors
  if (!type) return

  return {
    color: '#fff',
    background: get(theme.colors[type], 'main')
  }
})

const Base = ({ children, background, value, ...props }) => {
  return (
    <Sleeve {...props}>
      <Bar bg={background} style={{ width: `${value}%` }} />
      <Content>{children}</Content>
    </Sleeve>
  )
}

export default compose(withTheme, getType, setTypeProps, hoc)(Base)
