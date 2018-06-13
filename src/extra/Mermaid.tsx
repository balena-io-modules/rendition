import { mermaidAPI } from 'mermaid';
import * as React from 'react';
import { MermaidProps } from 'rendition/dist/extra/Mermaid';
import uuid = require('uuid/v4');
import { Box } from '../';

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
				bindFunctions(renderArea);
			});
		} catch (error) {
			renderArea.innerHTML = `Unable to parse input: ${error.message}`;
		}
	}

	componentDidUpdate(prevProps: MermaidProps) {
		if (prevProps.value !== this.props.value) {
			this.renderSVG();
		}
	}

	render() {
		const { value, ...props } = this.props;
		return (
			<Box {...props}>
				<div ref={element => (this.renderArea = element)} />
			</Box>
		);
	}
}
