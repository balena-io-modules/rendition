import * as React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Box, Flex, Txt } from '../..';
import { Markdown } from '../../extra/Markdown';
import { MermaidWidget } from '../../extra/Form/mermaid';
import { MarkdownWidget } from '../../extra/Form/markdown';
import { CaptchaWidget } from '../../extra/Form/captcha';
import { Form, FormProps } from '.';

// Register the extra format widgets to the Form component
Form.registerWidget('markdown', MarkdownWidget);
Form.registerWidget('mermaid', MermaidWidget);
Form.registerWidget('captcha', CaptchaWidget);

// Any valid key would work in order to show the captcha in the story.
// @ts-ignore
window.RECAPTCHA_V2_API_KEY = '6Ld-faYUAAAAAF92j1FX-GgG0uNPbw9sCCmnbJ2D';

// @ts-ignore
import zxcvbn from 'zxcvbn';
// @ts-ignore
window.zxcvbn = zxcvbn;

const extraWidgetsReadme = `
# Extra widgets
Additional widgets for handling different formats can be registered using the \`Form.registerWidget\` method.
Rendition contains widgets for rendering Markdown and Mermaid text formats that can be used in the following way:
\`\`\`js
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Form } from 'rendition'
import { MermaidWidget } from 'rendition/dist/components/Form/mermaid'
import { MarkdownWidget } from 'rendition/dist/components/Form/markdown'

// Register the extra format widgets to the Form component
Form.registerWidget('markdown', MarkdownWidget)
Form.registerWidget('mermaid', MermaidWidget)

const schema = {
  type: 'object',
  properties: {
    Markdown: {
      format: 'markdown',
      type: 'string'
    },
    Mermaid: {
      format: 'mermaid',
      type: 'string'
    }
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Form schema={schema} />, rootElement)
\`\`\`
`;

const basicPokedexSchema = {
	type: 'object',
	title: 'Pokèmon',
	properties: {
		Name: {
			type: 'string',
			minLength: 5,
			examples: ['Pikachu', 'Snorlax', 'Charmander', 'Bulbasaur'],
		},
		Height: {
			type: 'number',
		},
		Weight: {
			type: 'number',
		},
		Description: {
			type: 'string',
		},
		Category: {
			type: 'string',
			maxLength: 20,
		},
		Abilities: {
			type: 'string',
		},
		pokedex_number: {
			title: 'National Pokèdex Number',
			type: 'number',
		},
		caught: {
			type: 'boolean',
		},
		first_seen: {
			title: 'First seen',
			description: 'The first time you saw this pokèmon',
			type: 'string',
			format: 'date-time',
		},
		poke_password: {
			title: 'Poke Password',
			description: "Password to access the pokèmon's abilities",
			type: 'string',
		},
		environment: {
			type: 'string',
			oneOf: [
				{
					const: 'earth',
					title: 'Earth',
				},
				{
					const: 'water',
					title: 'Water',
				},
				{
					const: 'fire',
					title: 'Fire',
				},
			],
		},
		tags: {
			title: 'Tags',
			description: 'Add useful tags to your pokèmon',
			type: 'array',
			items: {
				type: 'string',
			},
		},
	},
};

const basicPokedexUiSchema = {
	'ui:order': ['Name', 'caught', 'Description', 'Abilities', '*'],
	Name: {
		'ui:autocomplete': 'on',
	},
	poke_password: {
		'ui:widget': 'password',
		'ui:options': {
			showPasswordStrengthMeter: true,
		},
	},
	Height: {
		'ui:options': {
			emphasized: true,
		},
	},
	environment: {
		'ui:options': {
			emphasized: true,
		},
	},
	Description: {
		'ui:widget': 'textarea',
		'ui:options': {
			rows: 5,
		},
	},
};

const FormDemo = (props: FormProps) => {
	const [data, setData] = React.useState(props.value ?? {});

	return (
		<Flex>
			<Box flex="1" m={30}>
				<Form
					onFormChange={({ formData }: any) => setData(formData)}
					value={data}
					{...props}
				/>
			</Box>
			<Box flex="1" maxWidth="50%" p={30}>
				<Txt monospace>
					<pre>{JSON.stringify(data, null, 4)}</pre>
				</Txt>
			</Box>
		</Flex>
	);
};

export default {
	title: 'Core/Form',
	component: Form,
} as Meta;

const Template = createTemplate<FormProps>(FormDemo);

export const Default = createStory<FormProps>(Template, {
	schema: basicPokedexSchema,
});

export const HiddenSubmit = createStory<FormProps>(Template, {
	schema: basicPokedexSchema,
	hideSubmitButton: true,
});

export const SecondaryAction = createStory<FormProps>(Template, {
	schema: basicPokedexSchema,
	secondaryButtonProps: { children: 'Skip' },
});

export const Disabled = createStory<FormProps>(Template, {
	schema: basicPokedexSchema,
	disabled: true,
});

export const CustomSubmitText = createStory<FormProps>(Template, {
	schema: basicPokedexSchema,
	submitButtonText: 'Save',
});

export const WithUiSchema = createStory<FormProps>(Template, {
	schema: basicPokedexSchema,
	uiSchema: basicPokedexUiSchema,
	formData: {
		poke_password: 'Secret password',
	},
});

export const WithWarning = createStory<FormProps>(Template, {
	schema: basicPokedexSchema,
	uiSchema: {
		...basicPokedexUiSchema,
		Name: {
			'ui:warning': 'Once the `Name` is set it cannot be changed',
		},
	},
});

export const WithHelpText = createStory<FormProps>(Template, {
	schema: basicPokedexSchema,
	uiSchema: {
		...basicPokedexUiSchema,
		Name: {
			'ui:help': 'Once the `Name` is set it cannot be changed',
		},
	},
});

export const WithTitles = createStory<FormProps>(Template, {
	schema: {
		type: 'object',
		title: 'Networking',
		properties: {
			vpn: {
				type: 'object',
				title: 'Virtual Private Network',
				properties: {
					endpoint: {
						title: 'Endpoint',
						type: 'string',
					},
					certificate: {
						title: 'Certificate',
						type: 'string',
					},
				},
			},
			wifiNetwork: {
				type: 'object',
				title: 'WiFi Network',
				properties: {
					wifi: {
						type: 'object',
						properties: {
							ssid: {
								title: 'Network SSID',
								type: 'string',
							},
						},
					},
					wifiSecurity: {
						type: 'object',
						properties: {
							psk: {
								title: 'Network Passphrase',
								type: 'string',
							},
						},
					},
				},
			},
		},
	},
});

export const WithExtraWidgets = createStory<FormProps>(Template, {
	schema: {
		type: 'object',
		properties: {
			Mermaid: {
				type: 'string',
				format: 'mermaid',
			},
			Markdown: {
				type: 'string',
				format: 'markdown',
			},
			Captcha: {
				type: 'string',
				format: 'captcha',
			},
		},
	},
});

WithExtraWidgets.decorators = [
	(Story) => (
		<React.Fragment>
			<Box px={30} pt={30}>
				<Markdown>{extraWidgetsReadme}</Markdown>
			</Box>
			<Story />
		</React.Fragment>
	),
];

export const WithPatternProperties = createStory<FormProps>(Template, {
	schema: {
		type: 'object',
		properties: {
			dynamicObject: {
				patternProperties: {
					'^[0-9]+$': {
						title: 'Rule',
						type: 'string',
					},
				},
				title: 'Rules',
				type: 'object',
			},
		},
	},
	formData: {
		dynamicObject: {
			123: 'foo',
		},
	},
});

const enumValues = ['First', 'Second', 'Third'];

export const WithDependants = createStory<FormProps>(Template, {
	schema: {
		type: 'object',
		properties: {
			application_config_variable: {
				title: 'Application configuration variables',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {
							title: 'Name',
							enum: enumValues,
						},
					},
					dependencies: {
						name: {
							oneOf: enumValues.map((name) => {
								return {
									description: 'Enter some value',
									properties: {
										name: {
											enum: [name],
										},
										value: {
											title: 'Value',
											enum: ['false', 'true'],
											default: 'true',
											description: undefined,
										},
									},
								};
							}),
						},
					},
				},
			},

			application_environment_variable: {
				type: 'array',
				title: 'Application environment variables',
				items: {
					type: 'object',
					properties: {
						name: {
							title: 'Name',
							type: 'string',
						},
						value: {
							title: 'Value',
							type: 'string',
						},
					},
				},
			},
		},
	},
	uiSchema: {
		application_config_variable: {
			'ui:options': {
				orderable: false,
			},
			items: {
				'ui:options': {
					responsive: true,
					flex: ['2 2 200px', '1 1 100px'],
				},
			},
		},
		application_environment_variable: {
			'ui:options': {
				orderable: false,
			},
			items: {
				'ui:options': {
					responsive: true,
					flex: ['2 2 200px', '1 1 100px'],
				},
			},
		},
	},
	formData: {
		application_config_variable: [{}],
		application_environment_variable: [{}],
	},
});
