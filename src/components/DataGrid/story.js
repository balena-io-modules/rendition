import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, DataGrid, Card, Txt } from '../..'
import Readme from './README.md'

storiesOf('Next/DataGrid', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <DataGrid
          items={[1, 2, 3, 4, 5, 6]}
          getItemKey={(i) => i}
          itemMinWidth={'320px'}
          itemMaxWidth={'640px'}
          renderItem={(i) => (
            <Card>
              <Txt fontSize={4} align='center'>
                {i}
              </Txt>
            </Card>
          )}
        />
      </Box>
    )
  })
