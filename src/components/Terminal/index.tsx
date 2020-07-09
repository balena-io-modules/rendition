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

class Terminal extends React.Component<ThemedTerminalProps, {}> {
	public readonly tty: Xterm;
	// Used as the element to mount XTERM into
	private mountElement: HTMLDivElement | null;
	private termConfig: ITerminalOptions;
	// Addons
	private fitAddon: FitAddon;

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
			this.tty = new Xterm(cloneDeep(this.termConfig));
			this.fitAddon = new FitAddon();
			this.tty.loadAddon(this.fitAddon);
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
			window.addEventListener('resize', this.resize.bind(this));
			this.resize();
		});
	}

	public componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
		// Don't destroy tty on unmount if this Terminal is persistent
		if (!this.props.persistent) {
			this.destroy();
		}
	}

	// Explicitly calling '.dispose()' will always work, even with the 'persistent' property
	public destroy() {
		window.removeEventListener('resize', this.resize);
		this.tty.dispose();
	}

	public open() {
		this.tty.open(this.mountElement!);
		this.tty.focus();
	}

	public resize() {
		this.fitAddon.fit();
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
	ttyInstance?: Xterm | null;
	// Prevents tty instance from being destroyed when terminal unmounts
	persistent?: boolean;
	nonInteractive?: boolean;
	color?: string;
	config?: ITerminalOptions;
}

interface ThemedTerminalProps extends TerminalProps {
	theme?: ThemeType;
}

export default Terminal;
