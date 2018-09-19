import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Pager, Provider } from '../'
import * as Readme from './README/Pager.md'

class PagerHOC extends React.Component {
  constructor () {
    super()

    this.state = {
      page: 0
    }
  }

  render () {
    const { page } = this.state

    return (
      <Box m={3}>
        <Pager
          totalItems={436}
          itemsPerPage={50}
          page={page}
          nextPage={() => this.setState({ page: page + 1 })}
          prevPage={() => this.setState({ page: page - 1 })}
        />
      </Box>
    )
  }
}

storiesOf('Core/Pager', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <PagerHOC />
      </Provider>
    )
  })
