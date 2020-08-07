import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { withScreenshot } from 'storycap'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import JsonSchemaRendererPlayground from './JsonSchemaRendererPlayground'
import JsonSchemaRenderer from './index'
import Readme from './README.md'
import examples from './examples'

// tslint:disable-next-line no-unused-expression
const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }
  #root,
  #root > div,
  #root > div > div {
    display: flex;
    flex: 1;
    min-width: 0;
  }
  .storybook-readme-story > div {
    margin: 0 !important;
  }
`

storiesOf('Extra/JsonSchemaRenderer', module)
  .addDecorator(withReadme(Readme))
  // No point in taking a screenshot of the (empty) Playground
  .addDecorator(withScreenshot({ skip: true }))
  .add('Playground', () => {
    return (
      <React.Fragment>
        <GlobalStyle />
        <JsonSchemaRendererPlayground
          examples={examples}
          flex={1}
          height='100%'
        />
      </React.Fragment>
    )
  })

storiesOf('Extra/JsonSchemaRenderer', module)
  .addDecorator(withReadme(Readme))
  .add('Simple', () => {
    return (
      <JsonSchemaRenderer
        p={2}
        {...examples['An object with various properties']}
      />
    )
  })
