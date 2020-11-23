import * as React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Terminal, TerminalProps } from '.';
import { output1 } from '../../stories/assets/tty-output';
import { Repl } from '../../stories/assets/repl';

const outputArray = output1.split('\n');

class Logger extends React.Component<any, any> {
	lines: any;
	interval: any;
	term: any;
	constructor(props: any) {
		super(props);

		this.lines = outputArray.slice();
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			if (!this.term) {
				return;
			}

			if (this.lines.length) {
				this.term.writeln(this.lines.shift());
			} else {
				window.clearInterval(this.interval);
				this.interval = null;
			}
		}, 300);
	}

	componentWillUnmount() {
		if (this.interval) {
			window.clearInterval(this.interval);
		}
	}

	render() {
		return (
			<Terminal ref={(term) => (this.term = term)} {...this.props.termProps} />
		);
	}
}

class InteractiveTerm extends React.Component<any, any> {
	input: any;
	term: any;
	constructor(props: any) {
		super(props);

		this.input = '';
	}

	componentDidMount() {
		setTimeout(() => {
			this.term.tty.setOption('bellStyle', 'visual');
		}, 2000);
		if (!this.props.ttyInstance) {
			this.term.tty._repl = new Repl((line: any) => {
				if (this.term.tty) {
					this.term.writeln(line);
					this.term.tty.prompt();
				}
			});

			this.term.tty.prompt = () => {
				this.term.tty.write('\u001b[33m$ \u001b[0m');
			};

			this.term.tty.writeln(
				'\u001b[32mThis is a basic interactive representation of a web browser javascript console\u001b[0m',
			);
			this.term.tty.writeln(
				'\u001b[32mType some keys and commands to play around\u001b[0m',
			);
			this.term.tty.prompt();

			this.term.tty.onKey(({ key, domEvent }: any) => {
				const printable =
					!domEvent.altKey &&
					!domEvent.altGraphKey &&
					!domEvent.ctrlKey &&
					!domEvent.metaKey;
				// Ignore arrow keys
				if (domEvent.code === 'ArrowUp' || domEvent.code === 'ArrowDown') {
					return;
				}

				if (domEvent.keyCode === 13) {
					this.term.write('\r\n');
					this.term.tty._repl.process(this.input);
					this.input = '';
				} else if (domEvent.keyCode === 8) {
					if (this.term.tty.buffer.active.cursorX > 2) {
						this.term.tty.write('\b \b');
						this.input = this.input.slice(0, -1);
					}
				} else if (printable) {
					this.input += key;
					this.term.tty.write(key);
				}
			});
		} else {
			this.term = this.props.ttyInstance;
		}
	}

	componentWillUnmount() {
		if (!this.props.persistent) {
			this.term.tty._repl.destroy();
		}
	}

	render() {
		return (
			<Terminal ref={(term) => (this.term = term)} {...this.props.termProps} />
		);
	}
}

export default {
	title: 'Core/Terminal',
	component: Terminal,
	decorators: [
		(Story) => (
			<div style={{ height: 500 }}>
				<Story />
			</div>
		),
	],
} as Meta;

const InteractiveTermTemplate = createTemplate<TerminalProps>(InteractiveTerm);
export const Default = createStory<TerminalProps>(InteractiveTermTemplate, {});

const NoninteractiveTermTemplate = createTemplate<TerminalProps>(Logger);
export const NoninteractiveTerminal = createStory<TerminalProps>(
	NoninteractiveTermTemplate,
	{
		nonInteractive: true,
	},
);
