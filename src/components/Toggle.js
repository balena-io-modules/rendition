import * as React from 'react'
import styled, { withTheme } from 'styled-components'
import { lighten, getColor } from '../utils'
import theme from '../theme'
import { compose } from 'recompose'
import asRendition from '../asRendition'
/**
 *  -  toggle styles copied and modified from https://codepen.io/mallendeo/pen/eLIiG
 *     by Mauricio Allende (https://mallendeo.com/)
 *
 * @todo add the source url in Toggle.md
 */

const background = props => {
  const defaultColor = '#514E58'
  const activeColor =
    props.activeBg || getColor(props, 'bg', 'main') || '#48b500'
  const color = props && props.on ? activeColor : defaultColor
  return `background: ${props.disabled === true ? lighten(color) : color};`
}
const handle = props => {
  return `
  &::after {
    left: ${props && props.on ? '45%' : '0'};
    position: relative;
    display: block;
    content: '';
    width: 55%;
    height: 100%;
    border-radius: 50%;
    background: white;q
    transition: all .4s ease;
    box-shadow: none;
  }
`
}
const Button = styled.button`
  outline: 0;
  box-sizing: border-box;
  display: inline-block;
  width: ${({ emphazised }) => (emphazised ? '6em' : '3em')};
  height: ${({ emphazised }) => (emphazised ? '3.6em' : '1.8em')};
  position: relative;
  cursor: pointer;
  user-select: none;
  ${background} border-radius: 2em;
  padding: ${({ emphazised }) => (emphazised ? '4px' : '2px')};
  transition: all 0.4s ease;
  border: none;

  ${handle};
`
Button.defaultProps = { theme }

class Toggle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      on: props.on
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState(
      ({ on }) => {
        return { on: !on }
      },
      () => {
        if (this.props.onToggle && typeof this.props.onToggle === 'function') {
          this.props.onToggle(this.state.on)
        }
      }
    )
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.on !== nextProps.on) {
      this.setState({ on: nextProps.on })
    }
  }

  render () {
    const { disabled, emphazised, ...props } = this.props
    return (
      <Button
        {...props}
        role='checkbox'
        aria-checked={this.state.on}
        aria-label='Toggle'
        disabled={disabled}
        onClick={this.handleClick}
        on={this.state.on}
        emphazised={emphazised}
      />
    )
  }
}

export default compose(
  withTheme,
  asRendition
)(Toggle)
