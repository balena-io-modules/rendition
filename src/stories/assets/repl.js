export class Repl {
  constructor (gotLineCallback) {
    this.state = {
      history: [],
      input: ''
    }

    this.replRoot = {}
    this.gotLineCallback = gotLineCallback

    this.open()
  }

  open () {
    this.iframe = document.createElement('iframe')
    this.iframe.style.display = 'none'
    document.body.appendChild(this.iframe)

    this.iframe.contentWindow.REPL_LOG_CAPTURE = (...args) => {
      args.forEach(arg => this.state.history.push(arg))
    }
  }

  process (input) {
    const history = this.state.history
    history.push(input)
    const command = input.replace('console.log', 'REPL_LOG_CAPTURE', 'g')
    let result
    const _iframe = this.iframe
    try {
      result = (function () {
        return _iframe.contentWindow.eval(command)
      }.call(this.replRoot))
    } catch (err) {
      result = err
    }
    history.push(result)
    this.state.history = history

    if (this.gotLineCallback) {
      this.gotLineCallback(result)
    }
  }

  destroy () {
    this.iframe.remove()
  }
}
