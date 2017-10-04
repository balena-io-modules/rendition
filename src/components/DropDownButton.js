import styled, { withTheme } from 'styled-components'
import { px } from '../utils'
import IconAngleDown from 'react-icons/lib/fa/angle-down'
import IconAngleUp from 'react-icons/lib/fa/angle-up'
import { h, Component } from 'preact'
import Button from './Button'
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
`

const Wrapper = styled.div`
  ${space} ${width} ${fontSize} ${color} display: inline-block;
  vertical-align: top;
`

const Item = styled.div`
  padding: 5px;
  border-top: ${props =>
    props.border && '1px solid ' + props.theme.colors.gray.main};

  &:hover {
    background: ${props => props.theme.colors.gray.light};
  }
`

const Toggle = ({ open, handler, ...props }) => {
  return (
    <ToggleBase {...props} onClick={handler}>
      {open ? <IconAngleUp /> : <IconAngleDown />}
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

  render ({ children, label, ...props }) {
    return (
      <Wrapper {...props}>
        <ButtonBase {...props}>{label}</ButtonBase>
        <Toggle
          {...props}
          handler={e => this.toggle(e)}
          open={this.state.open}
        />
        {this.state.open && (
          <MenuBase
            onClick={e => this.toggle(e)}
            minWidth={`${this.state.minWidth}px`}
          >
            {children.map((child, i) => {
              return (
                <Item border={i} key={i}>
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
