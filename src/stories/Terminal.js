import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { storiesOf } from '@storybook/react'
import { Box, Terminal } from '../'
import { output1 } from './assets/tty-output'
import { Repl } from './assets/repl'

const outputArray = output1.split('\n')

class Logger extends React.Component {
  constructor (props) {
    super(props)

    this.lines = outputArray.slice()
  }

  componentDidMount () {
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

class InteractiveTerm extends React.Component {
  constructor (props) {
    super(props)

    this.input = ''
  }

  componentDidMount () {
    this._repl = new Repl(line => {
      if (this.term) {
        this.term.writeln(line)
        this.term.tty.prompt()
      }
    }, ReactDOM.findDOMNode(this))

    this.term.tty.prompt = () => {
      this.term.tty.write('\u001b[33m$ \u001b[0m')
    }

    this.term.tty.writeln(
      '\u001b[32mThis is a basic interactive representation of a web browser javascript console\u001b[0m'
    )
    this.term.tty.writeln(
      '\u001b[32mType some keys and commands to play around\u001b[0m'
    )
    this.term.tty.prompt()

    this.term.tty.on('key', (key, ev) => {
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
        this.term.write('\r\n')
        this._repl.process(this.input)
        this.input = ''
      } else if (ev.keyCode === 8) {
        if (this.term.tty.buffer.x > 2) {
          this.term.tty.write('\b \b')
          this.input = this.input.slice(0, -1)
        }
      } else if (printable) {
        this.input += key
        this.term.tty.write(key)
      }
    })
  }

  render () {
    return <Terminal ref={term => (this.term = term)} />
  }
}

storiesOf('Terminal', module)
  .addWithInfo('Standard', () => {
    return (
      <Box p={30} style={{ height: 500 }}>
        <InteractiveTerm />
      </Box>
    )
  })
  .addWithInfo('Non interactive', () => {
    return (
      <Box p={30} style={{ height: 500 }}>
        <Logger termProps={{ nonInteractive: true }} />
      </Box>
    )
  })
