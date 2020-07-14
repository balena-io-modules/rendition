import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { isScreenshot, withScreenshot } from 'storycap'
import { Box, Terminal } from '../../'
import { output1 } from '../../stories/assets/tty-output'
import { Repl } from '../../stories/assets/repl'
import Readme from './README.md'

const outputArray = output1.split('\n')

class Logger extends React.Component {
  constructor (props) {
    super(props)

    this.lines = outputArray.slice()
  }

  componentDidMount () {
    if (isScreenshot()) {
      for (const line of this.lines) {
        this.term.writeln(line)
      }

      return
    }

    this.interval = setInterval(() => {
      if (!this.term) {
        return
      }

      if (this.lines.length) {
        this.term.writeln(this.lines.shift())
      } else {
        window.clearInterval(this.interval)
        this.interval = null
      }
    }, 300)
  }

  componentWillUnmount () {
    if (this.interval) {
      window.clearInterval(this.interval)
    }
  }

  render () {
    return (
      <Terminal ref={(term) => (this.term = term)} {...this.props.termProps} />
    )
  }
}

class InteractiveTerm extends Terminal {
  constructor (props) {
    super(props)

    this.input = ''
  }

  componentDidMount () {
    super.componentDidMount()

    setTimeout(() => {
      this.tty.setOption('bellStyle', 'visual')
    }, 2000)
    if (!this.props.ttyInstance) {
      this.tty._repl = new Repl((line) => {
        if (this.tty) {
          this.writeln(line)
          this.tty.prompt()
        }
      })

      this.tty.prompt = () => {
        this.tty.write('\u001b[33m$ \u001b[0m')
      }

      this.tty.writeln(
        '\u001b[32mThis is a basic interactive representation of a web browser javascript console\u001b[0m'
      )
      this.tty.writeln(
        '\u001b[32mType some keys and commands to play around\u001b[0m'
      )
      this.tty.prompt()

      this.tty.onKey(({ key, domEvent }) => {
        const printable =
          !domEvent.altKey &&
          !domEvent.altGraphKey &&
          !domEvent.ctrlKey &&
          !domEvent.metaKey
        // Ignore arrow keys
        if (domEvent.code === 'ArrowUp' || domEvent.code === 'ArrowDown') {
          return
        }

        if (domEvent.keyCode === 13) {
          this.write('\r\n')
          this.tty._repl.process(this.input)
          this.input = ''
        } else if (domEvent.keyCode === 8) {
          if (this.tty.buffer.active.cursorX > 2) {
            this.tty.write('\b \b')
            this.input = this.input.slice(0, -1)
          }
        } else if (printable) {
          this.input += key
          this.tty.write(key)
        }
      })
    }
  }

  componentWillUnmount () {
    if (!this.props.persistent) {
      this.tty._repl.destroy()
    }

    super.componentWillUnmount()
  }
}

class PersistentTerm extends React.Component {
  constructor (props) {
    super(props)
    const items = [
      {
        name: 'terminal 1',
        term: null
      },
      {
        name: 'terminal 2',
        term: null
      },
      {
        name: 'terminal 3',
        term: null
      }
    ]

    this.state = {
      selectedTerm: items[0]
    }

    this.items = items
  }

  setTerm (name) {
    this.setState({ selectedTerm: this.items.find((x) => x.name === name) })
  }

  setActiveTty (tty) {
    const selectedTerm = this.items.find(
      (x) => x.name === this.state.selectedTerm.name
    )
    selectedTerm.term = tty
  }

  render () {
    const activeTerm = this.items.find(
      (x) => x.name === this.state.selectedTerm.name
    )
    return (
      <Box>
        <select
          value={this.state.selectedTerm.name}
          onChange={(e) => this.setTerm(e.target.value)}
        >
          {this.items.map((x) => (
            <option key={x.name}>{x.name}</option>
          ))}
        </select>
        <Box style={{ height: 500 }}>
          {this.items.map((t) => {
            if (t.name !== activeTerm.name) {
              return null
            }
            return (
              <InteractiveTerm
                key={t.name}
                persistent
                ttyInstance={activeTerm.term && activeTerm.term.tty}
                ref={(term) => this.setActiveTty(term)}
              />
            )
          })}
        </Box>
      </Box>
    )
  }
}

// This is due to https://github.com/xtermjs/xterm.js/issues/2058.
// If the font that the Terminal is set to use is not used on the page, and it hasn't been loaded when xterm renders, it will not rerender. In order to fix that, especially for when we take screenshots, we render the terminal once, remove it from the DOM, and render it again with the correct font family. This might not be necessary when we bump Xterm to 4.0 and use the WebGL renderer.
class ScreenshotWrapper extends React.Component {
  state = {
    show: true
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({ show: false })
    }, 500)

    setTimeout(() => {
      this.setState({ show: true })
    }, 1000)
  }

  render () {
    if (!this.state.show) {
      return null
    }

    return <>{this.props.children}</>
  }
}

storiesOf('Core/Terminal', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot({ delay: 2000 }))
  .add('Standard', () => {
    return (
      <ScreenshotWrapper>
        <Box p={5} style={{ height: 500 }}>
          <InteractiveTerm />
        </Box>
      </ScreenshotWrapper>
    )
  })
  .add('Non interactive', () => {
    return (
      <ScreenshotWrapper>
        <Box p={5} style={{ height: 500 }}>
          <Logger termProps={{ nonInteractive: true }} />
        </Box>
      </ScreenshotWrapper>
    )
  })
  .add('Persistent', () => {
    return (
      <ScreenshotWrapper>
        <Box p={5}>
          <PersistentTerm />
        </Box>
      </ScreenshotWrapper>
    )
  })
