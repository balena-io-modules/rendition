import * as React from 'react'
import marked from 'marked'
import { storiesOf } from '@storybook/react'
import defaults from 'lodash/defaults'
import cloneDeep from 'lodash/cloneDeep'
import withReadme from 'storybook-readme/with-readme'
import source, {
  customizationSamples
} from '../../stories/assets/markdownSample'
import { Box, Card, Table, Txt } from '../../'
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
  .add('Custom Sanitizer', () => {
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
  .add('Custom Renderer', () => {
    const customRenderer = renderer => {
      renderer.link = function (_href, _title, _text) {
        const link = marked.Renderer.prototype.link.apply(this, arguments)
        return link.replace(/google/g, 'rewrittenLink')
      }

      return renderer
    }

    const markdown = '[https://www.google.com/](https://www.google.com/)'
    return (
      <Box m={3}>
        <Txt mb={2}>
          Original markdown: <Txt.span monospace>{markdown}</Txt.span>
        </Txt>
        <Markdown customizeRenderer={customRenderer}>{markdown}</Markdown>
      </Box>
    )
  })
