import cloneDeep from 'lodash/cloneDeep'
import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { Box, Input, Table } from '../../'
import PokeDex from '../../stories/assets/pokedex'
import Readme from './README.md'

const prefixNum = (num) => (num.toString().length === 1 ? `0${num}` : num)

const getRowClass = (pokemon) => {
  const classNames = ['pokemon']

  if (pokemon.caught) {
    classNames.push('pokemon--caught')
  }
  if (pokemon.Abilities.length === 1) {
    classNames.push('pokemon--one-dimensional')
  }

  return classNames
}

const columns = [
  {
    field: 'Name',
    sortable: true
  },
  {
    field: 'pokedex_number',
    label: 'National Pokedex Number',
    sortable: true,
    render: (value) => <code>{value}</code>
  },
  {
    field: 'Category',
    sortable: true
  },
  {
    field: 'first_seen',
    label: 'First Seen',
    sortable: true,
    render: (value) => {
      if (value == null) {
        return null
      }

      const d = new Date(value)
      return (
        <span>
          {d.getFullYear()}-{prefixNum(d.getMonth() + 1)}-
          {prefixNum(d.getDay() + 1)}
        </span>
      )
    }
  }
]

class HOC extends React.Component {
  constructor () {
    super()

    this.state = {
      PokeDex: cloneDeep(PokeDex)
    }

    this.changeName = this.changeName.bind(this)
  }

  changeName (e) {
    const PokeDex = this.state.PokeDex.slice()

    PokeDex[0] = Object.assign({}, PokeDex[0], { Name: e.target.value })

    this.setState({ PokeDex })
  }

  render () {
    const { PokeDex } = this.state
    return (
      <Box m={3}>
        <Input mb={3} value={PokeDex[0].Name} onChange={this.changeName} />
        <Table columns={columns} data={PokeDex} />
      </Box>
    )
  }
}

storiesOf('Core/Table', module)
  .addDecorator(withReadme(Readme))
  .add('Pager callback', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          usePager
          pagerPosition='both'
          itemsPerPage={3}
          onPageChange={(e) => console.log('update!', e)}
        />
      </Box>
    )
  })
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          onSort={action('sorting')}
          sort={{ field: 'Name', reverse: true }}
        />
      </Box>
    )
  })
  .add('Checkboxes', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          rowKey='pokedex_number'
          onCheck={action('items-selected')}
        />
      </Box>
    )
  })
  .add('Row Click', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          rowKey='pokedex_number'
          onRowClick={action('row-clicked')}
        />
      </Box>
    )
  })
  .add('Row Prefix', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          tbodyPrefix={
            <tr>
              <td colSpan={columns.length}>
                <p style={{ textAlign: 'center' }}>
                  This row will always appear at the top of the table
                </p>
              </td>
            </tr>
          }
        />
      </Box>
    )
  })
  .add('Multiple Row Prefix', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          tbodyPrefix={[
            <tr key={1}>
              <td colSpan={columns.length}>
                <p style={{ textAlign: 'center' }}>Row 1</p>
              </td>
            </tr>,
            <tr key={2}>
              <td colSpan={columns.length}>
                <p style={{ textAlign: 'center' }}>Row 2</p>
              </td>
            </tr>
          ]}
        />
      </Box>
    )
  })
  .add('Anchor Rows', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          getRowHref={(row) => `https://www.pokemon.com/uk/pokedex/${row.Name}`}
          rowAnchorAttributes={{ target: '_blank' }}
        />
      </Box>
    )
  })
  .add('Anchor Rows with Checkboxes', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          rowKey='pokedex_number'
          onCheck={action('items-selected')}
          getRowHref={(row) => `https://www.pokemon.com/uk/pokedex/${row.Name}`}
          rowAnchorAttributes={{ target: '_blank' }}
        />
      </Box>
    )
  })
  .add('Highlighted rows', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          rowKey='pokedex_number'
          highlightedRows={[2, 5]}
        />
      </Box>
    )
  })
  .add('Conditional classes', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          rowKey='pokedex_number'
          getRowClass={getRowClass}
        />
      </Box>
    )
  })
  .add('Updating data in a table', () => {
    return <HOC />
  })
  .add('Pager', () => {
    return (
      <Box m={3}>
        <Table
          columns={columns}
          data={PokeDex}
          usePager
          pagerPosition='both'
          itemsPerPage={3}
        />
      </Box>
    )
  })
