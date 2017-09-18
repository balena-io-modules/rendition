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

storiesOf('Gauge', module).addWithInfo('default', () => {
  return <Gauge m={30} title='Ice Cream' data={data} />
})
