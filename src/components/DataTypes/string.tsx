import { JSONSchema6 } from 'json-schema';
import assign = require('lodash/assign');
import * as React from 'react';
import { DataTypeEditProps, TextareaProps } from 'rendition';
import * as utils from '../../utils';
import Input from '../Input';
import Textarea from '../Textarea';

export const operators = {
	is: {
		getLabel: (_s: JSONSchema6) => 'is',
	},
	contains: {
		getLabel: (_s: JSONSchema6) => 'contains',
	},
	not_contains: {
		getLabel: (_s: JSONSchema6) => 'does not contain',
	},
	matches_re: {
		getLabel: (_s: JSONSchema6) => 'matches RegEx',
	},
	not_matches_re: {
		getLabel: (_s: JSONSchema6) => 'does not match RegEx',
	},
};

type OperatorSlug = keyof typeof operators;

export const decodeFilter = (
	filter: any,
): {
	field: string;
	operator: OperatorSlug;
	value: string;
} | null => {
	const field = Object.keys(filter.properties!).shift()!;
	const operator: OperatorSlug = filter.title;
	let value: string;

	if (!filter.properties || !filter.properties![field]) {
		return null;
	}

	if (operator === 'is') {
		value = (filter.properties[field] as JSONSchema6).const! as string;
	} else if (operator === 'contains' || operator === 'not_contains') {
		value = (filter.properties[field] as JSONSchema6).description!;
	} else if (operator === 'matches_re') {
		value = (filter.properties[field] as JSONSchema6).pattern!;
	} else if (operator === 'not_matches_re') {
		value = ((filter.properties[field] as JSONSchema6).not! as JSONSchema6)
			.pattern!;
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
	o: string,
	value: any,
	schema: JSONSchema6,
): JSONSchema6 => {
	// Cast the operator type so that all DataType create filter functions can have the same call signature
	const operator: OperatorSlug = o as any;
	const { title } = schema;
	const base: JSONSchema6 = {
		$id: utils.randomString(),
		title: operator,
		description: `${title || field} ${operators[operator].getLabel(
			schema,
		)} ${value}`,
		type: 'object',
	};

	if (operator === 'is') {
		return assign(base, {
			properties: {
				[field]: {
					title,
					const: value,
				},
			},
		});
	}

	if (operator === 'contains') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'string',
					description: value,
					pattern: utils.regexEscape(value),
				},
			},
		});
	}

	if (operator === 'not_contains') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'string',
					description: value,
					not: {
						pattern: utils.regexEscape(value),
					},
				},
			},
		});
	}

	if (operator === 'matches_re') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'string',
					pattern: value,
				},
			},
		});
	}

	if (operator === 'not_matches_re') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'string',
					not: {
						pattern: value,
					},
				},
			},
		});
	}

	return base;
};

export const Edit = ({
	onUpdate,
	slim,
	...props
}: DataTypeEditProps & TextareaProps & { slim?: boolean }) => {
	if (slim) {
		return (
			<Input
				onChange={(e: Event) =>
					onUpdate((e.target as HTMLTextAreaElement).value)
				}
				{...props}
			/>
		);
	}

	return (
		<Textarea
			onChange={(e: Event) => onUpdate((e.target as HTMLTextAreaElement).value)}
			{...props}
		/>
	);
};
