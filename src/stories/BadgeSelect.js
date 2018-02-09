import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import { BadgeSelect } from '../'

const Container = styled.div`
  margin: 30px;
`

storiesOf('BadgeSelect', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return (
      <BadgeSelect
        placeholder='Select a target'
        items={['wpe', 'web', 'redis']}
        onItemChange={action('onItemChange')}
      />
    )
  })
  .addWithInfo('Prefix', () => {
    return (
      <BadgeSelect
        placeholder='Select a target'
        items={['wpe', 'web', 'redis']}
        extraPrefix={['Host OS']}
        onItemChange={action('onItemChange')}
      />
    )
  })
  .addWithInfo('Suffix', () => {
    return (
      <BadgeSelect
        placeholder='Select a target'
        items={['wpe', 'web', 'redis']}
        extraSuffix={['Host OS']}
        onItemChange={action('onItemChange')}
      />
    )
  })
