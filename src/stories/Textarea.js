import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider, Textarea } from '../'
import * as Readme from './README/Textarea.md'

class TextareaHOC extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: this.props.value || ''
    }
  }

  render () {
    return (
      <Textarea
        {...this.props}
        autoRows
        value={this.state.value}
        onChange={e => this.setState({ value: e.target.value })}
      />
    )
  }
}

storiesOf('Core/Textarea', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Textarea placeholder='Placeholder text' />
        </Box>
      </Provider>
    )
  })
  .add('Monospace', () => {
    return (
      <Provider>
        <Box m={3}>
          <Textarea monospace placeholder='Placeholder text' />
        </Box>
      </Provider>
    )
  })
  .add('AutoRows', () => {
    return (
      <Provider>
        <Box m={3}>
          <TextareaHOC placeholder='This input will grow to match the text it contains' />
        </Box>
      </Provider>
    )
  })
  .add('MinRows', () => {
    const rows = 4
    return (
      <Provider>
        <Box m={3}>
          <TextareaHOC
            minRows={rows}
            placeholder={`This input has a minimum size of ${rows} rows`}
          />
        </Box>
      </Provider>
    )
  })
  .add('MaxRows', () => {
    const rows = 8
    return (
      <Provider>
        <Box m={3}>
          <TextareaHOC
            maxRows={8}
            placeholder={`This input has a maxiumum size of ${rows} rows`}
          />
        </Box>
      </Provider>
    )
  })
