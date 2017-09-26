import { h, Component } from 'preact'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import { Filters, SchemaSieve, PineTypes } from '../index.js'
import PokeDex from './assets/pokedex'

const sieve = SchemaSieve()

const Container = styled.div`margin: 30px;`

const StyledTable = styled.table`
  width: 100%;

  td {
    border: 1px solid #eee;
    padding: 3px 6px;
  }
`

const setViewsAction = action('Set views')
const setRulesAction = action('Set rules')

const DateTimeDisplay = PineTypes['Date Time'].Display

const schema = {
  Name: {
    type: 'Short Text'
  },
  Description: {
    type: 'Short Text'
  },
  Category: {
    type: 'Short Text'
  },
  Abilities: {
    type: 'Short Text'
  },
  Height: {
    type: 'Real'
  },
  Weight: {
    type: 'Real'
  },
  first_seen: {
    type: 'Date Time',
    label: 'First Seen'
  },
  pokedex_number: {
    type: 'Integer',
    label: 'National Pokedex Number'
  }
}

class FiltersDemo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rules: [],
      views: {
        global: [],
        user: []
      },
      schema
    }
  }

  setViews (views) {
    setViewsAction(views)
    this.setState({ views })
  }

  setRules (rules) {
    setRulesAction(rules)
    this.setState({ rules })
  }

  render () {
    const items = sieve.filter(PokeDex, this.state.rules)
    return (
      <div>
        <Filters
          rules={this.state.rules}
          views={this.state.views}
          schema={this.state.schema}
          setViews={views => this.setViews(views)}
          setRules={rules => this.setRules(rules)}
        />

        {items.map(item => {
          return (
            <div>
              <h2>{item.Name}</h2>
              <StyledTable>
                <tr>
                  <td>National PokeDex Number</td>
                  <td>{item.pokedex_number}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{item.Category}</td>
                </tr>
                <tr>
                  <td>Height</td>
                  <td>{item.Height}</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>{item.Weight}</td>
                </tr>
                <tr>
                  <td>Abilities:</td>
                  <td>{item.Abilities}</td>
                </tr>
                <tr>
                  <td>First Seen:</td>
                  <td>
                    <DateTimeDisplay data={item.first_seen} />
                  </td>
                </tr>
              </StyledTable>
              <p>{item.Description}</p>
            </div>
          )
        })}
      </div>
    )
  }
}

storiesOf('Filters', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <FiltersDemo />
  })
