import { JSONSchema6 } from 'json-schema';

// Augment the type declarations provided by json-schema to add some ajv
// compliant keywords that aren't spec supported
declare module 'json-schema' {
	export interface JSONSchema6 {
		// formatMaxmimum and formatMinimum are still a proposal for json-schema,
		// but they are supported by ajv
		// see:
		// - https://github.com/json-schema-org/json-schema-spec/issues/116
		// - http://epoberezkin.github.io/ajv/keywords.html#formatmaximum--formatminimum-and-formatexclusivemaximum--formatexclusiveminimum-proposed
		formatMaximum?: string;
		formatMinimum?: string;
	}
}
