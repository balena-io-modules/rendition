import * as React from 'react';
import { keys, get, escapeRegExp, filter } from 'lodash';
import JsonSchema7Schema from 'ajv/lib/refs/json-schema-draft-07.json';
import jsone from 'json-e';
import styled from 'styled-components';
import { px } from 'styled-system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import asRendition from '../../../asRendition';
import {
	DefaultProps,
	RenditionSystemProps,
	Theme,
} from '../../../common-types';
import { Flex } from '../../../components/Flex';
import Card from '../../../components/Card';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import Heading from '../../../components/Heading';
import JsonSchemaRenderer, { JsonSchemaRendererProps } from '../index';
import { Format, Value, JSONSchema, UiSchema } from '../types';
import JsonEditor from './JsonEditor';
import { generateUiSchemaMetaSchema } from './util';

const EXTRA_FORMATS: Format[] = [
	{
		name: 'markdown',
		format: '.*',
	},
];

const SlimCard = styled(Card)`
	flex: 1;
	padding: ${(props) => px(props.theme.space[3])};
	background-color: ${(props) => props.theme.colors.quartenary.light};
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

const ExampleSelect = styled(Select)`
	flex: 1;
`;

const defaultJsonProps = { value: {}, schema: {}, uiSchema: {} };
const defaultRegExp = new RegExp('');

const JsonSchemaRendererPlayground = ({
	title = 'JSON Playground',
	examples,
	...props
}: ThemedJsonSchemaRendererPlaygroundProps) => {
	const [selectedExample, setSelectedExample] = React.useState<string>('');
	const [searchTermRegExp, setSearchTermRegExp] = React.useState<RegExp>(
		defaultRegExp,
	);

	const [value, setValue] = React.useState<Value>({});
	const [schema, setSchema] = React.useState<object>({});
	const [uiSchema, setUiSchema] = React.useState<object>({});

	const [uiSchemaMetaSchema, setUiSchemaMetaSchema] = React.useState<object>(
		{},
	);

	const [jsonProps, setJsonProps] = React.useState<JsonSchemaRendererProps>(
		defaultJsonProps,
	);

	const onRefresh = () => {
		setJsonProps({ value, schema, uiSchema });
	};

	const reset = () => {
		setSelectedExample('');
		setSearchTermRegExp(defaultRegExp);
	};

	React.useEffect(() => {
		const example = get(examples, selectedExample, defaultJsonProps);
		setValue(example.value || {});
		setSchema(example.schema);
		setUiSchema(example.uiSchema);
		setSearchTermRegExp(defaultRegExp);
	}, [selectedExample]);

	React.useEffect(() => {
		try {
			const processedUiSchema = jsone(uiSchema, { source: value });
			const newMetaSchema = generateUiSchemaMetaSchema({
				value,
				schema,
				uiSchema: processedUiSchema,
			});
			setUiSchemaMetaSchema(newMetaSchema);
			onRefresh();
		} catch (error) {
			console.error('Failed to parse schemas', error);
		}
	}, [uiSchema, schema, value]);

	let exampleNames = keys(examples);
	if (searchTermRegExp.source) {
		exampleNames = filter(exampleNames, (name) => searchTermRegExp.test(name));
	}

	return (
		<Flex p={3} {...props}>
			<Flex flex="1 1 50%" minWidth={0} flexDirection="column" pr={2}>
				<Flex mb={3} alignItems="center" justifyContent="space-between">
					<Heading.h3>{title}</Heading.h3>
					<Flex ml={3} alignItems="center" justifyContent="flex-end" flex={1}>
						<ExampleSelect
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
						<Button
							ml={2}
							tooltip={{ text: 'Reset', placement: 'right' }}
							icon={<FontAwesomeIcon icon={faUndo} />}
							onClick={reset}
						/>
					</Flex>
				</Flex>
				<EditCard small>
					<JsonEditor
						title="Data"
						value={value}
						onChange={setValue}
						schema={schema}
					/>
					<JsonEditor
						title="Schema"
						value={schema}
						onChange={setSchema}
						schema={JsonSchema7Schema}
					/>
					<JsonEditor
						title="UI Schema"
						value={uiSchema}
						onChange={setUiSchema}
						schema={uiSchemaMetaSchema}
					/>
				</EditCard>
			</Flex>
			<Flex flex="1 1 50%" minWidth={0} flexDirection="column" pl={2}>
				<ResultCard small title="Result">
					<JsonSchemaRenderer
						{...jsonProps}
						p={2}
						pb={1}
						validate
						backgroundColor="#fff"
						extraFormats={EXTRA_FORMATS}
					/>
				</ResultCard>
			</Flex>
		</Flex>
	);
};

interface InternalJsonSchemaRendererPlaygroundProps extends DefaultProps {
	title?: string;
	examples?: {
		[key: string]: {
			value: Value;
			schema: JSONSchema;
			uiSchema: UiSchema;
		};
	};
}

interface ThemedJsonSchemaRendererPlaygroundProps
	extends InternalJsonSchemaRendererPlaygroundProps {
	theme: Theme;
}

export type JsonSchemaRendererPlaygroundProps = InternalJsonSchemaRendererPlaygroundProps &
	RenditionSystemProps;

export default asRendition<
	React.FunctionComponent<JsonSchemaRendererPlaygroundProps>
>(JsonSchemaRendererPlayground);
