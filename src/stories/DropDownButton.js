import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Divider, DropDownButton, Flex, Provider } from '../'
import * as Readme from './README/DropDownButton.md'

storiesOf('Core/DropDownButton', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
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
      </Provider>
    )
  })
  .add('Bordered List', () => {
    return (
      <Provider>
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
          <DropDownButton mx={2} border label={<div>DropDown</div>}>
            <div>Item</div>
            <div>Item</div>
            <div>Item</div>
            <div>Item</div>
          </DropDownButton>
        </Box>
      </Provider>
    )
  })
  .add('Joined', () => {
    return (
      <Provider>
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
          <DropDownButton mx={2} joined>
            <div>Item</div>
            <div>Item</div>
            <div>Item</div>
            <div>Item</div>
          </DropDownButton>
        </Box>
      </Provider>
    )
  })
  .add('Outline', () => {
    return (
      <Provider>
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
          <DropDownButton mx={2} outline label={<div>DropDown</div>}>
            <div>Item</div>
            <div>Item</div>
            <div>Item</div>
            <div>Item</div>
          </DropDownButton>
        </Box>
      </Provider>
    )
  })
  .add('Outline + Joined', () => {
    return (
      <Provider>
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
          <DropDownButton mx={2} joined outline label={<div>DropDown</div>}>
            <div>Item</div>
            <div>Item</div>
            <div>Item</div>
            <div>Item</div>
          </DropDownButton>
        </Box>
      </Provider>
    )
  })
  .add('Alignment', () => {
    return (
      <Provider>
        <Box m={3}>
          <Flex justify='space-between'>
            <DropDownButton mx={2} primary label={<div>DropDown</div>}>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
            </DropDownButton>
            <DropDownButton
              mx={2}
              alignRight
              secondary
              label={<div>DropDown</div>}
            >
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
            </DropDownButton>
          </Flex>
        </Box>
      </Provider>
    )
  })
  .add('Divider', () => {
    return (
      <Provider>
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
      </Provider>
    )
  })
  .add('No List Formatting', () => {
    return (
      <Provider>
        <Box m={3}>
          <DropDownButton
            mx={2}
            noListFormat
            primary
            label={<div>DropDown</div>}
          >
            <Box p={3}>
              <h3>Free input</h3>
              <p>Lorem ipsum dolor sit amet</p>
            </Box>
          </DropDownButton>
        </Box>
      </Provider>
    )
  })
