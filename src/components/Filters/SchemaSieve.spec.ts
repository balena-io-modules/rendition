import mapValues from 'lodash/mapValues';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import { SchemaSieve as sieve } from '../../';

const expectMatchesKeys = (data: any, keys: any) =>
	expect(Object.keys(data).sort()).toEqual(keys.sort());

describe('SchemaSieve', () => {
	describe('.filter()', () => {
		// Utility function for batch testing schema/operator combinations
		const testFilter = (
			field: any,
			schema: any,
			collection: any,
			tests: any,
			refScheme?: string,
		) => {
			const nestedSchema = {
				type: 'object',
				...(!!refScheme ? { description: refScheme } : {}),
				properties: {
					data: schema,
				},
			} as any;

			const nestedCollection = mapValues(collection, (value) => ({
				data: value,
			})) as any;

			tests.forEach(({ operator, value, expected }: any) => {
				it(`should correctly test values using the "${
					operator.label
				}" operator with a value of "${JSON.stringify(value)}"`, function () {
					const filter = sieve.createFilter(schema, [
						{
							title: field,
							field,
							operator,
							value,
						},
					]);

					const result = sieve.filter(filter, collection);
					expectMatchesKeys(result, expected);
				});
			});

			tests.forEach(({ operator, value, expected }: any) => {
				it(`should correctly test values using a nested schema and the "${
					operator.label
				}" operator with a value of "${JSON.stringify(value)}"`, function () {
					const filter = sieve.createFilter(nestedSchema, [
						{
							title: 'data',
							field: 'data',
							operator,
							value,
							refScheme,
						},
					]);
					const result = sieve.filter(filter, nestedCollection);
					expectMatchesKeys(result, expected);
				});
			});
		};

		it('should not throw if provided with an invalid data type in the filter', function () {
			const schema = {
				type: 'object',
				properties: {
					test: {
						type: 'Foo Bar',
					},
				},
			} as any;
			const collection = [
				{
					test: 'abcde',
					id: 1,
				},
				{
					test: 'fghij',
					id: 2,
				},
			];

			const filter = sieve.createFilter(schema, [
				{
					title: 'Test',
					field: 'test',
					operator: { label: 'contains', slug: 'contains' },
					value: 'abc',
				},
			]);

			expect(() => sieve.filter(filter, collection)).not.toThrow();
		});

		it('should not throw if provided with an invalid operator in the filter', function () {
			const schema = {
				type: 'object',
				properties: {
					test: {
						type: 'string',
					},
				},
			} as any;
			const collection = [
				{
					test: 'abcde',
					id: 1,
				},
				{
					test: 'fghij',
					id: 2,
				},
			];

			const filter = sieve.createFilter(schema, [
				{
					title: 'Title',
					field: 'test',
					// @ts-expect-error
					operator: { label: 'foo bar', slug: 'foo bar' },
					value: 'abc',
				},
			]);

			expect(() => sieve.filter(filter, collection)).not.toThrow();
		});

		it('should not restrict results if there is an invalid data type in the schema', function () {
			const schema = {
				type: 'object',
				properties: {
					test: {
						type: 'Foo Bar',
					},
				},
			} as any;

			const collection = [
				{
					test: 'abcde',
					id: 1,
				},
				{
					test: 'fghij',
					id: 2,
				},
			];

			const filter = sieve.createFilter(schema, [
				{
					title: 'test',
					field: 'test',
					operator: { slug: 'contains', label: 'contains' },
					value: 'abc',
				},
			]);

			expect(sieve.filter(filter, collection)).toHaveLength(2);
		});

		it('should not restrict results if there is an invalid operator in the rule', function () {
			const schema = {
				type: 'object',
				properties: {
					test: {
						type: 'string',
					},
				},
			} as any;

			const collection = [
				{
					test: 'abcde',
					id: 1,
				},
				{
					test: 'fghij',
					id: 2,
				},
			];

			const filter = sieve.createFilter(schema, [
				{
					title: 'Test',
					field: 'test',
					// @ts-expect-error
					operator: { label: 'foo bar', slug: 'foo bar' },
					value: 'abc',
				},
			]);

			expect(sieve.filter(filter, collection)).toHaveLength(2);
		});

		it('should behave correctly when a filter references a non-existent schema field', function () {
			const schema = {
				type: 'object',
				properties: {
					test: {
						type: 'string',
					},
				},
			} as any;
			const collection = [
				{
					test: 'abcde',
					id: 1,
				},
				{
					test: 'fghij',
					id: 2,
				},
			];

			const filter = sieve.createFilter(schema, [
				{
					// Set the input field to something that doesn't exist in the schema
					title: 'Foo bar',
					field: 'foo bar',
					operator: { label: 'contains', slug: 'contains' },
					value: 'abc',
				},
			]);

			expect(sieve.filter(filter, collection)).toHaveLength(2);
		});

		describe('string types', () => {
			const schema = {
				type: 'object',
				properties: {
					test: {
						type: 'string',
					},
				},
			};

			const collection = {
				'Entry 1': {
					test: 'abcde',
				},
				'Entry 2': {
					test: 'fghij',
				},
				'Entry 3': {
					test: 'KLmno',
				},
				'Entry 4': {
					test: 'ABCde',
				},
				'Entry 5': {
					test: null,
				},
				'Entry 6': {
					foo: 'bar',
				},
			};

			const tests = [
				{
					operator: { slug: 'is', label: 'is' },
					value: 'abcde',
					expected: ['Entry 1'],
				},
				{
					operator: { slug: 'contains', label: 'contains' },
					value: 'BCd',
					expected: ['Entry 1', 'Entry 4'],
				},
				{
					operator: { slug: 'not_contains', label: 'not contains' },
					value: 'ABC',
					expected: ['Entry 2', 'Entry 3', 'Entry 5', 'Entry 6'],
				},
				{
					operator: { slug: 'matches_re', label: 'match RegEx' },
					value: 'ABC',
					expected: ['Entry 4'],
				},
				{
					operator: { slug: 'not_matches_re', label: 'does not match RegEx' },
					value: 'ghi',
					expected: ['Entry 1', 'Entry 3', 'Entry 4', 'Entry 6'],
				},
			];

			testFilter('test', schema, collection, tests);
		});

		describe('object "Tag" types', () => {
			const schema = {
				type: 'object',
				properties: {
					Tag: {
						type: 'object',
						properties: {
							tag_name: {
								title: 'Name',
								description: 'key',
								type: 'string',
							},
							tag_value: {
								description: 'value',
								title: 'Value',
								type: 'string',
							},
						},
					},
				},
			} as any;

			const collection = {
				'Entry 1': {
					Tag: [
						{
							tag_name: 'Aa',
							tag_value: '123',
						},
					],
				},
				'Entry 2': {
					Tag: [
						{
							tag_name: 'Bb',
							tag_value: '456',
						},
					],
				},
				'Entry 3': {
					Tag: [
						{
							tag_name: 'Cc',
							tag_value: '789',
						},
						{
							tag_name: 'Bb',
							tag_value: '101112',
						},
					],
				},
				'Entry 4': {
					Tag: [
						{
							tag_name: 'Dd',
							tag_value: '131415',
						},
					],
				},
				'Entry 5': {
					foo: 'bar',
				},
				'Entry 6': {
					Tag: [
						{
							hello: 'world',
							foo: 'bar',
							tag_name: 'Ee',
							tag_value: '161718',
						},
					],
				},
				'Entry 7': {
					Tag: [
						{
							tag_name: 'Aa',
							tag_value: '1234',
						},
					],
				},
				'Entry 8': {
					Tag: [
						{
							tag_name: 'Aaa',
							tag_value: '123',
						},
					],
				},
			} as any;

			const tests = [
				{
					operator: { slug: 'is', label: 'is' },
					value: {
						tag_name: 'Aa',
						tag_value: '123',
					},
					expected: ['Entry 1'],
				},
				{
					operator: { slug: 'is_not', label: 'is not' },
					value: {
						tag_name: 'Aa',
						tag_value: '123',
					},
					expected: [
						'Entry 2',
						'Entry 3',
						'Entry 4',
						'Entry 5',
						'Entry 6',
						'Entry 7',
						'Entry 8',
					],
				},
				{
					operator: { slug: 'key_is', label: 'key is' },
					value: {
						tag_name: 'Dd',
					},
					expected: ['Entry 4'],
				},
				{
					operator: { slug: 'key_contains', label: 'key contains' },
					value: {
						tag_name: 'b',
					},
					expected: ['Entry 2', 'Entry 3'],
				},
				{
					operator: {
						slug: 'key_not_contains',
						label: 'key does not contains',
					},
					value: {
						tag_name: 'b',
					},
					expected: [
						'Entry 1',
						'Entry 4',
						'Entry 5',
						'Entry 6',
						'Entry 7',
						'Entry 8',
					],
				},
				{
					operator: { slug: 'key_matches_re', label: 'key matches RegEx' },
					value: {
						tag_name: 'b',
					},
					expected: ['Entry 2', 'Entry 3'],
				},
				{
					operator: {
						slug: 'key_not_matches_re',
						label: 'key does not matches RegEx',
					},
					value: {
						tag_name: 'b',
					},
					expected: [
						'Entry 1',
						'Entry 4',
						'Entry 5',
						'Entry 6',
						'Entry 7',
						'Entry 8',
					],
				},
				{
					operator: { slug: 'value_is', label: 'value is' },
					value: {
						tag_value: '123',
					},
					expected: ['Entry 1', 'Entry 8'],
				},
				{
					operator: { slug: 'value_contains', label: 'value contains' },
					value: {
						tag_value: '23',
					},
					expected: ['Entry 1', 'Entry 7', 'Entry 8'],
				},
				{
					operator: {
						slug: 'value_not_contains',
						label: 'value does not contains',
					},
					value: {
						tag_value: '1',
					},
					expected: ['Entry 2', 'Entry 5'],
				},
				{
					operator: { slug: 'value_matches_re', label: 'value matches ReGex' },
					value: {
						tag_value: '56',
					},
					expected: ['Entry 2'],
				},
				{
					operator: {
						slug: 'value_not_matches_re',
						label: 'value does not matches ReGex',
					},
					value: {
						tag_value: '1',
					},
					expected: ['Entry 2', 'Entry 5'],
				},
			];

			testFilter('Tag', schema, collection, tests);

			it('should correctly test values using the "is" operator when there are additional properties', function () {
				const filter = sieve.createFilter(schema, [
					{
						title: 'Tag',
						field: 'Tag',
						operator: { label: 'is', slug: 'is' },
						value: {
							tag_name: 'Ee',
							tag_value: '161718',
						},
					},
				]);

				const result = sieve.filter(filter, collection);

				expectMatchesKeys(result, ['Entry 6']);
			});
		});

		describe('date-time format string types', () => {
			const schema = {
				type: 'object',
				properties: {
					date: {
						type: 'string',
						format: 'date-time',
					},
				},
			} as any;

			const collection = {
				'Entry 1': {
					date: '2017-01-01T08:49:26Z',
				},
				'Entry 2': {
					date: '2012-01-01T00:00:00Z',
				},
				'Entry 3': {
					date: null,
				},
				'Entry 4': {
					foo: 'bar',
				},
			} as any;

			const tests = [
				{
					operator: { slug: 'is', label: 'is' },
					value: '2017-01-01T08:49:26.000Z',
					expected: ['Entry 1'],
				},
				{
					operator: { slug: 'is_before', label: 'is before' },
					value: '2016-12-25T00:00:00.000Z',
					expected: ['Entry 2'],
				},
				{
					operator: { slug: 'is_after', label: 'is after' },
					value: '2016-12-25T00:00:00.000Z',
					expected: ['Entry 1'],
				},
			];

			testFilter('date', schema, collection, tests);

			it('should correctly test values using the "is" operator where the date is not in the RFC3339 format', function () {
				const filter = sieve.createFilter(schema, [
					{
						title: 'Date',
						field: 'date',
						operator: { label: 'is', slug: 'is' },
						// This is a RFC2882 formatted date
						value: 'Sun, 01 Jan 2017 08:49:26 +0000',
					},
				]);

				expectMatchesKeys(sieve.filter(filter, collection), ['Entry 1']);
			});
		});

		describe('boolean types', () => {
			const schema = {
				type: 'object',
				properties: {
					bool: {
						type: 'boolean',
					},
				},
			};

			const collection = {
				'Entry 1': {
					bool: true,
				},
				'Entry 2': {
					bool: false,
				},
				'Entry 3': {
					bool: null,
				},
				'Entry 4': {
					foo: 'bar',
				},
			};

			const tests = [
				{
					operator: { slug: 'is', label: 'is' },
					value: true,
					expected: ['Entry 1'],
				},
				{
					operator: { slug: 'is', label: 'is' },
					value: false,
					expected: ['Entry 2'],
				},
			];

			testFilter('bool', schema, collection, tests);
		});

		describe('number types', () => {
			const schema = {
				type: 'object',
				properties: {
					score: {
						type: 'number',
					},
				},
			};

			const collection = {
				'Entry 1': {
					score: 1.5,
				},
				'Entry 2': {
					score: 2.3,
				},
				'Entry 3': {
					score: 3.19,
				},
				'Entry 4': {
					score: null,
				},
				'Entry 5': {
					foo: 'bar',
				},
			};

			const tests = [
				{
					operator: { slug: 'is', label: 'is' },
					value: 1.5,
					expected: ['Entry 1'],
				},
				{
					operator: { slug: 'is_more_than', label: 'is more than' },
					value: 2.3,
					expected: ['Entry 3'],
				},
				{
					operator: { slug: 'is_less_than', label: 'is less than' },
					value: 3.19,
					expected: ['Entry 1', 'Entry 2'],
				},
			];

			testFilter('score', schema, collection, tests);
		});

		describe('enum types', () => {
			const schema = {
				type: 'object',
				properties: {
					category: {
						enum: ['Flame', 'Lizard', 'Seed'],
					},
				},
			};

			const collection = {
				'Entry 1': {
					category: 'Flame',
				},
				'Entry 2': {
					category: 'Lizard',
				},
				'Entry 3': {
					category: 'Seed',
				},
				'Entry 4': {
					category: null,
				},
				'Entry 5': {
					foo: 'bar',
				},
			};

			const tests = [
				{
					operator: { slug: 'is', label: 'is' },
					value: 'Flame',
					expected: ['Entry 1'],
				},
				{
					operator: { slug: 'is_not', label: 'is not' },
					value: 'Seed',
					expected: ['Entry 1', 'Entry 2', 'Entry 4', 'Entry 5'],
				},
			];

			testFilter('category', schema, collection, tests);
		});

		describe('oneOf types', () => {
			const schema = {
				type: 'object',
				properties: {
					nationality: {
						oneOf: [
							{
								title: 'Georgian',
								const: 'georgian',
							},
							{
								title: 'South African',
								const: 'south_african',
							},
							{
								title: 'New Zealand',
								const: 'new_zealand',
							},
						],
					},
				},
			};

			const collection = {
				'Entry 1': {
					nationality: 'georgian',
				},
				'Entry 2': {
					nationality: 'south_african',
				},
				'Entry 3': {
					nationality: 'south_african',
				},
				'Entry 4': {
					nationality: null,
				},
				'Entry 5': {
					nationality: 'new_zealand',
				},
			};

			const tests = [
				{
					operator: { slug: 'is', label: 'is' },
					value: 'new_zealand',
					expected: ['Entry 5'],
				},
				{
					operator: { slug: 'is_not', label: 'is not' },
					value: 'south_african',
					expected: ['Entry 1', 'Entry 4', 'Entry 5'],
				},
			];

			testFilter('nationality', schema, collection, tests);
		});

		describe('array types', () => {
			describe('where items are strings', () => {
				const schema = {
					type: 'object',
					properties: {
						category: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				};

				const collection = {
					'Entry 1': {
						category: ['Flame', 'Drop'],
					},
					'Entry 2': {
						category: ['Lizard'],
					},
					'Entry 3': {
						category: ['Seed'],
					},
					'Entry 4': {
						category: null,
					},
					'Entry 5': {
						foo: 'bar',
					},
				};

				const tests = [
					{
						operator: { slug: 'contains', label: 'contains' },
						value: 'Flame',
						expected: ['Entry 1'],
					},
					{
						operator: { slug: 'not_contains', label: 'does not contain' },
						value: 'Seed',
						expected: ['Entry 1', 'Entry 2'],
					},
				];

				testFilter(
					'category',
					schema,
					collection,
					tests,
					'{"x-ref-scheme": ["category"]}',
				);
				testFilter('category', schema, collection, tests);
			});

			describe('where items are numbers', () => {
				const schema = {
					type: 'object',
					properties: {
						category: {
							type: 'array',
							items: {
								type: 'number',
							},
						},
					},
				};

				const collection = {
					'Entry 1': {
						category: null,
					},
					'Entry 2': {
						foo: 9,
					},
					'Entry 3': {
						category: [1, 2, 3, 4, 5],
					},
				};

				const tests = [
					{
						operator: { slug: 'contains', label: 'contains' },
						value: 3,
						expected: ['Entry 3'],
					},
				];

				testFilter(
					'category',
					schema,
					collection,
					tests,
					'{"x-ref-scheme": ["category"]}',
				);
				testFilter('category', schema, collection, tests);
			});
		});

		describe('Full text search', () => {
			const schema = {
				type: 'object',
				properties: {
					version: {
						type: 'string',
					},
					description: {
						type: 'string',
					},
					brief: {
						type: 'string',
					},
				},
			} as any;

			const collection = {
				'Entry 1': {
					version: '1.5.0',
					description: 'Lorem ipsum',
					brief: 'dolor sit amet',
					incidents: 1,
				},
				'Entry 2': {
					version: '1.7.0',
					description: 'consectetur adipiscing elit',
					brief: 'Nulla condimentum',
					incidents: 2,
				},
				'Entry 3': {
					version: '2.0.0',
					description: 'eu mollis',
					brief: 'finibus lorem',
					incidents: 3,
				},
				'Entry 4': {
					foo: 'bar',
				},
			} as any;

			it('should correctly test values', function () {
				const filter = sieve.createFullTextSearchFilter(schema, 'Lorem');

				expectMatchesKeys(sieve.filter(filter, collection), [
					'Entry 1',
					'Entry 3',
				]);
			});

			it('should correctly test values using a nested schema', function () {
				const nestedSchema = {
					type: 'object',
					properties: {
						data: schema,
					},
				} as any;

				const nestedCollection = mapValues(collection, (value) => ({
					data: value,
				})) as any;

				const filter = sieve.createFullTextSearchFilter(nestedSchema, 'lorem');

				const result = sieve.filter(filter, nestedCollection);

				expectMatchesKeys(result, ['Entry 1', 'Entry 3']);
			});
		});

		describe('Filtering an array', () => {
			const schema = {
				type: 'object',
				properties: {
					test: {
						type: 'string',
					},
				},
			} as any;
			const collection = [
				{
					test: 'abcde',
					id: 1,
				},
				{
					test: 'fghij',
					id: 2,
				},
				{
					test: 'KLmno',
					id: 3,
				},
				{
					test: 'ABCde',
					id: 4,
				},
			];

			it('should return an array', function () {
				const filter = sieve.createFilter(schema, [
					{
						title: 'Test',
						field: 'test',
						operator: { label: 'contains', slug: 'contains' },
						value: 'abc',
					},
				]);

				const result = sieve.filter(filter, collection);
				expect(Array.isArray(result)).toBe(true);
			});

			it('should return the correct values', function () {
				const filter = sieve.createFilter(schema, [
					{
						title: 'Test',
						field: 'test',
						operator: { label: 'contains', slug: 'contains' },
						value: 'abc',
					},
				]);

				const result: any = sieve.filter(filter, collection);
				expect(result).toHaveLength(2);
				expect(result[0].test).toEqual(collection[0].test);
			});

			it('should allow an array of filters', function () {
				const filters = [
					sieve.createFilter(schema, [
						{
							title: 'Test',
							field: 'test',
							operator: { label: 'contains', slug: 'contains' },
							value: 'de',
						},
					]),
					sieve.createFilter(schema, [
						{
							title: 'Test',
							field: 'test',
							operator: { label: 'contains', slug: 'contains' },
							value: 'abc',
						},
					]),
				];

				const result: any = sieve.filter(filters, collection);
				expect(result).toHaveLength(2);
				expect(result[0].test).toEqual(collection[0].test);
			});
		});

		describe('Additional rules', () => {
			const schema = {
				type: 'object',
				properties: {
					version: {
						type: 'string',
					},
					description: {
						type: 'string',
					},
					brief: {
						type: 'string',
					},
					incidents: {
						type: 'number',
					},
				},
			} as any;

			const collection = {
				'Entry 1': {
					version: '1.5.0',
					description: 'Lorem ipsum',
					brief: 'dolor sit amet',
					incidents: 1,
				},
				'Entry 2': {
					version: '1.7.0',
					description: 'consectetur adipiscing elit',
					brief: 'Nulla condimentum',
					incidents: 2,
				},
				'Entry 3': {
					version: '2.0.0',
					description: 'eu mollis',
					brief: 'finibus lorem',
					incidents: 3,
				},
			} as any;

			it('should correctly combine additional rules', function () {
				const filter = sieve.createFilter(schema, [
					{
						title: 'Incidents',
						field: 'incidents',
						operator: { label: 'is', slug: 'is' },
						value: 1,
					},
					{
						title: 'Brief',
						field: 'brief',
						operator: { label: 'contains', slug: 'contains' },
						value: 'lorem',
					},
				]);

				expectMatchesKeys(sieve.filter(filter, collection), [
					'Entry 1',
					'Entry 3',
				]);
			});
		});
	});

	describe('.createFullTextSearchFilter()', () => {
		const ajv = new Ajv();
		ajvKeywords(ajv, ['regexp', 'formatMaximum', 'formatMinimum']);

		it('should create a valid JSON schema', () => {
			const schema = {
				type: 'object',
				properties: {
					text: { type: 'string' },
					number: { type: 'number' },
				},
			} as any;

			const filter = sieve.createFullTextSearchFilter(schema, 'test');
			expect(ajv.compile(filter)).not.toThrow();
		});

		it('should create a valid JSON schema with number type', () => {
			const schema = {
				type: 'object',
				properties: {
					number: { type: 'number' },
				},
			} as any;

			const filter = sieve.createFullTextSearchFilter(schema, '5');
			expect(ajv.compile(filter)).not.toThrow();
		});

		it('should work when "type" is string or an array of strings', () => {
			const schema = {
				type: 'object',
				properties: {
					foo: { type: ['string', 'null'] },
					bar: { type: 'string' },
				},
			} as any;

			const value = {
				foo: 'test',
				bar: 'baz',
			};

			const filter = sieve.createFullTextSearchFilter(schema, 'test');
			expect(ajv.validate(filter, value)).toBe(true);
		});

		it('should work when "type" is number or an array of numbers', () => {
			const schema = {
				type: 'object',
				properties: {
					foo: { type: ['number', 'null'] },
					bar: { type: 'number' },
					foobar: { type: 'string' },
				},
			} as any;

			const value = [{ baz: 55 }, { bar: 8 }, { foobar: 'test-8' }];

			const filter = sieve.createFullTextSearchFilter(schema, '8');
			expect(sieve.filter(filter, value)).toHaveLength(2);
		});

		it('should work when "type" is number or an array of numbers', () => {
			const schema = {
				type: 'object',
				properties: {
					foo: { type: ['number', 'null'] },
					bar: { type: 'number' },
				},
			} as any;

			const value = {
				foo: 55,
				bar: 9,
			};

			const filter = sieve.createFullTextSearchFilter(schema, '55');
			expect(ajv.validate(filter, value)).toBe(true);
		});
	});

	describe('.createFilter()', () => {
		const schema = {
			type: 'object',
			properties: {
				string: { type: 'string' },
				number: { type: 'number' },
				boolean: { type: 'boolean' },
				'date-time': {
					type: 'string',
					format: 'date-time',
				},
				object: {
					type: 'object',
					properties: {
						tag_name: {
							description: 'key',
							type: 'string',
						},
						tag_value: {
							description: 'value',
							type: 'string',
						},
					},
				},
				enum: {
					enum: ['foo', 'bar', 'baz'],
				},
				array: {
					type: 'array',
					items: {
						type: 'string',
					},
				},
			},
		} as any;

		// Run test for each operator for each type declared in the schema
		Object.keys(schema.properties).forEach((type) => {
			const operators = sieve.getOperators(schema, type);

			operators.forEach((operator) => {
				it(`should create a filter for the '${type}' type using operator '${operator.slug}'`, () => {
					const result = sieve.createFilter(schema, [
						{
							title: type,
							field: type,
							operator,
							value: 'test',
						},
					]);

					expectMatchesKeys(result, ['$id', 'anyOf']);
				});
			});
		});
	});

	describe('.getOperators()', () => {
		const schema = {
			type: 'object',
			properties: {
				string: { type: 'string' },
				number: { type: 'number' },
				boolean: { type: 'boolean' },
				'date-time': {
					type: 'string',
					format: 'date-time',
				},
				object: {
					type: 'object',
					properties: {
						tag_name: {
							description: 'key',
							type: 'string',
						},
						tag_value: {
							description: 'value',
							type: 'string',
						},
					},
				},
				enum: {
					enum: ['foo', 'bar', 'baz'],
				},
			},
		} as any;

		// Run test for each type declared in the schema
		Object.keys(schema.properties).forEach((type) => {
			it(`should return an array of operators for the '${type}' type`, () =>
				sieve
					.getOperators(schema, type)
					.forEach((operator: any) =>
						expectMatchesKeys(operator, ['slug', 'label']),
					));
		});
	});
});
