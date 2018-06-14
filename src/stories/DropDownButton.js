import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Divider, DropDownButton, Box, Flex } from '../'
import * as Readme from './README/DropDownButton.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/DropDownButton', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
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
  .add('Borderless', () => {
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
  .add('Joined', () => {
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
  .add('Outline', () => {
    return (
      <Container>
        <DropDownButton mx={2} primary outline label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} danger outline label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} tertiary outline label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} outline label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
      </Container>
    )
  })
  .add('Outline + Joined', () => {
    return (
      <Container>
        <DropDownButton
          mx={2}
          primary
          joined
          outline
          label={<div>DropDown</div>}
        >
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton
          mx={2}
          danger
          joined
          outline
          label={<div>DropDown</div>}
        >
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton
          mx={2}
          tertiary
          joined
          outline
          label={<div>DropDown</div>}
        >
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} joined outline label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
      </Container>
    )
  })
  .add('Alignment', () => {
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
  .add('Divider', () => {
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
  .add('No List Formatting', () => {
    return (
      <Container>
        <DropDownButton mx={2} noListFormat primary label={<div>DropDown</div>}>
          <Box p={3}>
            <h3>Free input</h3>
            <p>Lorem ipsum dolor sit amet</p>
          </Box>
        </DropDownButton>
      </Container>
    )
  })
