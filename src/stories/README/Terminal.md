# Terminal

An xterm emulator built on top of [xterm.js][1].

[View story source](https://github.com/resin-io-modules/rendition/blob/master/src/stories/Terminal.js)

## API

The `Terminal` component exposes a simple api, typically accessed via a `ref`.

Here is a simple example that writes a number every second:

```
import * as React from 'react'
import { Terminal } from 'rendition'

export class Logger extends React.Component {
  constructor (props) {
    super(props)

    this.count = 0
  }

  componentDidMount () {
    this.interval = setInterval(() => {
        this.term.writeln(++this.count)
      }
    }, 1000)
  }

  render () {
    return (
      <Terminal 
        ref={term => (this.term = term)} 
      />
    )
  }
}
```

### `resize()`

Resize the `Terminal` component to fill its container.

### `clear()`

Clear all output from the terminal.

### `writeln(text)`

Write text to the terminal, followed by a line break.

### `write(text)`

Write text to the terminal.

### `destroy(text)`

Tear down the terminal instance.

## Remounting old instances

If you'd like to preserve a terminal session and remount it to the DOM at
a later point, you will need to set the `persistent` property to `true` and then access the readonly property `tty` and store it in memory. 
The `persistent` flag prevents the `Terminal` component form destroying the
`tty` instance when it unmounts.
When you want to remount the session, instantiate a new `Terminal`
component and provide the `tty` value as the `ttyInstance` property. When
a `ttyInstance` property is provided, the `Terminal` component will use that
instance instead of creating a new one.

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| --------------------------------------------------------------------------------------------------------- |
| `ttyInstance`    | `object` | -         | -          | An existing `Terminal.tty` instance to use instead of creating a new one |
| `persistent`    | `boolean` | -         | -          | If true, don't destroy the `Terminal.tty` instance when the component unmounts |
| `nonInteractive`    | `boolean` | -         | -          | If true, the component will go into a "read-only" state, useful for displaying logs |
| `color`    | `string` | -         | -          | A CSS color string that sets the background color of the terminal |
| `config`    | `object` | -         | -          | Startup options to pass to the tty instance, see the [xterm.js options][2] for more detail |



[1]: https://xtermjs.org/
[2]: https://github.com/xtermjs/xterm.js/blob/master/typings/xterm.d.ts#L24
