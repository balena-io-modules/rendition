import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { withScreenshot } from 'storybook-chrome-screenshot'
import { Card, Link, Flex, Box, Button, Provider, TextWithCopy } from '../'
import * as Readme from './README/Card.md'

const rows = [
  <div>Lorem Ipsum dolor si amet</div>,
  <Link href='www.balena.io'>Link</Link>,
  <TextWithCopy
    showCopyButton='always'
    copy='This value has been copied to your clipboard!'
    >
    Row with Copy component
  </TextWithCopy>,
  <Flex justify='space-between'>
    <div>Row with</div>
    <div>Flex</div>
  </Flex>,
  <div>Lorem Ipsum dolor si amet</div>
]

storiesOf('Core/Card', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box w={350} m={3}>
          <Card>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            scelerisque euismod risus at gravida. Pellentesque a nunc semper,
            ultrices lacus nec, mattis mauris
          </Card>
        </Box>
      </Provider>
    )
  })
  .add('With Header', () => {
    return (
      <Provider>
        <Box w={350} m={3}>
          <Card
            title='Card with Button'
            cta={
              <Button
                plaintext
                primary
                onClick={() => window.alert('Action with Button')}
              >
                Update
              </Button>
            }
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            scelerisque euismod risus at gravida. Pellentesque a nunc semper,
            ultrices lacus nec, mattis mauris
          </Card>
          <Card
            mt={3}
            title='Card with Link'
            cta={<Link href='https://balena.io'>Link</Link>}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            scelerisque euismod risus at gravida. Pellentesque a nunc semper,
            ultrices lacus nec, mattis mauris
          </Card>
        </Box>
      </Provider>
    )
  })
  .add('With rows', () => {
    return (
      <Provider>
        <Box w={350} m={3}>
          <Card
            title='Title'
            rows={rows}
            cta={<Link href='https://balena.io'>Link</Link>}
          />
        </Box>
      </Provider>
    )
  })
  .add('Title', () => {
    return (
      <Provider>
        <Box w={350} m={3}>
          <Card
            title='Title'
            minHeight={'300px'}
            cta={<Link href='https://balena.io'>Link</Link>}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            scelerisque euismod risus at gravida. Pellentesque a nunc semper,
            ultrices lacus nec, mattis mauris
          </Card>
        </Box>
      </Provider>
    )
  })
