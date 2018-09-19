import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Provider, Terminal } from '../'
import { output1 } from './assets/tty-output'
import { Repl } from './assets/repl'
import { isTakingScreenshot } from './helpers'
import * as Readme from './README/Terminal.md'

const outputArray = output1.split('\n')

class Logger extends React.Component {
  constructor (props) {
    super(props)

    this.lines = outputArray.slice()
  }

  componentDidMount () {
    if (isTakingScreenshot) {
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
      <Terminal ref={term => (this.term = term)} {...this.props.termProps} />
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

    if (!this.props.ttyInstance) {
      this.tty._repl = new Repl(line => {
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

      this.tty.on('key', (key, ev) => {
        const printable =
          !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
        // Ignore arrow keys
        if (
          ev.code === 'ArrowUp' ||
          ev.code === 'ArrowDown' ||
          ev.code === 'ArrowLeft' ||
          ev.code === 'ArrowRight'
        ) {
          return
        }

        if (ev.keyCode === 13) {
          this.write('\r\n')
          this.tty._repl.process(this.input)
          this.input = ''
        } else if (ev.keyCode === 8) {
          if (this.tty.buffer.x > 2) {
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
    this.setState({ selectedTerm: this.items.find(x => x.name === name) })
  }

  setActiveTty (tty) {
    const selectedTerm = this.items.find(
      x => x.name === this.state.selectedTerm.name
    )
    selectedTerm.term = tty
  }

  render () {
    const activeTerm = this.items.find(
      x => x.name === this.state.selectedTerm.name
    )
    return (
      <Box>
        <select
          value={this.state.selectedTerm.name}
          onChange={e => this.setTerm(e.target.value)}
        >
          {this.items.map(x => <option key={x.name}>{x.name}</option>)}
        </select>
        <Box style={{ height: 500 }}>
          {this.items.map(t => {
            if (t.name !== activeTerm.name) {
              return null
            }
            return (
              <InteractiveTerm
                key={t.name}
                persistent
                ttyInstance={activeTerm.term && activeTerm.term.tty}
                ref={term => this.setActiveTty(term)}
              />
            )
          })}
        </Box>
      </Box>
    )
  }
}

storiesOf('Core/Terminal', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box p={30} style={{ height: 500 }}>
          <InteractiveTerm />
        </Box>
      </Provider>
    )
  })
  .add('Non interactive', () => {
    return (
      <Provider>
        <Box p={30} style={{ height: 500 }}>
          <Logger termProps={{ nonInteractive: true }} />
        </Box>
      </Provider>
    )
  })
  .add('Persistent', () => {
    return (
      <Provider>
        <Box p={30}>
          <PersistentTerm />
        </Box>
      </Provider>
    )
  })
