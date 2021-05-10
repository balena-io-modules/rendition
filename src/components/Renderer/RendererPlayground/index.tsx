import * as React from 'react';
import keys from 'lodash/keys';
import get from 'lodash/get';
import escapeRegExp from 'lodash/escapeRegExp';
import filter from 'lodash/filter';
import memoize from 'lodash/memoize';
import JsonSchema7Schema from 'ajv/lib/refs/json-schema-draft-07.json';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import asRendition from '../../../asRendition';
import { RenditionSystemProps, Theme } from '../../../common-types';
import { Flex } from '../../Flex';
import { Box } from '../../Box';
import { Card } from '../../Card';
import { Select } from '../../Select';
import { Button } from '../../Button';
import { Heading } from '../../Heading';
import { Checkbox } from '../../Checkbox';
import { Renderer } from '../index';
import { Value, JSONSchema, UiSchema } from '../types';
import { CONTEXT_FUNCTIONS, EXTRA_FORMATS } from '../examples';
import JsonEditor from './JsonEditor';
import { generateUiSchemaMetaSchema } from './util';

const SlimCard = styled(Card)`
	& > div {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
`;

const ResultCard = styled(SlimCard)`
	& > div > div:last-child {
		display: flex;
	}
`;

const EditCard = styled(SlimCard)`
	& > div > div {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
`;

const defaultJsonProps = { value: {}, schema: {}, uiSchema: {} };
const defaultRegExp = new RegExp('');
const getExampleNames = memoize((examples) => keys(examples));

const commonCardProps = {
	small: true,
	backgroundColor: 'quartenary.light',
};

const RendererPlaygroundBase = ({
	title = 'JSON Playground',
	examples,
	...props
}: ThemedRendererPlaygroundProps) => {
	const [validate, setValidate] = React.useState<boolean>(true);
	const [selectedExample, setSelectedExample] = React.useState<string>('');
	const [searchTermRegExp, setSearchTermRegExp] =
		React.useState<RegExp>(defaultRegExp);

	const [value, setValue] = React.useState<Value>({});
	const [schema, setSchema] = React.useState<object>({});
	const [uiSchema, setUiSchema] = React.useState<object>({});

	const [isValueJsonValid, setIsValueJsonValid] = React.useState<boolean>(true);
	const [isSchemaJsonValid, setIsSchemaJsonValid] =
		React.useState<boolean>(true);
	const [isUiSchemaJsonValid, setIsUiSchemaJsonValid] =
		React.useState<boolean>(true);

	const reset = React.useCallback(() => {
		setSelectedExample('');
		setSearchTermRegExp(defaultRegExp);
	}, [setSelectedExample, setSearchTermRegExp]);

	const onValueStrChange = React.useCallback((valueStr: string) => {
		try {
			setValue(JSON.parse(valueStr));
			setIsValueJsonValid(true);
		} catch {
			setIsValueJsonValid(false);
		}
	}, []);

	const onSchemaStrChange = React.useCallback((schemaStr: string) => {
		try {
			setSchema(JSON.parse(schemaStr));
			setIsSchemaJsonValid(true);
		} catch {
			setIsSchemaJsonValid(false);
		}
	}, []);

	const onUiSchemaStrChange = React.useCallback((uiSchemaStr: string) => {
		try {
			setUiSchema(JSON.parse(uiSchemaStr));
			setIsUiSchemaJsonValid(true);
		} catch {
			setIsUiSchemaJsonValid(false);
		}
	}, []);

	React.useEffect(() => {
		const example = get(examples, selectedExample, defaultJsonProps);
		setValue(example.value);
		setSchema(example.schema);
		setUiSchema(example.uiSchema);
		setSearchTermRegExp(defaultRegExp);
	}, [selectedExample]);

	const uiSchemaMetaSchema = React.useMemo(() => {
		try {
			const newMetaSchema = generateUiSchemaMetaSchema({
				value,
				schema,
				uiSchema,
				extraContext: {
					...CONTEXT_FUNCTIONS,
					root: value,
				},
			});
			return newMetaSchema;
		} catch (error) {
			console.error('Failed to parse schemas', error);
			throw new Error('Failed to parse schemas');
		}
	}, [uiSchema, schema, value]);

	const valueStr = React.useMemo<string>(
		() => JSON.stringify(value, null, 2),
		[value],
	);
	const schemaStr = React.useMemo<string>(
		() => JSON.stringify(schema, null, 2),
		[schema],
	);
	const uiSchemaStr = React.useMemo<string>(
		() => JSON.stringify(uiSchema, null, 2),
		[uiSchema],
	);

	const unfilteredExampleNames = getExampleNames(examples);
	const exampleNames = searchTermRegExp.source
		? filter(unfilteredExampleNames, (name) => searchTermRegExp.test(name))
		: unfilteredExampleNames;

	return (
		<Flex p={3} {...props}>
			<Flex flex="1 1 50%" minWidth={0} flexDirection="column" pr={2}>
				<Flex mb={3} alignItems="center" justifyContent="space-between">
					<Heading.h3>{title}</Heading.h3>
					<Flex ml={3} alignItems="center" justifyContent="flex-end" flex={1}>
						<Box flex={1}>
							<Select
								placeholder="Load an example..."
								emptySearchMessage="No results"
								searchPlaceholder="Search..."
								onSearch={(s) =>
									setSearchTermRegExp(new RegExp(escapeRegExp(s), 'i'))
								}
								value={selectedExample}
								options={exampleNames}
								onChange={({ option }) => {
									setSelectedExample(option as string);
								}}
							/>
						</Box>
						<Button
							ml={2}
							tooltip={{ text: 'Reset', placement: 'right' }}
							icon={<FontAwesomeIcon icon={faUndo} />}
							onClick={reset}
						/>
					</Flex>
				</Flex>
				<EditCard flex={1} {...commonCardProps}>
					<JsonEditor
						title="Data"
						value={valueStr}
						onChange={onValueStrChange}
						schema={schema}
						isValid={isValueJsonValid}
					/>
					<JsonEditor
						title="Schema"
						value={schemaStr}
						onChange={onSchemaStrChange}
						schema={JsonSchema7Schema}
						isValid={isSchemaJsonValid}
					/>
					<JsonEditor
						title="UI Schema"
						value={uiSchemaStr}
						onChange={onUiSchemaStrChange}
						schema={uiSchemaMetaSchema}
						isValid={isUiSchemaJsonValid}
					/>
				</EditCard>
			</Flex>
			<Flex flex="1 1 50%" minWidth={0} flexDirection="column" pl={2}>
				<ResultCard
					flex={1}
					{...commonCardProps}
					title="Result"
					cta={
						<Checkbox
							checked={validate}
							label="Validate"
							onChange={(e) => setValidate(e.target.checked)}
						/>
					}
				>
					<Renderer
						value={value}
						schema={schema}
						uiSchema={uiSchema}
						p={2}
						pb={1}
						validate={validate}
						backgroundColor="#fff"
						extraFormats={EXTRA_FORMATS}
						extraContext={{
							...CONTEXT_FUNCTIONS,
							root: value,
						}}
					/>
				</ResultCard>
			</Flex>
		</Flex>
	);
};

interface InternalRendererPlaygroundProps
	extends React.HTMLAttributes<HTMLElement> {
	title?: string;
	examples?: {
		[key: string]: {
			value: Value;
			schema: JSONSchema;
			uiSchema: UiSchema;
		};
	};
}

interface ThemedRendererPlaygroundProps
	extends InternalRendererPlaygroundProps {
	theme: Theme;
}

export type RendererPlaygroundProps = InternalRendererPlaygroundProps &
	RenditionSystemProps;

/** [View stories source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Renderer/Renderer.stories.tsx) */
export const RendererPlayground = asRendition<
	React.FunctionComponent<RendererPlaygroundProps>
>(RendererPlaygroundBase);
