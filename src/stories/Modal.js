import { h, Component } from 'preact'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Modal from '../components/Modal'
import Button from '../components/Button'

const Container = styled.div`margin: 30px;`

class ModalDemo extends Component {
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

storiesOf('Modal', module).addWithInfo('Standard', () => {
  return <ModalDemo />
})
