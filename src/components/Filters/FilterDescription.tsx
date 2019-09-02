import { JSONSchema6 } from 'json-schema';
import * as React from 'react';
import { Omit } from '../../common-types';
import { Tag, TagProps } from '../Tag';

// If the description is JSON-formatted, parse the tag fields and return them, otherwise return the entire thing as the tag value.
const parseFilter = (filter: JSONSchema6 | null | undefined) => {
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
	const tagProps = filter.anyOf
		? filter.anyOf.map((filterFragment: JSONSchema6, i) => {
				const parsedFilter = parseFilter(filterFragment);
				if (i > 0) {
					parsedFilter.prefix = 'or';
				}

				return parsedFilter;
		  })
		: [parseFilter(filter)];

	return <Tag mt={2} multiple={tagProps} {...props} />;
};

export interface FilterDescriptionProps extends Omit<TagProps, 'value'> {
	filter: JSONSchema6;
}

export default FilterDescription;
