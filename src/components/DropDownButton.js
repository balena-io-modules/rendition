import styled, { withTheme } from 'styled-components'
import { px } from '../utils'
const IconCaretDown = require('react-icons/lib/fa/caret-down')
const IconCaretUp = require('react-icons/lib/fa/caret-up')
import * as React from 'react'
import Button from './Button'
import Divider from './Divider'
import Fixed from './Fixed'
import { Box, Flex } from './Grid'
import theme from '../theme'
import { compose } from 'recompose'
const isArray = require('lodash/isArray')
import { space, color, fontSize, width } from 'styled-system'

const ToggleBase = styled(Button)`
  min-width: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: -1px;
  border-left: 0;
  margin: 0;
  border-width: ${props => props.outline && '1px'};
  vertical-align: top;
`

const ButtonBase = styled(Button)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
  margin: 0;
  border-width: ${props => props.outline && '1px'};
`

const MenuBase = styled.div`
  background: white;
  position: absolute;
  min-width: ${props => props.minWidth};
  box-shadow: ${props => '1px 1px 5px' + props.theme.colors.gray.light};
  border-radius: ${props => px(props.theme.radius)};
  border: ${props => '1px solid ' + props.theme.colors.gray.main};
  z-index: 1;
  margin-top: 2px;
  left: ${props => (props.alignRight ? 'auto' : 0)};
  right: ${props => (!props.alignRight ? 'auto' : 0)};
  white-space: nowrap;
  max-height: 280px;
  overflow-y: auto;
`

MenuBase.defaultProps = { theme }

const Wrapper = styled.div`
  ${space} ${width} ${fontSize} ${color} display: inline-block;
  border-radius: ${props => px(props.theme.radius)};
  vertical-align: top;
  position: relative;
`

const Item = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  border-top: ${props =>
    props.border && '1px solid ' + props.theme.colors.gray.main};
  border-radius: ${props => px(props.theme.radius)};

  &:hover {
    background: ${props => props.theme.colors.gray.light};
  }
`

Item.defaultProps = { theme }

const IconWrapper = styled.span`
  width: 28px;
`

const JoinedButton = styled(Button)`
  margin: 0;
`

const Toggle = ({ open, handler, label, joined, ...props }) => {
  if (joined) {
    if (label) {
      return (
        <JoinedButton {...props} pl={16} pr={0} onClick={handler}>
          <Flex justify='space-between' align='center'>
            <Box mt='1px'>{label}</Box>
            <IconWrapper>
              {open ? <IconCaretUp /> : <IconCaretDown />}
            </IconWrapper>
          </Flex>
        </JoinedButton>
      )
    }
    return (
      <JoinedButton {...props} square onClick={handler}>
        {open ? <IconCaretUp /> : <IconCaretDown />}
      </JoinedButton>
    )
  }
  return (
    <ToggleBase {...props} onClick={handler}>
      {open ? <IconCaretUp /> : <IconCaretDown />}
    </ToggleBase>
  )
}

class DropDownButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      minWidth: 0
    }
  }

  toggle (e) {
    this.setState({
      open: !this.state.open,
      minWidth: this.base && this.base.offsetWidth
    })
  }

  render () {
    const {
      alignRight,
      children,
      label,
      border,
      joined,
      noListFormat,
      outline,
      tooltip,
      ...props
    } = this.props

    const dropdownContents = isArray(children) ? children : [children]

    return (
      <Wrapper {...props}>
        {joined ? (
          <Toggle
            {...props}
            tooltip={tooltip}
            outline={outline}
            joined={joined}
            label={label}
            handler={e => this.toggle(e)}
            open={this.state.open}
          />
        ) : (
          <span>
            <ButtonBase {...props} tooltip={tooltip} outline={outline}>
              {label}
            </ButtonBase>
            <Toggle
              {...props}
              outline={outline}
              handler={e => this.toggle(e)}
              open={this.state.open}
            />
          </span>
        )}
        {this.state.open && <Fixed onClick={e => this.toggle(e)} />}
        {this.state.open && (
          <MenuBase
            alignRight={alignRight}
            onClick={e => this.toggle(e)}
            minWidth={`${this.state.minWidth}px`}
          >
            {dropdownContents.map((child, i) => {
              if (noListFormat) {
                return child
              }
              if (!child) {
                return
              }
              if (child.type === Divider) {
                return child
              }
              return (
                <Item border={border && i} key={i}>
                  {child}
                </Item>
              )
            })}
          </MenuBase>
        )}
      </Wrapper>
    )
  }
}

export default compose(withTheme)(DropDownButton)
