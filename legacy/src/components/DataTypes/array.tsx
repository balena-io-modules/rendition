import { JSONSchema6 } from 'json-schema';
import assign = require('lodash/assign');
import * as React from 'react';
import { DataTypeEditProps, InputProps, TextareaProps } from 'rendition';
import * as utils from '../../utils';
import Input from '../Input';
import Textarea from '../Textarea';

export const operators = {
	contains: {
		getLabel: (_s: JSONSchema6) => 'contains',
	},
	not_contains: {
		getLabel: (_s: JSONSchema6) => 'does not contain',
	},
};

type OperatorSlug = keyof typeof operators;

interface StringFilter extends JSONSchema6 {
	title: OperatorSlug;
	properties?: {
		[k: string]: {
			not?: {
				contains: {
					const: string;
				};
			};
			contains?: {
				const: string;
			};
		};
	};
	anyOf?: Array<{
		properties?: {
			[k: string]: {
				not?: {
					contains: {
						const: string;
					};
				};
				contains?: {
					const: string;
				};
			};
		};
	}>;
}

export const decodeFilter = (
	filter: StringFilter,
): {
	field: string;
	operator: OperatorSlug;
	value: string;
} | null => {
	const operator = filter.title;
	let value: string;
	let field: string;

	if (filter.properties) {
		const keys = Object.keys(filter.properties);
		if (!keys.length) {
			return null;
		}

		field = keys[0];

		if (operator === 'contains') {
			value = filter.properties[field].contains!.const;
		} else {
			return null;
		}
	} else if (filter.anyOf) {
		if (filter.anyOf.length === 0 || !filter.anyOf[0].properties) {
			return null;
		}
		const keys = Object.keys(filter.anyOf[0].properties!);
		if (!keys.length) {
			return null;
		}

		field = keys[0];

		if (operator === 'not_contains') {
			value = filter.anyOf[0].properties![field].not!.contains.const;
		} else {
			return null;
		}
	} else {
		return null;
	}

	return {
		field,
		operator,
		value,
	};
};

export const createFilter = (
	field: string,
	operator: OperatorSlug,
	value: any,
	schema: JSONSchema6,
): JSONSchema6 => {
	const { title } = schema;
	const base: StringFilter = {
		$id: utils.randomString(),
		title: operator,
		description: `${title || field} ${operators[operator].getLabel(
			schema,
		)} ${value}`,
		type: 'object',
	};

	if (operator === 'contains') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'array',
					contains: {
						const: value,
					},
				},
			},
			required: [field],
		});
	}

	if (operator === 'not_contains') {
		return assign(base, {
			anyOf: [
				{
					properties: {
						[field]: {
							type: 'array',
							not: {
								contains: {
									const: value,
								},
							},
						},
					},
				},
				{
					properties: {
						[field]: {
							type: 'null',
						},
					},
				},
			],
		});
	}

	return base;
};

export const Edit = ({
	onUpdate,
	slim,
	...props
}: DataTypeEditProps & TextareaProps & InputProps & { slim?: boolean }) => {
	if (slim) {
		return (
			<Input
				onChange={(e: React.FormEvent<HTMLInputElement>) =>
					onUpdate(e.currentTarget.value)
				}
				{...props}
			/>
		);
	}

	return (
		<Textarea
			onChange={(e: React.FormEvent<HTMLTextAreaElement>) =>
				onUpdate(e.currentTarget.value)
			}
			{...props}
		/>
	);
};
