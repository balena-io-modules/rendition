import { mermaidAPI } from 'mermaid';
import * as React from 'react';
import uuid from 'uuid/v4';
import { Box, BoxProps } from '../../components/Box';

export interface MermaidProps extends BoxProps {
	/** The mermaid source that should be rendered */
	value: string;
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
		this.renderSVG();
	}

	public renderSVG() {
		const { value } = this.props;
		const { renderArea } = this;

		if (!renderArea || !value) {
			return;
		}

		try {
			mermaidAPI.render(this.id, value, (svgCode, bindFunctions) => {
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
