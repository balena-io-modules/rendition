import { JSONSchema } from '../types';

export type UiOptions = {
	[key: string]: JSONSchema;
};

// styled-system props can be passed as arrays, with each item
// representing the value at a particular breakpoint.
const responsive = (schema: JSONSchema): JSONSchema => {
	return {
		anyOf: [
			{
				type: 'array',
				items: schema,
			},
			{
				...schema,
			},
		],
	};
};

// Convenience object for common UI option schemas
export const UiOption: UiOptions = {
	string: {
		type: 'string',
	},
	boolean: {
		type: 'boolean',
	},
	number: {
		type: 'number',
	},
	integer: {
		type: 'integer',
	},
	space: responsive({
		type: ['number', 'string'],
	}),
};

export const SpaceUiOptions: UiOptions = {};

[
	'p',
	'pt',
	'pb',
	'pl',
	'pr',
	'px',
	'py',
	'm',
	'mt',
	'mb',
	'ml',
	'mr',
	'mx',
	'my',
].reduce((options, option) => {
	options[option] = UiOption.space;
	return options;
}, SpaceUiOptions);

export const FlexUiOptions: UiOptions = {
	flex: responsive({
		type: ['number', 'string'],
	}),
	flexDirection: responsive({
		type: 'string',
		enum: ['column', 'row', 'column-reverse', 'row-reverse'],
	}),
	flexBasis: responsive({
		type: 'string',
	}),
	flexWrap: responsive({
		type: 'string',
		enum: ['nowrap', 'wrap', 'wrap-reverse', 'initial', 'inherit'],
	}),
	alignItems: responsive({
		type: 'string',
		enum: [
			'stretch',
			'center',
			'flex-start',
			'flex-end',
			'baseline',
			'initial',
			'inherit',
		],
	}),
	alignSelf: responsive({
		type: 'string',
		enum: [
			'auto',
			'stretch',
			'center',
			'flex-start',
			'flex-end',
			'baseline',
			'initial',
			'inherit',
		],
	}),
	justifyContent: responsive({
		type: 'string',
		enum: [
			'flex-start',
			'flex-end',
			'center',
			'space-between',
			'space-around',
			'initial',
			'inherit',
		],
	}),
	justifySelf: responsive({
		type: 'string',
		enum: [
			'auto',
			'normal',
			'stretch',
			'center',
			'start',
			'end',
			'flex-start',
			'flex-end',
			'self-start',
			'self-end',
			'left',
			'right',
			'baseline',
			'initial',
			'inherit',
			'unset',
		],
	}),
};

export const WidgetWrapperUiOptions = {
	...SpaceUiOptions,
	...FlexUiOptions,
};
