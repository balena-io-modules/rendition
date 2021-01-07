import { Tab, Tabs } from 'grommet';
import * as React from 'react';
import { Link } from '../../components/Link';
import { Textarea } from '../../components/Textarea';
import Theme from '../../theme';
import { Mermaid } from '../Mermaid';

type FormWidgetProps = any;

export const MermaidWidget = ({
	options,
	id,
	onChange,
	onBlur,
	onFocus,
	value,
	readonly,
	disabled,
	autofocus,
	schema,
	formContext,
	...inputProps
}: FormWidgetProps) => {
	const handleChange = ({
		target: { value },
	}: React.ChangeEvent<HTMLTextAreaElement>) => {
		return onChange(value === '' ? options.emptyValue : value);
	};

	const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
		if (onBlur) {
			onBlur(id, event.target.value);
		}
	};

	const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
		if (onFocus) {
			onFocus(id, event.target.value);
		}
	};

	return (
		<React.Fragment>
			<Tabs justify="start">
				<Tab title="Write">
					<Textarea
						placeholder="This text supports mermaid charts"
						readOnly={readonly}
						disabled={disabled}
						autoFocus={autofocus}
						value={value || ''}
						{...inputProps}
						onChange={handleChange}
						onBlur={handleBlur}
						onFocus={handleFocus}
						rows={5}
					/>
				</Tab>

				<Tab title="Preview">
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
				</Tab>
			</Tabs>

			<Link fontSize={0} href={'https://mermaidjs.github.io/'} blank>
				About mermaid
			</Link>
		</React.Fragment>
	);
};

MermaidWidget.displayName = 'Mermaid';
