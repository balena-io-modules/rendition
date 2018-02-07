import assign = require('lodash/assign');
import cloneDeep = require('lodash/cloneDeep');
import every = require('lodash/every');
import forEach = require('lodash/forEach');
import includes = require('lodash/includes');
import isArray = require('lodash/isArray');
import isPlainObject = require('lodash/isPlainObject');
import map = require('lodash/map');
import omit = require('lodash/omit');
import pickBy = require('lodash/pickBy');
import some = require('lodash/some');
import {
	AdvancedPineOperatorTest,
	FilterModel,
	FilterRule,
	PineTypeModule,
	Schema,
	SchemaEntry,
	SchemaSieveClass,
} from 'rendition';
import filterTests from '../PineTypes';

type PineTypeModuleStruct = { [key: string]: PineTypeModule };

export const SIMPLE_SEARCH_NAME = 'Full text search';

class SchemaSieve implements SchemaSieveClass {
	public SIMPLE_SEARCH_NAME = SIMPLE_SEARCH_NAME;
	public tests: PineTypeModuleStruct;

	constructor(tests: PineTypeModuleStruct = {}) {
		this.tests = assign(cloneDeep(filterTests), tests);
	}

	test(item: any, input: FilterRule | FilterRule[]) {
		return isArray(input)
			? every(input, i => this.baseTest(item, i))
			: this.baseTest(item, input);
	}

	baseTest(item: any, input: FilterRule): boolean {
		// If this is a compound rule, evaluate the rules together using OR logic
		if (input.extra && input.extra.or) {
			return (
				this.baseTest(item, omit(input, 'extra') as FilterRule) ||
				some(input.extra.or, rule => this.baseTest(item, rule as FilterRule))
			);
		}

		const { type, name } = input;

		// A simple search is not strictly a "type" and searches on all fields,
		// so we handle that seperately here
		if (name === this.SIMPLE_SEARCH_NAME) {
			const { value } = input;
			return some(
				item,
				target =>
					target && includes(String(target).toLowerCase(), value.toLowerCase()),
			);
		}

		if (type in filterTests) {
			const { operator, value } = input;
			const target = item[name];

			if (operator! in filterTests[type].rules) {
				const result = filterTests[type].rules[operator!];
				return isPlainObject(result)
					? result.test(target, value)
					: result(target, value);
			}
		}

		// If the rule contains an unrecognised type or operator, then play it safe
		// and don't filter the item
		return true;
	}

	filter<T>(
		collection: T[],
		input: FilterRule | FilterRule[],
	): T[] | Partial<T> {
		if (isArray(collection)) {
			return this.filterArray(collection, input);
		}
		if (isPlainObject(collection)) {
			return this.filterObject(collection, input) as Partial<T>;
		}

		throw new Error('collection argument must be either object or array.');
	}

	filterArray(collection: any[], input: FilterRule | FilterRule[]) {
		return collection.filter(item => this.test(item, input));
	}

	filterObject(collection: any, input: FilterRule | FilterRule[]) {
		return pickBy(collection, value => this.test(value, input));
	}

	getOperators(type: string, schemaEntry: SchemaEntry) {
		if (type in filterTests) {
			// If the rule has a 'getLabel' method, use that to construct the return object
			return map((filterTests[type] as PineTypeModule).rules, (value, key) => {
				if (!!(<AdvancedPineOperatorTest>value).getLabel) {
					const label = (<AdvancedPineOperatorTest>value).getLabel(schemaEntry);
					if (label) {
						return {
							label,
							value: key,
						};
					}
				}
				return {
					label: key,
					value: key,
				};
			});
		}
		return [];
	}

	makeFilterInputs(schema: Schema) {
		const inputs: {
			[key: string]: FilterModel;
		} = {};

		forEach(schema, (value, key) => {
			inputs[key] = {
				type: value.type,
				name: key,
				label: value.label,
				availableOperators: this.getOperators(value.type, schema[key]),
				operator: null,
				value: null,
			};
		});

		return inputs;
	}

	validate(type: string, value: any) {
		// If the type is unknown just return true
		if (!(type in filterTests)) {
			return true;
		}

		return filterTests[type].validate(value);
	}

	getTypes() {
		return Object.keys(filterTests);
	}
}

export default (tests?: PineTypeModuleStruct) => new SchemaSieve(tests);
