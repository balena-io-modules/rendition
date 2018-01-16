import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import * as uniq from 'lodash/uniq'
import styled from 'styled-components'
import { Box, Filters, SchemaSieve, PineTypes } from '../'
import PokeDex from './assets/pokedex'

const sieve = SchemaSieve()

const Container = styled.div`
  margin: 30px;
`

const StyledTable = styled.table`
  width: 100%;

  td {
    border: 1px solid #eee;
    padding: 3px 6px;
  }
`

const TagBase = styled.span`
  background: yellow;
  border: 1px solid black;
  border-radius: 3px;
  padding: 3px 8px;
  margin: 3px 5px;
`

const Tag = ({ tag }) => (
  <TagBase>
    {tag.tag_name}: {tag.tag_value}
  </TagBase>
)

const setViewsAction = action('Set views')
const setRulesAction = action('Set rules')

const DateTimeDisplay = PineTypes['Date Time'].Display

const schema = {
  Name: {
    type: 'Short Text'
  },
  Category: {
    type: 'Enum',
    values: uniq(PokeDex.map(p => p.Category))
  },
  Description: {
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
  },
  caught: {
    type: 'Boolean',
    label: 'Pokemon has been caught'
  },
  Tag: {
    type: 'Key Value Pair',
    key: 'tag_name',
    value: 'tag_value',
    keyLabel: 'Name',
    valueLabel: 'Value'
  }
}

class FiltersDemo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rules: [],
      views: [
        {
          key: 'global', // Unique key for this set of views
          scopeLabel: 'everyone', // Text shown when selecting where to save view
          title: 'Global', // Text shown above views in views menu
          data: [] // array of views
        },
        {
          key: 'user', // Unique key for this set of views
          scopeLabel: 'just me', // Text shown when selecting where to save view
          title: 'User', // Text shown above views in views menu
          data: [] // array of views
        }
      ],
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
          disabled={this.props.disabled}
          rules={this.state.rules}
          views={this.state.views}
          schema={this.state.schema}
          setViews={views => this.setViews(views)}
          setRules={rules => this.setRules(rules)}
          dark={this.props.dark}
          {...this.props.extra}
        />

        {items.map((item, index) => (
          <div key={index} style={{ color: this.props.dark ? 'white' : null }}>
            <h2>{item.Name}</h2>
            <StyledTable>
              <tbody>
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
                  <td>Abilities</td>
                  <td>{item.Abilities}</td>
                </tr>
                <tr>
                  <td>First Seen</td>
                  <td>
                    <DateTimeDisplay data={item.first_seen} />
                  </td>
                </tr>
                <tr>
                  <td>Caught</td>
                  <td>{item.caught ? 'yes' : 'no'}</td>
                </tr>
                <tr>
                  <td>Tags</td>
                  <td>
                    {!!item.Tag &&
                      item.Tag.map((tag, index) => (
                        <Tag tag={tag} key={index} />
                      ))}
                  </td>
                </tr>
              </tbody>
            </StyledTable>
            <p>{item.Description}</p>
          </div>
        ))}
      </div>
    )
  }
}

storiesOf('Filters', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <FiltersDemo />
  })
  .addWithInfo('Disabled', () => {
    return <FiltersDemo disabled />
  })
  .addWithInfo('Button props', () => {
    const props = {
      addFilterButtonProps: {
        w: 200
      },
      viewsMenuButtonProps: {
        w: 200,
        danger: true
      }
    }

    return <FiltersDemo extra={props} />
  })
  .addWithInfo('Dark', () => {
    return (
      <Box bg='#343434' p={30}>
        <FiltersDemo dark />
      </Box>
    )
  })
