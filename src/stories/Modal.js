import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Modal from '../components/Modal'
import Button from '../components/Button'

const Container = styled.div`
  margin: 30px;
`

class ModalDemo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      show: false
    }
  }

  render () {
    return (
      <Container>
        <Button primary onClick={() => this.setState({ show: true })}>
          Open Modal
        </Button>
        {this.state.show && (
          <Modal
            title='Modal title'
            cancel={() => this.setState({ show: false })}
            done={() => this.setState({ show: false })}
            action='Ok'
          >
            Lorem ipsum dolor sit amet
          </Modal>
        )}
      </Container>
    )
  }
}

class ModalHeaderElementDemo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      show: false
    }
  }

  render () {
    return (
      <Container>
        <Button primary onClick={() => this.setState({ show: true })}>
          Open Modal
        </Button>
        {this.state.show && (
          <Modal
            titleElement={
              <header>
                <h1>Header 1</h1>
                <h2>Header 2</h2>
              </header>
            }
            cancel={() => this.setState({ show: false })}
            done={() => this.setState({ show: false })}
            action='Ok'
          >
            Lorem ipsum dolor sit amet
          </Modal>
        )}
      </Container>
    )
  }
}

storiesOf('Modal', module)
  .addWithInfo('Standard', () => {
    return <ModalDemo />
  })
  .addWithInfo('Multi Element Title', () => {
    return <ModalHeaderElementDemo />
  })
