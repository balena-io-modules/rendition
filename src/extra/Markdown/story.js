import * as React from 'react'
import { storiesOf } from '@storybook/react'
import defaults from 'lodash/defaults'
import cloneDeep from 'lodash/cloneDeep'
import withReadme from 'storybook-readme/with-readme'
import source, {
  customizationSamples
} from '../../stories/assets/markdownSample'
import { Box, Card, Table } from '../../'
import { Markdown, defaultSanitizerOptions } from './index'
import Readme from './README.md'

const generateTableData = () => {
  return customizationSamples.map(({ markdown, sanitizerOptions }) => {
    const customSanitizerOptions = defaults(
      cloneDeep(sanitizerOptions || {}),
      defaultSanitizerOptions
    )
    return {
      'Specific Sanitizer Options': (
        <pre>{JSON.stringify(sanitizerOptions, null, 2)}</pre>
      ),
      Original: (
        <Card small>
          <Markdown>{markdown}</Markdown>
        </Card>
      ),
      Customized: (
        <Card small>
          <Markdown sanitizerOptions={customSanitizerOptions}>
            {markdown}
          </Markdown>
        </Card>
      )
    }
  })
}

storiesOf('Extra/Markdown', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Markdown>{source}</Markdown>
      </Box>
    )
  })
  .add('Customized', () => {
    const cellAttributes = { style: { verticalAlign: 'top' } }

    const columns = [
      { field: 'Specific Sanitizer Options', cellAttributes },
      { field: 'Original', cellAttributes },
      { field: 'Customized', cellAttributes }
    ]
    return (
      <Box m={3}>
        <Table sortable={false} columns={columns} data={generateTableData()} />
      </Box>
    )
  })
