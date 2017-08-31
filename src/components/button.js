import styled from 'styled-components'
import { h } from 'preact'
import { Button } from 'rebass'
import classNames from 'classnames'
import { colors } from '../theme'

const BaseBtn = styled(Button)`
  height: 32px;
  border-radius: 3px;
  font-size: inherit;
  min-width: 135px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 1px;
  padding-bottom: 0;
  cursor: pointer;

  &.emphasized {
    height: 42px;
    min-width: 200px;
  }
`

const DefaultBtn = styled(BaseBtn)`
  border: solid 1px #9b9b9b;
  background: none;
  color: ${colors.text.main};

  &:hover,
  &:focus,
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: none;
  }
`

const buttonMaker = ({ main, dark }, darkText = false) => {
  const textColor = darkText ? colors.text.main : 'white'
  return styled(BaseBtn)`
    border: 0;
    background: ${main};
    color: ${textColor};

    &:hover,
    &:focus,
    &:active {
      background-color: ${dark};
      box-shadow: none;
    }
  `
}

const PrimaryBtn = buttonMaker(colors.primary)
const SecondaryBtn = buttonMaker(colors.secondary)
const TertiaryBtn = buttonMaker(colors.tertiary)

const ResinBtn = props => {
  const btnClass = classNames(props.className, {
    emphasized: !!props.emphasized
  })
  console.log(btnClass)
  if (props.primary) {
    return <PrimaryBtn {...props} className={btnClass} />
  }
  if (props.secondary) {
    return <SecondaryBtn {...props} className={btnClass} />
  }
  if (props.tertiary) {
    return <TertiaryBtn {...props} className={btnClass} />
  }
  return <DefaultBtn {...props} className={btnClass} />
}

export default ResinBtn
