import * as React from 'react';
import { MarkdownEditor } from '../MarkdownEditor';

type FormWidgetProps = any;

export const MarkdownWidget = ({ value, onChange }: FormWidgetProps) => {
	return <MarkdownEditor value={value} onChange={onChange} />;
};

MarkdownWidget.displayName = 'Markdown';
