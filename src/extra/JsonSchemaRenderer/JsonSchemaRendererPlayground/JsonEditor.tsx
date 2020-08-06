import * as React from 'react';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { Flex } from '../../../components/Flex';
import { Box } from '../../../components/Box';
import Heading from '../../../components/Heading';
import { Value } from '../types';

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

interface JsonEditorProps {
	title: string;
	value: Value;
	onChange: (value: object) => void;
	schema?: any;
}

const JsonEditor = ({ title, value, onChange, schema }: JsonEditorProps) => {
	const [valueJson, setValueJson] = React.useState(value);
	const [valueStr, setValueStr] = React.useState(JSON.stringify(value));
	const [isJsonValid, setIsJsonValid] = React.useState(true);

	const fileName = `file:///${title}.json`;
	const fileUri = monacoEditor.Uri.parse(fileName);

	// Try to parse the JSON whenever the editor's content is updated
	React.useEffect(() => {
		try {
			const json = JSON.parse(valueStr);
			setIsJsonValid(true);
			setValueJson(json);
			onChange(json);
		} catch {
			setIsJsonValid(false);
		}
	}, [valueStr]);

	// Update the editor's value if we are passed a new value
	React.useEffect(() => {
		if (!isEqual(value, valueJson)) {
			setValueStr(JSON.stringify(value, null, 2));
		}
	}, [value]);

	// Update the editor's schemas when the schema prop changes
	React.useEffect(() => {
		if (schema) {
			const thisSchema = {
				uri: schema['$schema'] || fileUri.toString(),
				fileMatch: [fileUri.toString()],
				schema,
			};
			const schemas = cloneDeep(
				get(
					monacoEditor,
					[
						'languages',
						'json',
						'jsonDefaults',
						'diagnosticsOptions',
						'schemas',
					],
					[],
				),
			) as any[];

			const existingSchemaIndex = findIndex(schemas, { uri: thisSchema.uri });
			if (existingSchemaIndex !== -1) {
				schemas.splice(existingSchemaIndex, 1, thisSchema);
			} else {
				schemas.push(thisSchema);
			}
			monacoEditor.languages.json.jsonDefaults.setDiagnosticsOptions({
				validate: true,
				schemas,
			});
		}
	}, [schema]);

	const model =
		monacoEditor.editor.getModel(fileUri) ||
		monacoEditor.editor.createModel(valueStr, 'json', fileUri);
	model.updateOptions({ tabSize: 2 });

	const options = { ...defaultOptions, model };

	return (
		<Flex flex="1 1 0" flexDirection="column">
			<Flex justifyContent="space-between" alignItems="center">
				{title && <Heading.h5>{title}</Heading.h5>}
				<ValidationBox
					hasError={!isJsonValid}
					tooltip={`JSON is ${isJsonValid ? 'valid' : 'invalid'}`}
				>
					<FontAwesomeIcon
						icon={isJsonValid ? faCheckCircle : faExclamationCircle}
					/>
				</ValidationBox>
			</Flex>
			<EditorWrapper flex={1} mb={2} isValid={isJsonValid}>
				<MonacoEditor
					language="json"
					theme="vs"
					height="100%"
					options={options}
					value={valueStr}
					onChange={setValueStr}
				/>
			</EditorWrapper>
		</Flex>
	);
};

export default JsonEditor;
