import * as React from 'react';
import Editor, { Monaco, EditorProps, useMonaco } from '@monaco-editor/react';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { Flex } from '../../Flex';
import { Box } from '../../Box';
import { Heading } from '../../Heading';

const EditorWrapper = styled(Flex)<{ isValid: boolean }>`
	border: 1px solid
		${(props) => {
			return props.isValid
				? props.theme.colors.quartenary.main
				: props.theme.colors.danger.main;
		}};
`;

const ValidationBox = styled(Box)<{ hasError: boolean }>`
	color: ${(props) =>
		props.hasError
			? props.theme.colors.danger.main
			: props.theme.colors.success.main};
`;

const defaultOptions: EditorProps['options'] = {
	minimap: {
		enabled: false,
	},
	lineNumbers: 'off',
	tabSize: 2,
	detectIndentation: false,
	selectOnLineNumbers: true,
};

const monacoEditorSchemas = (monaco: Monaco) =>
	cloneDeep(
		get(
			monaco,
			['languages', 'json', 'jsonDefaults', 'diagnosticsOptions', 'schemas'],
			[],
		),
	) as any[];

interface JsonEditorProps {
	title: string;
	value: string;
	onChange: (value: string) => void;
	schema?: any;
	isValid: boolean;
}

const getModel = (
	valueStr: string,
	fileUri?: ReturnType<Monaco['Uri']['file']>,
	monaco?: Monaco | null,
) => {
	if (!monaco || !fileUri) {
		return null;
	}
	const model =
		monaco?.editor.getModel(fileUri) ||
		monaco?.editor.createModel(valueStr, 'json', fileUri);
	model.updateOptions({ tabSize: 2 });
	return model;
};

const JsonEditor = ({
	title,
	value,
	onChange,
	schema,
	isValid,
}: JsonEditorProps) => {
	const monaco = useMonaco();

	const fileName = `file:///${title}.json`;
	const fileUri = monaco?.Uri.parse(fileName);

	const [model, setModel] = React.useState<ReturnType<
		Monaco['editor']['getModel']
	> | null>(getModel(value, fileUri, monaco));

	// Update the model when the value changes
	React.useEffect(() => {
		if (monaco) {
			setModel(getModel(value, fileUri, monaco));
		}
	}, [title, value]);

	// Update the editor's schemas when the schema prop changes
	React.useEffect(() => {
		if (!schema || !monaco) {
			return;
		}
		const thisSchema = {
			uri: schema['$schema'] || fileUri?.toString(),
			fileMatch: [fileUri?.toString()],
			schema,
		};
		const editorSchemas = monacoEditorSchemas(monaco);
		const existingSchemaIndex = findIndex(editorSchemas, {
			uri: thisSchema.uri,
		});
		if (existingSchemaIndex !== -1) {
			editorSchemas.splice(existingSchemaIndex, 1, thisSchema);
		} else {
			editorSchemas.push(thisSchema);
		}
		monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: editorSchemas,
		});
	}, [schema]);

	return (
		<Flex flex="1 1 100px" flexDirection="column">
			<Flex justifyContent="space-between" alignItems="center">
				{title && <Heading.h5>{title}</Heading.h5>}
				<ValidationBox
					hasError={!isValid}
					tooltip={`JSON is ${isValid ? 'valid' : 'invalid'}`}
				>
					<FontAwesomeIcon
						icon={isValid ? faCheckCircle : faExclamationCircle}
					/>
				</ValidationBox>
			</Flex>
			<EditorWrapper flex={1} mb={2} isValid={isValid}>
				<Editor
					language="json"
					theme="vs"
					height="100%"
					options={{ ...defaultOptions, model }}
					value={value}
					onChange={onChange}
				/>
			</EditorWrapper>
		</Flex>
	);
};

export default JsonEditor;
