import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { withScreenshot } from 'storybook-chrome-screenshot'
import { Card, Link, Flex, Button, Provider, TextWithCopy } from '../../'
import Readme from './README.md'

const rows = [
  <div>Lorem Ipsum dolor si amet</div>,
  <Link href='www.balena.io'>Link</Link>,
  <TextWithCopy
    showCopyButton='always'
    copy='This value has been copied to your clipboard!'
    >
    Row with Copy component
  </TextWithCopy>,
  <Flex justifyContent='space-between'>
    <div>Row with</div>
    <div>Flex</div>
  </Flex>,
  <div>Lorem Ipsum dolor si amet</div>
]

storiesOf('Next/Card', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Flex flexWrap='wrap' alignItems='flex-start' m={2}>
          <Card width={350} m={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            scelerisque euismod risus at gravida. Pellentesque a nunc semper,
            ultrices lacus nec, mattis mauris
          </Card>
          <Card small width={350} m={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            scelerisque euismod risus at gravida. Pellentesque a nunc semper,
            ultrices lacus nec, mattis mauris
          </Card>
        </Flex>
      </Provider>
    )
  })

  .add('With Header', () => {
    return (
      <Provider>
        <Flex flexWrap='wrap' alignItems='flex-start' m={2}>
          <Card
            width={350}
            m={2}
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
            width={350}
            m={2}
            small
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
            width={350}
            m={2}
            title='Card with Link'
            cta={<Link href='https://balena.io'>Link</Link>}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            scelerisque euismod risus at gravida. Pellentesque a nunc semper,
            ultrices lacus nec, mattis mauris
          </Card>

          <Card
            width={350}
            small
            m={2}
            title='Card with Link'
            cta={<Link href='https://balena.io'>Link</Link>}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            scelerisque euismod risus at gravida. Pellentesque a nunc semper,
            ultrices lacus nec, mattis mauris
          </Card>
        </Flex>
      </Provider>
    )
  })
  .add('With rows', () => {
    return (
      <Provider>
        <Flex flexWrap='wrap' alignItems='flex-start' m={2}>
          <Card
            m={2}
            width={350}
            title='Title'
            rows={rows}
            cta={<Link href='https://balena.io'>Link</Link>}
          />
          <Card
            m={2}
            width={350}
            small
            title='Title'
            rows={rows}
            cta={<Link href='https://balena.io'>Link</Link>}
          />
        </Flex>
      </Provider>
    )
  })
