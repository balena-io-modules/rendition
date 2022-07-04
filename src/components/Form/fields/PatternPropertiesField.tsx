import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import * as React from 'react';
import { FormValidation } from '@rjsf/core';
import { Button } from '../../Button';
import { Input } from '../../Input';

interface PatternPropertiesFieldProps {
	onKeyChange: (
		data: any,
	) => (value: string, errorSchema?: FormValidation) => void;
	onPropertyChange: (
		key: string,
	) => (value: string, errorSchema?: FormValidation) => void;
	onDropPropertyClick: (key: string) => (e: React.MouseEvent) => void;
	formData: any;
	schema: JSONSchema;
}

interface PatternPropertiesFieldState {
	keys: string[];
}

interface TableData {
	key: string;
	value: string;
}

interface ChangeTargetHandlerParams {
	target: {
		value: string;
	};
}

const handleChange = (
	func: (value: string, errorSchema?: FormValidation) => void,
) => {
	return ({ target: { value } }: ChangeTargetHandlerParams) => {
		return func(value);
	};
};

export default class PatternPropertiesField extends React.Component<
	PatternPropertiesFieldProps,
	PatternPropertiesFieldState
> {
	constructor(props: PatternPropertiesFieldProps) {
		super(props);

		const keys = Object.keys(props.formData || {});

		this.state = {
			keys,
		};
	}

	// As the order of keys in `formData` cannot be relied on, an array of keys is
	// preserved, which is updated when a value changes. This means that as key
	// values are updated they will remain in the same position in the UI
	public handleKeyChange = (key: string) => {
		return ({ target: { value } }: ChangeTargetHandlerParams) => {
			const { keys } = this.state;
			const index = keys.indexOf(key);
			if (index > -1) {
				keys[index] = value;
			} else {
				keys.push(value);
			}

			this.props.onKeyChange(key)(value);

			this.setState({ keys });
		};
	};

	public render() {
		const { formData, schema } = this.props;
		if (!schema.patternProperties) {
			return null;
		}

		// At the moment we only support one key in `patternProperties`.
		// Start by extracting the pattern value
		const pattern = Object.keys(schema.patternProperties)[0];

		const tableData = reduce(
			formData,
			(carry: TableData[], value, key) => {
				if (!schema.properties || !schema.properties[key]) {
					carry.push({
						value,
						key,
					});
				}
				return carry;
			},
			[],
		);

		// Sort the table data according to the cached keys array
		tableData.sort((a, b) => {
			const indexA = this.state.keys.indexOf(a.key);
			if (indexA === -1) {
				return 1;
			}
			return this.state.keys.indexOf(a.key) - this.state.keys.indexOf(b.key);
		});

		// Add a blank value to the end of the table data array, causing an extra
		// row to be rendered, this is then used for adding new key/value pairs
		tableData.push({ value: '', key: '' });

		const subSchema = schema.patternProperties[pattern] as JSONSchema;

		return (
			<table>
				<thead>
					<tr>
						<th>Key</th>
						<th>{subSchema.title || 'Value'}</th>
					</tr>
				</thead>

				<tbody>
					{map(tableData, (item, index) => {
						const isLast = index + 1 === tableData.length;
						return (
							<tr key={index}>
								<td>
									<Input
										value={item.key}
										className="rendition-form-pattern-properties__key-field"
										disabled={isLast}
										pattern={pattern}
										placeholder={'Key'}
										onChange={this.handleKeyChange(item.key)}
									/>
								</td>
								<td>
									<Input
										value={item.value}
										id="foo"
										className="rendition-form-pattern-properties__value-field"
										placeholder={subSchema.title || 'Value'}
										onChange={handleChange(
											this.props.onPropertyChange(item.key),
										)}
									/>

									{!isLast && (
										<Button
											className="rendition-form-pattern-properties__remove-field"
											plain
											primary
											py={1}
											px={2}
											onClick={this.props.onDropPropertyClick(item.key)}
										>
											<FontAwesomeIcon icon={faTrashAlt} />
										</Button>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	}
}
