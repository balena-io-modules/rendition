import * as React from 'react';
import { forEach, keys, pick, get, isEqual, isArray } from 'lodash';
import jsone from 'json-e';
import ajv from 'ajv';
import asRendition from '../../asRendition';
import {
	DefaultProps,
	RenditionSystemProps,
	Theme,
	Tooltip,
} from '../../common-types';
import { Flex } from '../../components/Flex';
import Alert from '../../components/Alert';
import widgets, { WidgetWrapperUiOptions, WidgetMeta } from './widgets';
import { Value, JSONSchema, UiSchema, Format } from './types';

interface WrapperProp extends Tooltip {
	children: React.ReactNode;
}

const Wrapper = ({ tooltip, children, ...props }: WrapperProp) => (
	<Flex
		tooltip={tooltip}
		minWidth={0}
		minHeight={0}
		alignItems="flex-start"
		mb={1}
		flexDirection="column"
		{...props}
	>
		{children}
	</Flex>
);

export const getValue = (value?: Value, uiSchema?: UiSchema) => {
	return get(uiSchema, 'ui:value', value);
};

export const getType = (value?: Value) => {
	if (value === undefined) {
		return 'default';
	}
	if (value === null) {
		return 'null';
	}
	return isArray(value) ? 'array' : typeof value;
};

export const getWidget = (value?: Value, uiSchemaWidget?: string) => {
	const typeWidgets = get(widgets, getType(value), widgets.default);
	return get(typeWidgets, uiSchemaWidget || 'default', widgets.default.default);
};

const processValue = ({
	value,
	uiSchema,
}: Pick<InternalJsonSchemaRendererProps, 'value' | 'uiSchema'>) => {
	return getValue(value, uiSchema);
};

class JsonSchemaRenderer extends React.PureComponent<
	ThemedJsonSchemaRendererProps,
	JsonSchemaRendererState
> {
	validator: ajv.Ajv;
	validateFn: ajv.ValidateFunction;

	constructor(props: ThemedJsonSchemaRendererProps) {
		super(props);
		this.state = {
			error: null,
			validationErrors: null,
		};
		this.validator = new ajv();

		forEach(props.extraFormats, ({ name, format }) => {
			this.validator.addFormat(name, format);
		});
	}

	componentDidMount() {
		if (this.props.validate && !this.props.nested) {
			this.validate(true);
		}
	}

	componentDidUpdate(prevProps: ThemedJsonSchemaRendererProps) {
		if (this.props.validate) {
			const schemaChanged = !isEqual(prevProps.schema, this.props.schema);
			if (
				!this.props.nested &&
				(!isEqual(prevProps.value, this.props.value) || schemaChanged)
			) {
				this.validate(schemaChanged);
			}
		}
	}

	componentDidCatch(error: any) {
		this.setState({ error });
	}

	validate(compile: boolean = false) {
		try {
			if (compile) {
				this.validateFn = this.validator.compile(this.props.schema);
			}
			const isValid = this.validateFn(this.props.value);
			if (!isValid) {
				console.error(
					`JsonSchemaRenderer: Validation errors:\n${this.validator.errorsText(
						this.validateFn.errors,
					)}`,
				);
				this.setState({
					validationErrors: this.validateFn.errors,
				});
			} else {
				this.setState({
					validationErrors: null,
				});
			}
		} catch (error) {
			this.setState({
				error,
			});
		}
	}

	render() {
		const { value, schema, uiSchema = {}, ...props } = this.props;
		const { error, validationErrors } = this.state;

		const wrapperProps = pick(
			get(uiSchema, 'ui:options', {}),
			...keys(WidgetWrapperUiOptions),
		);

		if (error) {
			return (
				<Wrapper {...props} {...wrapperProps}>
					<Alert
						my={2}
						plaintext
						danger
						tooltip={get(error, 'message', error.toString())}
					>
						Error processing JSON data
					</Alert>
				</Wrapper>
			);
		}

		if (uiSchema === null) {
			return null;
		}
		const processedUiSchema = jsone(uiSchema, { source: value });
		const processedValue = processValue({
			value,
			uiSchema: processedUiSchema,
		});
		if (processedValue === undefined || processedValue === null) {
			return null;
		}
		const Widget = getWidget(processedValue, processedUiSchema['ui:widget']);
		return (
			<Wrapper {...props} {...wrapperProps}>
				{validationErrors && (
					<Alert
						my={2}
						plaintext
						danger
						tooltip={this.validator.errorsText(validationErrors)}
					>
						Invalid data/schema
					</Alert>
				)}
				<WidgetMeta schema={schema} uiSchema={uiSchema} />
				<Widget
					value={processedValue}
					schema={schema}
					uiSchema={processedUiSchema}
				/>
			</Wrapper>
		);
	}
}

interface JsonSchemaRendererState {
	error: Error | null;
	validationErrors: ajv.ErrorObject[] | null | undefined;
}

interface ThemedJsonSchemaRendererProps
	extends InternalJsonSchemaRendererProps {
	theme: Theme;
}

interface InternalJsonSchemaRendererProps extends DefaultProps {
	nested?: boolean;
	validate?: boolean;
	value?: Value;
	schema: JSONSchema;
	uiSchema?: UiSchema;
	extraFormats?: Format[];
}

export type JsonSchemaRendererProps = InternalJsonSchemaRendererProps &
	RenditionSystemProps;

export default asRendition<React.FunctionComponent<JsonSchemaRendererProps>>(
	JsonSchemaRenderer,
);
