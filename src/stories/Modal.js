import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import Button from '../components/Button'
import Heading from '../components/Heading'
import Modal from '../components/Modal'
import { Progressor } from './ProgressBar'

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

storiesOf('Modal', module)
  .addWithInfo('Standard', () => {
    return (
      <Modal title='Modal title' cancel={() => {}} done={() => {}} action='Ok'>
        Lorem ipsum dolor sit amet
      </Modal>
    )
  })
  .addWithInfo('No cancel button', () => {
    return (
      <Modal title='Modal title' done={() => {}} action='Ok'>
        Lorem ipsum dolor sit amet
      </Modal>
    )
  })
  .addWithInfo('Title Details', () => {
    return (
      <Modal
        title='Modal title'
        titleDetails='Optional details'
        cancel={() => {}}
        done={() => {}}
        action='Ok'
        >
        Lorem ipsum dolor sit amet
      </Modal>
    )
  })
  .addWithInfo('Multi Element Title', () => {
    return (
      <Modal
        titleElement={
          <heading>
            <Heading.h3>Heading</Heading.h3>
            <Progressor mb={3} primary value={50} />
          </heading>
        }
        cancel={() => {}}
        done={() => {}}
        action='Ok'
        >
        Lorem ipsum dolor sit amet
      </Modal>
    )
  })
  .addWithInfo('Open Modal Demo', () => {
    return <ModalDemo />
  })
