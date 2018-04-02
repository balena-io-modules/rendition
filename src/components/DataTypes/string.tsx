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

interface StringFilter extends JSONSchema6 {
	title: OperatorSlug;
	properties?: {
		[k: string]: {
			const?: string;
			pattern?: string;
			description?: string;
			not?: {
				pattern: string;
			};
		};
	};
}

export const decodeFilter = (
	filter: StringFilter,
): {
	field: string;
	operator: OperatorSlug;
	value: string;
} | null => {
	const operator = filter.title;

	if (!filter.properties) {
		return null;
	}

	const keys = Object.keys(filter.properties);
	if (!keys.length) {
		return null;
	}
	let value: string;

	const field = keys[0];

	if (operator === 'is') {
		value = filter.properties[field].const!;
	} else if (operator === 'contains' || operator === 'not_contains') {
		value = filter.properties[field].description!;
	} else if (operator === 'matches_re') {
		value = filter.properties[field].pattern!;
	} else if (operator === 'not_matches_re') {
		value = filter.properties[field].not!.pattern;
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
