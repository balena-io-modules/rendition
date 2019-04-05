import assign = require('lodash/assign');
import cloneDeep = require('lodash/cloneDeep');
import * as React from 'react';
import { TerminalProps } from 'rendition';
import styled from 'styled-components';
import { ITerminalOptions, Terminal as Xterm } from 'xterm';
import { fit as fitTerm } from 'xterm/lib/addons/fit/fit';
import Theme from '../../theme';
import { Box } from '../Grid';
import defaultXtermStyle from './XTermDefaultStyle';

const TtyContainer = styled(Box)`
	position: relative;
	height: 100%;

	${defaultXtermStyle}

	.xterm-viewport::-webkit-scrollbar-track {
		background-color: transparent
		border-bottom-right-radius: 0;
	}

	.xterm-viewport::-webkit-scrollbar {
		width: 10px;
		background-color: transparent;
		border-radius: 0;
	}

	.xterm-viewport::-webkit-scrollbar-thumb {
		background-color: #e9e9e9;
	}
`;

const TtyInner = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;

interface ThemedTerminalProps extends TerminalProps {
	theme: Theme;
}

class Terminal extends React.Component<ThemedTerminalProps, {}> {
	readonly tty: Xterm;
	// Used as the element to mount XTERM into
	private mountElement: HTMLDivElement;
	private termConfig: ITerminalOptions;

	constructor(props: ThemedTerminalProps) {
		super(props);

		this.termConfig = assign({}, props.config, {
			cols: 80,
			cursorBlink: false,
			rows: 24,
			fontFamily: Theme.monospace,
			lineHeight: 1.4,
			theme: {
				background: '#343434',
				cursor: props.nonInteractive ? '#343434' : undefined,
			},
		});

		// Allow an existing tty instance to be rebound to this react element
		if (this.props.ttyInstance) {
			this.tty = this.props.ttyInstance;
		} else {
			// Xterm mutates the options object passed into it, so we have to clone it
			// here
			this.tty = new Xterm(cloneDeep(this.termConfig));
		}

		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		this.open();

		if (this.props.ttyInstance) {
			// Xterm nullifies the 'theme' option after opening, so we have to set it
			// again after a new renderer is created
			// see: https://github.com/xtermjs/xterm.js/issues/1323
			this.tty.setOption('theme', this.termConfig.theme);
		}

		// Wait before writing to the xterm instance, so that the term can be sized to the screen correctly
		setTimeout(() => {
			// If this is a non-interactive terminal, rebind <ctrl+c> to copy command
			if (this.props.nonInteractive && document.execCommand) {
				this.tty.attachCustomKeyEventHandler(e => {
					// Ctrl + C
					if (e.ctrlKey && e.keyCode === 67) {
						document.execCommand('copy');
						return false;
					}
					// to make the typings happy
					return true;
				});
			}

			window.addEventListener('resize', this.resize);

			this.resize();
		}, 100);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);

		// Don't destroy tty on unmount if this Terminal is persistent
		if (!this.props.persistent) {
			this.tty.destroy();
		}
	}

	// Explicitly calling '.destroy()' will always work, even with the 'persistent' property
	destroy() {
		window.removeEventListener('resize', this.resize);

		this.tty.destroy();
	}

	open() {
		this.tty.open(this.mountElement);
		this.tty.focus();
	}

	resize() {
		fitTerm(this.tty);
	}

	clear() {
		this.tty.clear();
	}

	writeln(line: string) {
		this.tty.writeln(line);
	}

	write(text: string) {
		this.tty.write(text);
	}

	render() {
		return (
			<TtyContainer color={this.props.color}>
				<TtyInner innerRef={el => (this.mountElement = el)} />
			</TtyContainer>
		);
	}
}

export default Terminal;
