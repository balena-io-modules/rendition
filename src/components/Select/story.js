import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Select, Badge, Flex } from '../../'
import Readme from './README.md'

storiesOf('Next/Select', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Flex>
        <Select
          m={3}
          placeholder='Select one...'
          options={['Option 1', 'Option 2', 'Option 3']}
        />

        <Select
          m={3}
          options={['Opened option', 'Option 2', 'Option 3']}
          value={'Opened option'}
          open
        />

        <Select
          m={3}
          options={['Custom render', 'Option 2', 'Option 3']}
          value={'Custom render'}
          open
        >
          {(option) => <Badge m={1}>{option}</Badge>}
        </Select>

        <Select
          m={3}
          plain
          options={['Plain option', 'Option 2', 'Option 3']}
          value={'Plain option'}
        />

        <Select
          width='300px'
          m={3}
          options={['Custom width', 'Option 2', 'Option 3']}
          value={'Custom width'}
        />
      </Flex>
    )
  })
  .add('States', () => {
    return (
      <Flex>
        <Select
          m={3}
          emphasized
          options={['Emphasized', 'Option 2', 'Option 3']}
          value='Emphasized'
        />

        <Select
          m={3}
          disabled
          options={['Disabled', 'Option 2', 'Option 3']}
          value='Disabled'
        />

        <Select
          m={3}
          invalid
          options={['Invalid', 'Option 2', 'Option 3']}
          value='Invalid'
        />
      </Flex>
    )
  })
  .add('Advanced', () => {
    return (
      <Flex>
        <Select
          m={3}
          emptySearchMessage='No results'
          searchPlaceholder='Search something'
          onSearch={(...args) => console.log(args)}
          options={['Search', 'Option 2', 'Option 3']}
          open
        />

        <Select
          m={3}
          placeholder='Passed an object as option'
          options={[
            { title: 'Object 1', value: '1' },
            { title: 'Object 2', value: '2' },
            { title: 'Object 3', value: '3' }
          ]}
          labelKey='title'
          valueKey='value'
          value={{ title: 'Object 1', value: '1' }}
        />
      </Flex>
    )
  })
