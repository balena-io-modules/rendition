import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import DropDownButton from '../components/DropDownButton'
import { Flex } from '../components/Grid'
import Divider from '../components/Divider'

const Container = styled.div`margin: 30px;`

storiesOf('DropDownButton', module)
  .addWithInfo('Standard', () => {
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
  .addWithInfo('Borderless', () => {
    return (
      <Container>
        <DropDownButton
          mx={2}
          border={false}
          primary
          label={<div>DropDown</div>}
        >
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton
          mx={2}
          border={false}
          secondary
          label={<div>DropDown</div>}
        >
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton
          mx={2}
          border={false}
          tertiary
          label={<div>DropDown</div>}
        >
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} border={false} label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
      </Container>
    )
  })
  .addWithInfo('Joined', () => {
    return (
      <Container>
        <DropDownButton mx={2} joined primary label='DropDown'>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} joined secondary label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} joined tertiary label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} joined>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
      </Container>
    )
  })
  .addWithInfo('Alignment', () => {
    return (
      <Container>
        <Flex justify='space-between'>
          <DropDownButton mx={2} primary label={<div>DropDown</div>}>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </DropDownButton>
          <DropDownButton
            mx={2}
            alignRight
            secondary
            label={<div>DropDown</div>}
          >
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </DropDownButton>
        </Flex>
      </Container>
    )
  })
  .addWithInfo('Divider', () => {
    return (
      <Container>
        <DropDownButton mx={2} primary label={<div>DropDown</div>}>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <Divider color='#c6c8c9' height={1} />
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </DropDownButton>
      </Container>
    )
  })
