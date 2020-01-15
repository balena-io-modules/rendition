import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Divider, DropDownButton, Flex } from '../../'
import Readme from './README.md'

storiesOf('Next/DropDownButton', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
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
        <DropDownButton mx={2} quartenary label={<div>DropDown</div>}>
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
        <DropDownButton mx={2} maxHeight={120} label={<div>Max Height</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
      </Box>
    )
  })
  .add('Bordered List', () => {
    return (
      <Box m={3}>
        <DropDownButton mx={2} border primary label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} border secondary label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} border tertiary label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} border quartenary label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} border label={<div>DropDown</div>}>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
      </Box>
    )
  })
  .add('Joined', () => {
    return (
      <Box m={3}>
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
        <DropDownButton mx={2} joined quartenary label={<div>DropDown</div>}>
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
      </Box>
    )
  })
  .add('Outline', () => {
    return (
      <Box m={3}>
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
        <DropDownButton mx={2} quartenary outline label={<div>DropDown</div>}>
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
      </Box>
    )
  })
  .add('Outline + Joined', () => {
    return (
      <Box m={3}>
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
        <DropDownButton
          mx={2}
          quartenary
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
      </Box>
    )
  })
  .add('Only Caret Icon', () => {
    return (
      <Box m={3}>
        <DropDownButton mx={2} joined primary>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} joined danger>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} tertiary>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>
        <DropDownButton mx={2} quartenary>
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
      </Box>
    )
  })
  .add('Alignment', () => {
    return (
      <Box m={3}>
        <Flex justifyContent='space-between'>
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
      </Box>
    )
  })
  .add('Divider', () => {
    return (
      <Box m={3}>
        <DropDownButton mx={2} primary label={<div>DropDown</div>}>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <Divider color='#c6c8c9' height={1} />
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </DropDownButton>
      </Box>
    )
  })
  .add('No List Formatting', () => {
    return (
      <Box m={3}>
        <DropDownButton mx={2} noListFormat primary label={<div>DropDown</div>}>
          <Box p={3}>
            <h3>Free input</h3>
            <p>Lorem ipsum dolor sit amet</p>
          </Box>
        </DropDownButton>
      </Box>
    )
  })
