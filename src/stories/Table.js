import * as _ from 'lodash'
import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import styled from 'styled-components'
import { Input, Table } from '../'
import PokeDex from './assets/pokedex'
import * as Readme from './README/Table.md'

const Container = styled.div`
  margin: 30px;
`

const prefixNum = num => (num.toString().length === 1 ? `0${num}` : num)

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
    sortable: true,
    render: value => {
      if (value == null) {
        return null
      }

      const d = new Date(value)
      return (
        <span>
          {d.getFullYear()}-{prefixNum(d.getMonth() + 1)}-{prefixNum(
            d.getDay() + 1
          )}
        </span>
      )
    }
  }
]

class HOC extends React.Component {
  constructor () {
    super()

    this.state = {
      PokeDex: _.cloneDeep(PokeDex)
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
      <Container>
        <Input mb={3} value={PokeDex[0].Name} onChange={this.changeName} />
        <Table columns={columns} data={PokeDex} />
      </Container>
    )
  }
}

storiesOf('Core/Table', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Container>
        <Table columns={columns} data={PokeDex} />
      </Container>
    )
  })
  .add('Checkboxes', () => {
    return (
      <Container>
        <Table
          columns={columns}
          data={PokeDex}
          rowKey='pokedex_number'
          onCheck={action('items-selected')}
        />
      </Container>
    )
  })
  .add('Row Click', () => {
    return (
      <Container>
        <Table
          columns={columns}
          data={PokeDex}
          rowKey='pokedex_number'
          onRowClick={action('row-clicked')}
        />
      </Container>
    )
  })
  .add('Row Prefix', () => {
    return (
      <Container>
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
      </Container>
    )
  })
  .add('Multiple Row Prefix', () => {
    return (
      <Container>
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
      </Container>
    )
  })
  .add('Anchor Rows', () => {
    return (
      <Container>
        <Table
          columns={columns}
          data={PokeDex}
          getRowHref={row => `https://www.pokemon.com/uk/pokedex/${row.Name}`}
          rowAnchorAttributes={{ target: '_blank' }}
        />
      </Container>
    )
  })
  .add('Anchor Rows with Checkboxes', () => {
    return (
      <Container>
        <Table
          columns={columns}
          data={PokeDex}
          rowKey='pokedex_number'
          onCheck={action('items-selected')}
          getRowHref={row => `https://www.pokemon.com/uk/pokedex/${row.Name}`}
          rowAnchorAttributes={{ target: '_blank' }}
        />
      </Container>
    )
  })
  .add('Updating data in a table', () => {
    return <HOC />
  })
