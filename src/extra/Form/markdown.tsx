import * as React from 'react';
import { FormWidgetProps } from 'rendition/dist/unstable';
import { Link, Textarea, Theme } from '../../';
import { Form } from '../../unstable';
import { TabbedBox } from '../../unstable/components/Form/widgets/TabbedBox';
import { Markdown } from '../Markdown';

class Widget extends React.Component<FormWidgetProps, {}> {
	public handleChange = ({
		target: { value },
	}: React.ChangeEvent<HTMLTextAreaElement>) => {
		return this.props.onChange(
			value === '' ? this.props.options.emptyValue : value,
		);
	};

	public handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
		if (this.props.onBlur) {
			this.props.onBlur(this.props.id, event.target.value);
		}
	};

	public handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
		if (this.props.onFocus) {
			this.props.onFocus(this.props.id, event.target.value);
		}
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

		return (
			<TabbedBox
				tabs={['Write', 'Preview']}
				help={
					<Link
						fontSize={2}
						href={'https://guides.github.com/features/mastering-markdown/'}
						blank
					>
						About markdown
					</Link>
				}
			>
				<Textarea
					placeholder="This text supports markdown"
					readOnly={readonly}
					disabled={disabled}
					autoFocus={autofocus}
					value={value || ''}
					{...inputProps}
					onChange={this.handleChange}
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					rows={5}
				/>

				<Markdown
					p={3}
					style={{
						borderRadius: Theme.radius,
						width: '100%',
						minHeight: 180,
					}}
				>
					{value}
				</Markdown>
			</TabbedBox>
		);
	}
}

// Register the mermaid widget to the Form component
Form.registerWidget('markdown', Widget);
