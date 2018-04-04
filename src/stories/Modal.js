import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import styled from 'styled-components'
import { Button, Heading, Modal } from '../'
import { Progressor } from './ProgressBar'
import PokeDex from './assets/pokedex'

const Container = styled.div`
  margin: 30px;
`

const cancelAction = action('Modal.cancel')
const secondaryAction = action('Modal.secondary')
const doneAction = action('Modal.done')

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
            cancel={() => {
              cancelAction()
              this.setState({ show: false })
            }}
            done={x => {
              doneAction(x)
              this.setState({ show: false })
            }}
          >
            {this.props.children || (
              <div>
                <p>Lorem ipsum dolor sit amet</p>
                <a
                  href='https://resin-io-modules.github.io/rendition/'
                  target='_blank'
                >
                  Rendition
                </a>
              </div>
            )}
          </Modal>
        )}
      </Container>
    )
  }
}

storiesOf('Modal', module)
  .addWithInfo('Standard', () => {
    return (
      <Modal title='Modal title' cancel={cancelAction} done={doneAction}>
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
      </Modal>
    )
  })
  .addWithInfo('Custom action text', () => {
    return (
      <Modal
        title='Modal title'
        cancel={cancelAction}
        done={doneAction}
        action='Go!'
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
      </Modal>
    )
  })
  .addWithInfo('No cancel button', () => {
    return (
      <Modal title='Modal title' done={doneAction}>
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
      </Modal>
    )
  })
  .addWithInfo('Title Details', () => {
    return (
      <Modal
        title='Modal title'
        titleDetails='Optional details'
        cancel={cancelAction}
        done={doneAction}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
      </Modal>
    )
  })
  .addWithInfo('Custom Width', () => {
    return (
      <Modal
        w={1000}
        title='Modal title'
        titleDetails='Optional details'
        cancel={cancelAction}
        done={doneAction}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
      </Modal>
    )
  })
  .addWithInfo('Responsive Custom Width', () => {
    return (
      <Modal
        w={['auto', 500, 1000]}
        title='Modal title'
        titleDetails='Optional details'
        cancel={cancelAction}
        done={doneAction}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
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
        cancel={cancelAction}
        done={doneAction}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
      </Modal>
    )
  })
  .addWithInfo('Secondary action', () => {
    return (
      <Modal
        w={['auto', 500, 1000]}
        title='Some info'
        secondaryButtonProps={{
          children: 'Refresh',
          onClick: secondaryAction
        }}
        done={doneAction}
        action='OK'
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
      </Modal>
    )
  })
  .addWithInfo('Custom Button Properties', () => {
    return (
      <Modal
        w={['auto', 500, 1000]}
        title='Are you sure?'
        cancel={cancelAction}
        done={doneAction}
        action='Delete'
        cancelButtonProps={{
          children: 'Abort',
          w: 150,
          style: {
            marginRight: 30
          }
        }}
        primaryButtonProps={{
          w: 150,
          danger: true,
          primary: false,
          disabled: true
        }}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a href='https://resin-io-modules.github.io/rendition/' target='_blank'>
          Rendition
        </a>
      </Modal>
    )
  })
  .addWithInfo('Open Modal Demo', () => {
    return <ModalDemo />
  })
  .addWithInfo('Overflow', () => {
    return (
      <div>
        <Container>
          <h1>
            This is page with long content that causes scrollbars to appear
          </h1>
        </Container>
        <ModalDemo>
          {PokeDex.map((x, i) => <p key={i}>{x.Description}</p>)}
        </ModalDemo>
        <Container>
          {PokeDex.map((x, i) => <p key={i}>{x.Description}</p>)}
        </Container>
      </div>
    )
  })
