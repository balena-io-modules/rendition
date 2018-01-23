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
        extra={['Host OS']}
        onItemChange={action('onItemChange')}
      />
    )
  })
