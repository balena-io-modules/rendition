import { h, Component } from 'preact'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import Filters from '../components/Filters'

const Container = styled.div`margin: 30px;`

const setViewsAction = action('Set views')
const setRulesAction = action('Set rules')

const schema = {
  'Short Text field': {
    type: 'Short Text'
  },
  'Date Time field': {
    type: 'Date Time'
  },
  'Integer field': {
    type: 'Integer Time'
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
    return (
      <Filters
        rules={this.state.rules}
        views={this.state.views}
        schema={this.state.schema}
        setViews={views => this.setViews(views)}
        setRules={rules => this.setRules(rules)}
      />
    )
  }
}

storiesOf('Filters', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .addWithInfo('Standard', () => {
    return <FiltersDemo />
  })
