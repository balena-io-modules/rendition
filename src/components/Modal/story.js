import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storycap'
import withReadme from 'storybook-readme/with-readme'
import { Box, Button, Heading, Modal } from '../../'
// TODO: Don't depend on other stories
import { Progressor } from '../ProgressBar/story'
import PokeDex from '../../stories/assets/pokedex'
import Readme from './README.md'

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
      <Box m={3}>
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
                  href='https://balena-io-modules.github.io/rendition/'
                  target='_blank'
                >
                  Rendition
                </a>
              </div>
            )}
          </Modal>
        )}
      </Box>
    )
  }
}

class NestedModalDemo extends React.Component {
  state = {
    show1: false,
    show2: false
  }

  render () {
    return (
      <Box m={3}>
        <Button primary onClick={() => this.setState({ show1: true })}>
          Open Modal
        </Button>
        {this.state.show1 && (
          <Modal
            title='First Modal'
            cancel={() => {
              cancelAction()
              this.setState({ show1: false })
            }}
            done={x => {
              doneAction(x)
              this.setState({ show2: true })
            }}
            action='Open another modal'
          >
            {this.state.show2 && (
              <Modal
                title='Second Modal'
                cancel={() => {
                  cancelAction()
                  this.setState({ show2: false })
                }}
                done={x => {
                  doneAction(x)
                  this.setState({ show2: false })
                }}
              />
            )}
          </Modal>
        )}
      </Box>
    )
  }
}

storiesOf('Next/Modal', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot({ viewport: { height: 768 } }))
  .add('Standard', () => {
    return (
      <Modal title='Modal title' cancel={cancelAction} done={doneAction}>
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('Custom action text', () => {
    return (
      <Modal
        title='Modal title'
        cancel={cancelAction}
        done={doneAction}
        action='Go!'
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('No cancel button', () => {
    return (
      <Modal title='Modal title' done={doneAction}>
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('Title Details', () => {
    return (
      <Modal
        title='Modal title'
        titleDetails='Optional details'
        cancel={cancelAction}
        done={doneAction}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('Custom Width', () => {
    return (
      <Modal
        width={1000}
        title='Modal title'
        titleDetails='Optional details'
        cancel={cancelAction}
        done={doneAction}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('Responsive Custom Width', () => {
    return (
      <Modal
        width={['auto', 500, 1000]}
        title='Modal title'
        titleDetails='Optional details'
        cancel={cancelAction}
        done={doneAction}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('Multi Element Title', () => {
    return (
      <Modal
        titleElement={
          <React.Fragment>
            <Heading.h3>Heading</Heading.h3>
            <Progressor mb={3} primary value={50} />
          </React.Fragment>
        }
        cancel={cancelAction}
        done={doneAction}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('Secondary action', () => {
    return (
      <Modal
        width={['auto', 500, 1000]}
        title='Some info'
        secondaryButtonProps={{
          children: 'Refresh',
          onClick: secondaryAction
        }}
        done={doneAction}
        action='OK'
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('Custom Button Properties', () => {
    return (
      <Modal
        width={['auto', 500, 1000]}
        title='Are you sure?'
        cancel={cancelAction}
        done={doneAction}
        action='Delete'
        cancelButtonProps={{
          children: 'Abort',
          width: 150,
          style: {
            marginRight: 30
          }
        }}
        primaryButtonProps={{
          width: 150,
          danger: true,
          primary: false,
          disabled: true
        }}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })
  .add('Anchor Buttons', () => {
    return (
      <Modal
        title='Some info'
        cancel={cancelAction}
        done={doneAction}
        action='Learn more'
        cancelButtonProps={{ children: 'Close' }}
        primaryButtonProps={{
          href: 'https://github.com/balena-io-modules/rendition',
          target: '_blank'
        }}
        >
        <p>Lorem ipsum dolor sit amet</p>
        <a
          href='https://balena-io-modules.github.io/rendition/'
          target='_blank'
        >
          Rendition
        </a>
      </Modal>
    )
  })

storiesOf('Next/Modal', module)
  .addDecorator(withReadme(Readme))
  .add('Open Modal Demo', () => {
    return <ModalDemo />
  })
  .add('Overflow', () => {
    return (
      <React.Fragment>
        <Box m={3}>
          <Heading.h1>
            This is page with long content that causes scrollbars to appear
          </Heading.h1>
        </Box>
        <ModalDemo>
          {PokeDex.map((x, i) => (
            <p key={i}>{x.Description}</p>
          ))}
        </ModalDemo>
        <Box m={3}>
          {PokeDex.map((x, i) => (
            <p key={i}>{x.Description}</p>
          ))}
        </Box>
      </React.Fragment>
    )
  })
  .add('With Tooltip', () => {
    return (
      <React.Fragment>
        <Box m={3}>
          <Heading.h1>The text inside the modal has a tooltip.</Heading.h1>
        </Box>
        <ModalDemo>
          <Heading.h5 tooltip={{ text: 'Good job!', trigger: 'hover' }}>
            Hover me and a tooltip will be displayed.
          </Heading.h5>
        </ModalDemo>
      </React.Fragment>
    )
  })
  .add('Nested Modals', () => {
    return <NestedModalDemo />
  })
