import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Link, Provider } from '../../'
import Readme from './README.md'

storiesOf('Core/Link', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <div>
            <Link href={`#`}>Internal Link</Link>
          </div>
          <div>
            <Link href={`https://balena.io`} blank>
              External Link
            </Link>
          </div>
          <div>
            <Link disabled href={`https://balena.io`} blank>
              Disabled Link
            </Link>
          </div>
        </Box>
      </Provider>
    )
  })
