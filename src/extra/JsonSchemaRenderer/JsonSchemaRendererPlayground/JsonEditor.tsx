import * as React from 'react';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { Flex } from '../../../components/Flex';
import { Box } from '../../../components/Box';
import { Heading } from '../../../components/Heading';

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

const defaultOptions: MonacoEditorProps['options'] = {
	minimap: {
		enabled: false,
	},
	lineNumbers: 'off',
	tabSize: 2,
	detectIndentation: false,
	selectOnLineNumbers: true,
};

const monacoEditorSchemas = cloneDeep(
	get(
		monacoEditor,
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

const getModel = (fileUri: monacoEditor.Uri, valueStr: string) => {
	const model =
		monacoEditor.editor.getModel(fileUri) ||
		monacoEditor.editor.createModel(valueStr, 'json', fileUri);
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
	const fileName = `file:///${title}.json`;
	const fileUri = monacoEditor.Uri.parse(fileName);

	const [model, setModel] = React.useState<monacoEditor.editor.ITextModel>(
		getModel(fileUri, value),
	);

	// Update the model when the value changes
	React.useEffect(() => {
		setModel(getModel(fileUri, value));
	}, [title, value]);

	// Update the editor's schemas when the schema prop changes
	React.useEffect(() => {
		if (!schema) {
			return;
		}
		const thisSchema = {
			uri: schema['$schema'] || fileUri.toString(),
			fileMatch: [fileUri.toString()],
			schema,
		};

		const existingSchemaIndex = findIndex(monacoEditorSchemas, {
			uri: thisSchema.uri,
		});
		if (existingSchemaIndex !== -1) {
			monacoEditorSchemas.splice(existingSchemaIndex, 1, thisSchema);
		} else {
			monacoEditorSchemas.push(thisSchema);
		}
		monacoEditor.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: monacoEditorSchemas,
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
				<MonacoEditor
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
