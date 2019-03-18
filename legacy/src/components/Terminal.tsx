import assign = require('lodash/assign');
import cloneDeep = require('lodash/cloneDeep');
import * as React from 'react';
import { TerminalProps } from 'rendition';
import styled from 'styled-components';
import { ITerminalOptions, Terminal as Xterm } from 'xterm';
import { fit as fitTerm } from 'xterm/lib/addons/fit/fit';
import Theme from '../theme';
import { Box } from './Grid';

// Default styles for xterm.js, taken from
// https://github.com/xtermjs/xterm.js/blob/master/src/xterm.css
const defaultXtermStyle = `
	.xterm {
		font-family: courier-new, courier, monospace;
		font-feature-settings: "liga" 0;
		position: relative;
		user-select: none;
		-ms-user-select: none;
		-webkit-user-select: none;
	}

	.xterm.focus,
	.xterm:focus {
		outline: none;
	}

	.xterm .xterm-helpers {
		position: absolute;
		top: 0;
		/**
		 * The z-index of the helpers must be higher than the canvases in order for
		 * IMEs to appear on top.
		 */
		z-index: 10;
	}

	.xterm .xterm-helper-textarea {
		/*
		 * HACK: to fix IE's blinking cursor
		 * Move textarea out of the screen to the far left, so that the cursor is not visible.
		 */
		position: absolute;
		opacity: 0;
		left: -9999em;
		top: 0;
		width: 0;
		height: 0;
		z-index: -10;
		/** Prevent wrapping so the IME appears against the textarea at the correct position */
		white-space: nowrap;
		overflow: hidden;
		resize: none;
	}

	.xterm .composition-view {
		/* TODO: Composition position got messed up somewhere */
		background: #000;
		color: #FFF;
		display: none;
		position: absolute;
		white-space: nowrap;
		z-index: 1;
	}

	.xterm .composition-view.active {
		display: block;
	}

	.xterm .xterm-viewport {
		/* On OS X this is required in order for the scroll bar to appear fully opaque */
		background-color: #000;
		overflow-y: scroll;
		cursor: default;
		position: absolute;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
	}

	.xterm .xterm-screen {
		position: relative;
	}

	.xterm .xterm-screen canvas {
		position: absolute;
		left: 0;
		top: 0;
	}

	.xterm .xterm-scroll-area {
		visibility: hidden;
	}

	.xterm .xterm-char-measure-element {
		display: inline-block;
		visibility: hidden;
		position: absolute;
		left: -9999em;
	}

	.xterm.enable-mouse-events {
		/* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
		cursor: default;
	}

	.xterm:not(.enable-mouse-events) {
		cursor: text;
	}
`;

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
