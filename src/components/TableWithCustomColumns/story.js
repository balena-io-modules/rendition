import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { Box, TableWithCustomColumns } from '../../'
import PokeDex from '../../stories/assets/pokedex'
import Readme from './README.md'

const columns = [
  {
    field: 'Name',
    sortable: true
  },
  {
    field: 'pokedex_number',
    label: 'National Pokedex Number',
    sortable: true,
    render: value => <code>{value}</code>
  },
  {
    field: 'Category',
    sortable: true
  },
  {
    field: 'first_seen',
    label: 'First Seen',
    sortable: true
  }
]

storiesOf('Core/TableWithCustomColumns', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <TableWithCustomColumns
          columns={columns}
          data={PokeDex}
          onSort={action('sorting')}
          sort={{ field: 'Name', reverse: true }}
        />
      </Box>
    )
  })
