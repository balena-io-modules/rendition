import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import DropDownButton from '../components/DropDownButton'
const Container = styled.div`
  margin: 30px;
`

storiesOf('DropDownButton', module).addWithInfo('Standard', () => {
  return (
    <Container>
      <DropDownButton mx={2} primary label={<div>DropDown</div>}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </DropDownButton>
      <DropDownButton mx={2} secondary label={<div>DropDown</div>}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </DropDownButton>
      <DropDownButton mx={2} tertiary label={<div>DropDown</div>}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </DropDownButton>
      <DropDownButton mx={2} label={<div>DropDown</div>}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </DropDownButton>
    </Container>
  )
})
