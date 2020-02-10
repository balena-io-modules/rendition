import * as React from 'react';
import { MarkdownEditor } from '../MarkdownEditor';

type FormWidgetProps = any;

export class MarkdownWidget extends React.Component<FormWidgetProps, {}> {
	public render() {
		const { value, onChange } = this.props;

		return <MarkdownEditor value={value} onChange={onChange} />;
	}
}
