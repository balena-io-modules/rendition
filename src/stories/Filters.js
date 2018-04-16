import * as React from 'react'
import * as uniq from 'lodash/uniq'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import { Box, Divider, Filters, SchemaSieve } from '../'
import PokeDex from './assets/pokedex'

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
const setFiltersAction = action('Set filters')

const schema = {
  type: 'object',
  properties: {
    Name: {
      title: 'Pokemon Name',
      type: 'string'
    },
    Description: {
      type: 'string'
    },
    Abilities: {
      type: 'string'
    },
    Tag: {
      type: 'object',
      properties: {
        tag_name: {
          title: 'Name',
          description: 'key',
          type: 'string'
        },
        tag_value: {
          description: 'value',
          title: 'Value',
          type: 'string'
        }
      }
    },
    first_seen: {
      title: 'First Seen',
      type: 'string',
      format: 'date-time'
    },
    caught: {
      title: 'Has been caught',
      type: 'boolean'
    },
    biometrics: {
      type: 'object',
      properties: {
        Height: {
          type: 'number'
        },
        Weight: {
          type: 'number'
        }
      }
    },
    pokedex_number: {
      title: 'National pokedex number',
      type: 'number'
    },
    Category: {
      enum: uniq(PokeDex.map(p => p.Category))
    }
  }
}

class FiltersDemo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      filters: []
    }
  }

  setViews (views) {
    setViewsAction(views)
    this.setState({ views })
  }

  setFilters (filters) {
    setFiltersAction(filters)
    this.setState({ filters })
  }

  render () {
    const items = SchemaSieve.filter(this.state.filters, PokeDex)

    return (
      <div>
        <Filters
          disabled={this.props.disabled}
          onFiltersUpdate={filters => this.setFilters(filters)}
          onViewsUpdate={views => this.setViews(views)}
          schema={schema}
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
                  <td>{item.biometrics.Height}</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>{item.biometrics.Weight}</td>
                </tr>
                <tr>
                  <td>Abilities</td>
                  <td>{item.Abilities}</td>
                </tr>
                <tr>
                  <td>First Seen</td>
                  <td>
                    {item.first_seen
                      ? new Date(item.first_seen).toString()
                      : ''}
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
  .addWithInfo('Render modes', () => {
    const dummyFilter = {
      $id: 'FuELaSmfCBqiV9hx',
      anyOf: [
        {
          $id: 'QXe1ev3KzutxZ0lK',
          title: 'is',
          description: 'Pokemon Name is Squirtle',
          type: 'object',
          properties: {
            Name: {
              title: 'Pokemon Name',
              const: 'Squirtle'
            }
          }
        }
      ]
    }

    return (
      <Box p={30}>
        <h3>
          <code>all</code>
        </h3>
        <Filters schema={schema} renderMode='all' />
        <Divider color='#eee' mt={40} mb={90} />

        <h3>
          <code>add</code>
        </h3>
        <Filters schema={schema} renderMode='add' />
        <Divider color='#eee' mt={40} mb={90} />

        <h3>
          <code>search</code>
        </h3>
        <Filters schema={schema} renderMode='search' />
        <Divider color='#eee' mt={40} mb={90} />

        <h3>
          <code>views</code>
        </h3>
        <Filters schema={schema} renderMode='views' />
        <Divider color='#eee' mt={40} mb={90} />

        <h3>
          <code>summary</code>
        </h3>
        <Filters filters={[dummyFilter]} schema={schema} renderMode='summary' />
        <Divider color='#eee' mt={40} mb={90} />

        <h3>You can also use an array of modes</h3>
        <Filters schema={schema} renderMode={['add', 'search']} />
        <Divider color='#eee' mt={40} mb={90} />
      </Box>
    )
  })
