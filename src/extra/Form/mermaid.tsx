import * as React from 'react';
import { FormWidgetProps } from 'rendition/dist/unstable';
import { Box, Button, Flex, Link, Textarea, Theme, Txt } from '../../';
import { Form } from '../../unstable';
import { Mermaid } from '../Mermaid';

interface WidgetState {
	showPreview: boolean;
}

class Widget extends React.Component<FormWidgetProps, WidgetState> {
	constructor(props: FormWidgetProps) {
		super(props);

		this.state = {
			showPreview: false,
		};
	}

	public showPreview = () => {
		this.setState({ showPreview: true });
	};

	public hidePreview = () => {
		this.setState({ showPreview: false });
	};

	public render() {
		// Note: since React 15.2.0 we can't forward unknown element attributes, so we
		// exclude the "options" and "schema" ones here.
		const {
			value,
			readonly,
			disabled,
			autofocus,
			onBlur,
			onFocus,
			options,
			schema,
			formContext,
			...inputProps
		} = this.props;

		const { showPreview } = this.state;

		const change = ({ target: { value } }: any) => {
			return this.props.onChange(value === '' ? options.emptyValue : value);
		};

		return (
			<Box>
				<Flex justify="space-between" mb={1}>
					<Flex>
						<Button plaintext mr={3} onClick={this.hidePreview}>
							<Txt bold={!showPreview}>Write</Txt>
						</Button>

						<Button plaintext onClick={this.showPreview}>
							<Txt bold={showPreview}>Preview</Txt>
						</Button>
					</Flex>

					<Link fontSize={2} href={'https://mermaidjs.github.io/'} blank>
						About mermaid
					</Link>
				</Flex>

				{showPreview && (
					<Mermaid
						bg={Theme.colors.gray.light}
						p={3}
						style={{
							borderRadius: Theme.radius,
							width: '100%',
							minHeight: 180,
						}}
						value={value}
					/>
				)}

				{!showPreview && (
					<Textarea
						placeholder="This text supports mermaid charts"
						readOnly={readonly}
						disabled={disabled}
						autoFocus={autofocus}
						value={value || ''}
						{...inputProps}
						onChange={change}
						onBlur={
							onBlur &&
							((event: any) => onBlur(inputProps.id, event.target.value))
						}
						onFocus={
							onFocus &&
							((event: any) => onFocus(inputProps.id, event.target.value))
						}
						rows={5}
					/>
				)}
			</Box>
		);
	}
}

// Register the mermaid widget to the Form component
Form.registerWidget('mermaid', Widget);
