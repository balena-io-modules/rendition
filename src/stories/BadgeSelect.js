import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { BadgeSelect } from '../'
import * as Readme from './README/BadgeSelect.md'

const Container = styled.div`
  margin: 30px;
`

storiesOf('Core/BadgeSelect', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(story => <Container>{story()}</Container>)
  .add('Standard', () => {
    return (
      <BadgeSelect
        placeholder='Select a target'
        items={['wpe', 'web', 'redis']}
        onItemChange={action('onItemChange')}
      />
    )
  })
  .add('Prefix', () => {
    return (
      <BadgeSelect
        placeholder='Select a target'
        items={['wpe', 'web', 'redis']}
        extraPrefix={['Host OS']}
        onItemChange={action('onItemChange')}
      />
    )
  })
  .add('Suffix', () => {
    return (
      <BadgeSelect
        placeholder='Select a target'
        items={['wpe', 'web', 'redis']}
        extraSuffix={['Host OS']}
        onItemChange={action('onItemChange')}
      />
    )
  })
