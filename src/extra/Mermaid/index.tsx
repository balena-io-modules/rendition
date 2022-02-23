import forEach from 'lodash/forEach';
import mermaid from 'mermaid';
import * as React from 'react';
import uuid from 'uuid/v4';
import { Box, BoxProps } from '../../components/Box';

export interface MermaidProps extends BoxProps {
	/** The mermaid source that should be rendered */
	value: string;
	/** An object of callback functions that can be called in the mermaid graph. Functions are called with the ID of the node that was clicked. Note: These values are attached to the window object, which can cause collisions with other properties. */
	callbackFunctions?: {
		[name: string]: (value: string) => any;
	};
}

/**
 * Generate charts from text using [mermaidjs](https://mermaidjs.github.io/).
 * This component is not loaded by default as it relies on the mermaidjs library
 * that you may not want to include in your application.
 * You can load this component using:
 *
 * ```
 * import { Mermaid } from 'rendition/dist/extra/Mermaid';
 * ```
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/extra/Mermaid/Mermaid.stories.tsx)
 */
export class Mermaid extends React.Component<MermaidProps, {}> {
	private renderArea: null | HTMLElement;
	public readonly id: string;

	constructor(props: MermaidProps) {
		super(props);

		this.id = `rendition-mermaid-${uuid()}`;
	}

	public componentDidMount() {
		const { callbackFunctions } = this.props;
		// MermaidJS expects callback functions to be attached to the window object
		if (callbackFunctions) {
			forEach(callbackFunctions, (callback, name) => {
				(window as any)[name] = callback;
			});
			mermaid.initialize({
				securityLevel: 'loose',
			});
		}
		this.renderSVG();
	}

	public renderSVG() {
		const { value } = this.props;
		const { renderArea } = this;

		if (!renderArea || !value) {
			return;
		}

		try {
			mermaid.mermaidAPI.render(this.id, value, (svgCode, bindFunctions) => {
				renderArea.innerHTML = svgCode;

				if (typeof bindFunctions === 'function') {
					bindFunctions(renderArea);
				}
			});
		} catch (error) {
			renderArea.innerHTML = `Unable to parse input: ${error.message}`;
		}
	}

	public componentDidUpdate(prevProps: MermaidProps) {
		if (prevProps.value !== this.props.value) {
			this.renderSVG();
		}
	}

	public render() {
		const { value, ...props } = this.props;
		return (
			<Box {...props}>
				<div ref={(element) => (this.renderArea = element)} />
			</Box>
		);
	}
}
