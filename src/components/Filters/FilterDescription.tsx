import type { JSONSchema7 as JSONSchema } from 'json-schema';
import * as React from 'react';
import { Omit } from '../../common-types';
import { Tag, TagProps } from '../Tag';

// If the description is JSON-formatted, parse the tag fields and return them, otherwise return the entire thing as the tag value.
const parseFilter = (filter: JSONSchema | null | undefined) => {
	if (!filter) {
		return {};
	}

	try {
		return JSON.parse(filter.description!);
	} catch (err) {
		return { value: filter.description };
	}
};

const FilterDescription = ({ filter, ...props }: FilterDescriptionProps) => {
	const tagProps = filter.anyOf?.map((filterFragment: JSONSchema, i) => {
		const parsedFilter = parseFilter(filterFragment);
		parsedFilter.name = parsedFilter.title;
		parsedFilter.operator = parsedFilter.operator?.label?.replace(
			`${parsedFilter.title} `,
			'',
		);
		if (typeof parsedFilter.value === 'boolean') {
			parsedFilter.value = JSON.stringify(parsedFilter.value);
		}
		if (typeof parsedFilter.value === 'object') {
			parsedFilter.value = Object.entries(parsedFilter.value)
				.map(([key, value]) => `${key}: ${value}`)
				.join(', ');
		}
		if (i > 0) {
			parsedFilter.prefix = 'or';
		}

		return parsedFilter;
	}) || [parseFilter(filter)];
	return <Tag mt={2} multiple={tagProps} {...props} />;
};

export interface FilterDescriptionProps extends Omit<TagProps, 'value'> {
	filter: JSONSchema;
}

export default FilterDescription;
