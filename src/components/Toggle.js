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
 *  -  Toggle switch html structure inspired by Kent C. Odds - Advanced React Patterns V2
 *     https://codesandbox.io/s/github/kentcdodds/advanced-react-patterns-v2/tree/egghead/?from-embed
 *
 * @todo add the source url in Toggle.md
 */
const Button = styled.button`
  box-sizing: initial;
  display: inline-block;
  outline: 0;
  width: ${({ emphazised }) => (emphazised ? '4em' : '2em')};
  height: ${({ emphazised }) => (emphazised ? '2em' : '1em')};
  position: relative;
  cursor: pointer;
  user-select: none;
  background: #fbfbfb;
  border-radius: ${({ emphazised }) => (emphazised ? '4em' : '2em')};
  padding: 4px;
  transition: all 0.4s ease;
  border: ${({ emphazised }) => (emphazised ? '2px' : '1px')} solid #e8eae9;

  &:focus::after,
  &:active::after {
    box-sizing: initial;
  }

  &::after {
    left: 0;
    position: relative;
    display: block;
    content: '';
    width: 50%;
    height: 100%;
    border-radius: ${({ emphazised }) => (emphazised ? '4em' : '2em')};
    background: #fbfbfb;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
      padding 0.3s ease, margin 0.3s ease;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
  }
  &:active::after {
    padding-right: 1.6em;
  }
  ${props =>
    props.on &&
    `
    &::after {
      left: 50%;
    }
    & {
      background: ${props.activeBg ||
        getColor(props, 'bg', 'main') ||
        '#86d993'};
    }
    &:disabled {
      background: ${lighten(
    props.activeBg || (getColor(props, 'bg', 'main') || '#86d993')
  )};
    }
    &:active {
      box-shadow: none;
    }
    &:active::after {
      margin-left: -1.6em;
    }
  `};
`
Button.defaultProps = { theme }

const Input = styled.input`
  display: none;
`

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
        this.props.onToggle(this.state.on)
      }
    )
  }

  render () {
    const { disabled, emphazised, ...props } = this.props
    return (
      <span>
        <Input type='checkbox' checked={this.state.on} onChange={() => {}} />
        <Button
          {...props}
          aria-label='Toggle'
          disabled={disabled}
          onClick={this.handleClick}
          on={this.state.on}
          emphazised={emphazised}
        />
      </span>
    )
  }
}

export default compose(withTheme, asRendition)(Toggle)
