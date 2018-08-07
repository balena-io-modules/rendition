import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Gauge, Provider } from '../'
import * as Readme from './README/Gauge.md'

const data = [
  {
    value: 8,
    name: 'Vanilla',
    color: 'beige'
  },
  {
    value: 9,
    name: 'Chocolate',
    color: 'brown'
  },
  {
    value: 7,
    name: 'Strawberry',
    color: 'pink'
  }
]

const singleSegment = [
  {
    value: 0,
    name: 'Vanilla',
    color: 'beige'
  },
  {
    value: 0,
    name: 'Chocolate',
    color: 'brown'
  },
  {
    value: 2,
    name: 'Strawberry',
    color: 'pink'
  }
]

const zeroCountPlaceholder = 'red'
const zeroCount = [
  {
    value: 0,
    name: 'Chocolate',
    color: 'brown'
  },
  {
    value: 0,
    name: 'Strawberry',
    color: 'pink'
  }
]

storiesOf('Core/Gauge', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Gauge m={30} title='Ice Cream' data={data} />
      </Provider>
    )
  })
  .add('Single segment', () => {
    return (
      <Provider>
        <Gauge m={30} title='Ice Cream' data={singleSegment} />
      </Provider>
    )
  })
  .add('Zero count', () => {
    return (
      <Provider>
        <Gauge
          m={30}
          title='Ice Cream'
          data={zeroCount}
          placeholderColor={zeroCountPlaceholder}
        />
      </Provider>
    )
  })
