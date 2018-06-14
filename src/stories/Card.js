import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { Card, Link, Flex, Button, TextWithCopy } from '../'

const Container = styled.div`
  margin: 30px;
  width: 350px;
`

const rows = [
  <div>Lorem Ipsum dolor si amet</div>,
  <Link href='www.resin.io'>Link</Link>,
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
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <Card>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam scelerisque
        euismod risus at gravida. Pellentesque a nunc semper, ultrices lacus
        nec, mattis mauris
      </Card>
    )
  })
  .addWithInfo('With Header', () => {
    return (
      <React.Fragment>
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
          cta={<Link href='https://resin.io'>Link</Link>}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
          scelerisque euismod risus at gravida. Pellentesque a nunc semper,
          ultrices lacus nec, mattis mauris
        </Card>
      </React.Fragment>
    )
  })
  .addWithInfo('With rows', () => {
    return (
      <Card
        title='Title'
        rows={rows}
        cta={<Link href='https://resin.io'>Link</Link>}
      />
    )
  })
  .addWithInfo('Title', () => {
    return (
      <Card
        title='Title'
        minHeight={'300px'}
        cta={<Link href='https://resin.io'>Link</Link>}
        >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam scelerisque
        euismod risus at gravida. Pellentesque a nunc semper, ultrices lacus
        nec, mattis mauris
      </Card>
    )
  })
