import * as React from 'react'
import { storiesOf } from '@storybook/react'
import defaults from 'lodash/defaults'
import cloneDeep from 'lodash/cloneDeep'
import withReadme from 'storybook-readme/with-readme'
import source, {
  customizationSamples,
  decoratorSample
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
  .add('Decorators', () => {
    const decorators = [
      {
        match: new RegExp(
          `(\\s|^)((@{1,2}|#|!{1,2})[a-z\\d-_\\/]+(\\.[a-z\\d-_\\/]+)*)(\\s|$)`,
          'gmi'
        ),
        captureGroupIndex: 2,
        component: 'span',
        properties: {
          style: {
            color: 'green'
          }
        }
      }
    ]

    return (
      <Box m={3}>
        <Markdown decorators={decorators}>{decoratorSample}</Markdown>
      </Box>
    )
  })
