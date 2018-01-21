export class Repl {
  constructor (gotLineCallback, element) {
    this.state = {
      history: [],
      input: ''
    }

    this.gotLineCallback = gotLineCallback
    this.replRoot = {}
    this.iframe = document.createElement('iframe')
    element.appendChild(this.iframe)

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
}
