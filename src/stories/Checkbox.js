import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Provider, Checkbox, Heading } from '../'
import Readme from './README/Checkbox.md'

storiesOf('Next/Checkbox', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <label>
            <Heading.h6>Default</Heading.h6>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox onChange={action('action-1')} />
              </Box>
            </Flex>
          </label>
          <label>
            <Heading.h6>Checked</Heading.h6>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox checked onChange={action('action-2')} />
              </Box>
            </Flex>
          </label>
          <label>
            <Heading.h6>With Label</Heading.h6>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox
                  checked
                  label='Checkbox Label'
                  onChange={action('action-3')}
                />
              </Box>
            </Flex>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox
                  checked
                  reverse
                  label='Checkbox Label'
                  onChange={action('action-3')}
                />
              </Box>
            </Flex>
          </label>
          <label>
            <Heading.h6>Disabled</Heading.h6>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox disabled onChange={action('action-4')} />
              </Box>
              <Box m={2}>
                <Checkbox checked disabled onChange={action('action-4')} />
              </Box>
            </Flex>
          </label>
        </Box>
      </Provider>
    )
  })
  .add('Toggle', () => {
    return (
      <Provider>
        <Box m={3}>
          <label>
            <Heading.h6>Default</Heading.h6>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox toggle onChange={action('action-1')} />
              </Box>
            </Flex>
          </label>
          <label>
            <Heading.h6>Checked</Heading.h6>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox toggle checked onChange={action('action-2')} />
              </Box>
            </Flex>
          </label>
          <label>
            <Heading.h6>With Label</Heading.h6>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox
                  toggle
                  checked
                  label='Toggle Label'
                  onChange={action('action-3')}
                />
              </Box>
            </Flex>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox
                  toggle
                  checked
                  reverse
                  label='Toggle Label'
                  onChange={action('action-3')}
                />
              </Box>
            </Flex>
          </label>
          <label>
            <Heading.h6>Disabled</Heading.h6>
            <Flex mb={3}>
              <Box m={2}>
                <Checkbox toggle disabled onChange={action('action-4')} />
              </Box>
              <Box m={2}>
                <Checkbox
                  toggle
                  checked
                  disabled
                  onChange={action('action-4')}
                />
              </Box>
            </Flex>
          </label>
        </Box>
      </Provider>
    )
  })
