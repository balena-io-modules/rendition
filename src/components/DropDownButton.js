import styled, { withTheme } from 'styled-components'
import { px } from '../utils'
import IconCaretDown from 'react-icons/lib/fa/caret-down'
import IconCaretUp from 'react-icons/lib/fa/caret-up'
import { h, Component } from 'preact'
import Button from './Button'
import Fixed from './Fixed'
import { Box, Flex } from './Grid'
import { compose } from 'recompose'
import { space, color, fontSize, width } from 'styled-system'

const ToggleBase = styled(Button)`
  min-width: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: -1px;
  border-left: 0;
  margin: 0;
  border-width: ${props => props.outline && '1px'};
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
  overflow: hidden;
  z-index: 1;
  left: ${props => (props.alignRight ? 'auto' : 0)};
  right: ${props => (!props.alignRight ? 'auto' : 0)};
`

const Wrapper = styled.div`
  ${space} ${width} ${fontSize} ${color} display: inline-block;
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
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.gray.light};
  }
`

const IconWrapper = styled.span`width: 28px;`

const JoinedButton = styled(Button)`margin: 0;`

const Toggle = ({ open, handler, label, joined, ...props }) => {
  if (joined) {
    if (label) {
      return (
        <JoinedButton {...props} pl={16} pr={0} onClick={handler}>
          <Flex justify='space-between'>
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

class DropDownButton extends Component {
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

  render ({ alignRight, children, label, border, joined, ...props }) {
    return (
      <Wrapper {...props}>
        {joined ? (
          <Toggle
            {...props}
            joined={joined}
            label={label}
            handler={e => this.toggle(e)}
            open={this.state.open}
          />
        ) : (
          <span>
            <ButtonBase {...props}>{label}</ButtonBase>
            <Toggle
              {...props}
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
            {children.map((child, i) => {
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
