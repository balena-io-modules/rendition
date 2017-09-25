import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import Gauge from '../components/Gauge'

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

const singleItem = [
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

storiesOf('Gauge', module)
  .addWithInfo('default', () => {
    return <Gauge m={30} title='Ice Cream' data={data} />
  })
  .addWithInfo('single segment', () => {
    return <Gauge m={30} title='Ice Cream' data={singleItem} />
  })
