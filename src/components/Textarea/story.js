import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Textarea } from '../../'
import Readme from './README.md'

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

storiesOf('Next/Textarea', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Textarea placeholder='Placeholder text' />
      </Box>
    )
  })
  .add('Monospace', () => {
    return (
      <Box m={3}>
        <Textarea monospace placeholder='Placeholder text' />
      </Box>
    )
  })
  .add('Disabled', () => {
    return (
      <Box m={3}>
        <Textarea disabled placeholder='Placeholder text' />
      </Box>
    )
  })
  .add('Read only', () => {
    return (
      <Box m={3}>
        <Textarea
          readOnly
          placeholder='Placeholder text'
          value='Read only value'
        />
      </Box>
    )
  })
  .add('AutoRows', () => {
    return (
      <Box m={3}>
        <TextareaHOC placeholder='This input will grow to match the text it contains' />
      </Box>
    )
  })
  .add('MinRows', () => {
    const rows = 4
    return (
      <Box m={3}>
        <TextareaHOC
          minRows={rows}
          placeholder={`This input has a minimum size of ${rows} rows`}
        />
      </Box>
    )
  })
  .add('MaxRows', () => {
    const rows = 8
    return (
      <Box m={3}>
        <TextareaHOC
          maxRows={8}
          placeholder={`This input has a maxiumum size of ${rows} rows`}
        />
      </Box>
    )
  })
