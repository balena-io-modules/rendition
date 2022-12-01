import { RequiredProps } from '../../common-types';
import { FULL_TEXT_SLUG } from '../Filters/SchemaSieve';
import { JSONSchema } from '../Renderer/types';
import type { CreateFilter } from './utils';

export const operators = () => ({
	is: 'is',
	is_not: 'is not',
});

export type OperatorSlug =
	| keyof ReturnType<typeof operators>
	| typeof FULL_TEXT_SLUG;

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
	subSchema,
) => {
	const operatorSlug = operator.slug;
	if (
		operatorSlug === FULL_TEXT_SLUG &&
		typeof value === 'string' &&
		subSchema.oneOf?.every(
			(o): o is RequiredProps<JSONSchema, 'title' | 'const'> =>
				typeof o === 'object' &&
				typeof o.title === 'string' &&
				typeof o.const === 'string',
		)
	) {
		const transformedEnum = subSchema.oneOf
			.filter((o) => o.title.toLowerCase().includes(value.toLowerCase()))
			.map((o) => o.const);

		if (transformedEnum.length) {
			return {
				properties: {
					[field]: {
						enum: transformedEnum,
					},
				},
				required: [field],
			};
		}
	}

	if (operatorSlug === 'is' || operatorSlug === FULL_TEXT_SLUG) {
		return {
			properties: {
				[field]: {
					const: value,
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_not') {
		return {
			properties: {
				[field]: {
					not: {
						const: value,
					},
				},
			},
		};
	}

	return {};
};
