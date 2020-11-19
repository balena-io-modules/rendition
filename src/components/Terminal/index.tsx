import cloneDeep from 'lodash/cloneDeep';
import * as React from 'react';
import styled from 'styled-components';
import { ITerminalOptions, Terminal as Xterm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Theme as ThemeType } from '../../common-types';
// TODO: Remove explicit import and use withTheme. There are some issues with the resulting typings when using withTheme, therefore the current workaround.
import theme from '../../theme';
import defaultXtermStyle from './XTermDefaultStyle';
import { Flex } from '../Flex';
// TODO: this can be replaced with types as soon as https://gist.github.com/strothj/708afcf4f01dd04de8f49c92e88093c3
// or similar will be published as an NPM package
import { ResizeObserver } from 'resize-observer';

const TtyContainer = styled(Flex)`
	position: relative;
	${defaultXtermStyle}

	.xterm-viewport::-webkit-scrollbar-track {
		background-color: transparent;
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

const TtyInner = styled(Flex)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;

/**
 * An xterm emulator built on top of [xterm.js](https://xtermjs.org/).
 *
 * ## API
 *
 * The `Terminal` component exposes a simple api, typically accessed via a `ref`.
 *
 * Here is a simple example that writes a number every second:
 *
 * ```
 * import * as React from 'react'
 * import { Terminal } from 'rendition'
 *
 * export class Logger extends React.Component {
 *   constructor (props) {
 *     super(props)
 *
 *     this.count = 0
 *   }
 *
 *   componentDidMount () {
 *     this.interval = setInterval(() => {
 *         this.term.writeln(++this.count)
 *       }
 *     }, 1000)
 *   }
 *
 *   render () {
 *     return (
 *       <Terminal
 *         ref={term => (this.term = term)}
 *       />
 *     )
 *   }
 * }
 * ```
 *
 * ### `resize()`
 *
 * Resize the `Terminal` component to fill its container.
 *
 * ### `clear()`
 *
 * Clear all output from the terminal.
 *
 * ### `writeln(text)`
 *
 * Write text to the terminal, followed by a line break.
 *
 * ### `write(text)`
 *
 * Write text to the terminal.
 *
 * ### `destroy(text)`
 *
 * Tear down the terminal instance.
 *
 * ## Remounting old instances
 *
 * If you'd like to preserve a terminal session and remount it to the DOM at
 * a later point, you will need to set the `persistent` property to `true` and then access the readonly property `tty` and store it in memory.
 * The `persistent` flag prevents the `Terminal` component form destroying the
 * `tty` instance when it unmounts.
 * When you want to remount the session, instantiate a new `Terminal`
 * component and provide the `tty` value as the `ttyInstance` property. When
 * a `ttyInstance` property is provided, the `Terminal` component will use that
 * instance instead of creating a new one.
 *
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Terminal/Terminal.stories.tsx)
 */
export class Terminal extends React.Component<ThemedTerminalProps, {}> {
	public readonly tty: Xterm & { fitAddon: FitAddon };
	// Used as the element to mount XTERM into
	private mountElement: HTMLDivElement | null;
	private termConfig: ITerminalOptions;

	constructor(props: ThemedTerminalProps) {
		super(props);
		this.termConfig = Object.assign({}, props.config, {
			cursorBlink: false,
			fontFamily: props.theme ? props.theme.monospace : theme.monospace,
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
			this.tty = Object.assign(new Xterm(cloneDeep(this.termConfig)), {
				fitAddon: new FitAddon(),
			}) as Xterm & {
				fitAddon: FitAddon;
			};
			this.tty.loadAddon(this.tty.fitAddon);
		}
	}

	public componentDidMount() {
		setTimeout(() => {
			this.open();
			// If this is a non-interactive terminal, rebind <ctrl+c> to copy command
			if (this.props.nonInteractive && document.execCommand) {
				this.tty.attachCustomKeyEventHandler((e) => {
					// Ctrl + C
					if (e.ctrlKey && e.keyCode === 67) {
						document.execCommand('copy');
						return false;
					}
					// to make the typings happy
					return true;
				});
			}
			this.resize();
			if (typeof ResizeObserver === 'function') {
				const resizeObserver = new ResizeObserver(() => {
					this.resize();
				});
				resizeObserver.observe(this.mountElement!);
			}
		});
	}

	public componentWillUnmount() {
		// Don't destroy tty on unmount if this Terminal is persistent
		if (!this.props.persistent) {
			this.destroy();
		}
	}

	// Explicitly calling '.dispose()' will always work, even with the 'persistent' property
	public destroy() {
		this.tty.dispose();
	}

	public open() {
		this.tty.open(this.mountElement!);
		this.tty.focus();
	}

	public resize() {
		const mountElementHasHeight =
			this.mountElement &&
			parseInt(
				window.getComputedStyle(this.mountElement).getPropertyValue('height'),
				10,
			);
		if (!!mountElementHasHeight) {
			try {
				this.tty.fitAddon.fit();
			} catch (err) {
				console.log(err);
			}
		}
	}

	public clear() {
		this.tty.clear();
	}

	public writeln(line: string) {
		this.tty.writeln(line);
	}

	public write(text: string) {
		this.tty.write(text);
	}

	public render() {
		return (
			<TtyContainer flex="1" height="100%" color={this.props.color}>
				<TtyInner
					flex="1"
					flexDirection="column"
					ref={(el) => (this.mountElement = el)}
				/>
			</TtyContainer>
		);
	}
}

export interface TerminalProps {
	/** An existing `Terminal.tty` instance to use instead of creating a new one */
	ttyInstance?: (Xterm & { fitAddon: FitAddon }) | null;
	/** If true, don't destroy the `Terminal.tty` instance when the component unmounts */
	persistent?: boolean;
	/** If true, the component will go into a "read-only" state, useful for displaying logs */
	nonInteractive?: boolean;
	/** A CSS color string that sets the background color of the terminal */
	color?: string;
	/** Startup options to pass to the tty instance, see the xterm.js options for more detail */
	config?: ITerminalOptions;
}

interface ThemedTerminalProps extends TerminalProps {
	theme?: ThemeType;
}
