export interface OpenApiJson {
	openapi: string;
	info: Info;
	servers?: ServersEntity[] | null;
	tags?: TagsEntity[] | null;
	paths: Paths;
	components: Components;
}

export interface Info {
	title: string;
	description: string;
	version: string;
}

export interface ServersEntity {
	url: string;
}

export interface TagsEntity {
	name: string;
}

export interface Paths {
	[key: string]: Methods | null;
}

export interface Methods {
	get?: Get;
	post?: PostOrPatch;
	patch?: PostOrPatch;
	delete?: Delete;
}

export interface RequestBody {
	description: string;
	required: boolean;
	content: unknown;
}

export interface Get {
	summary: string;
	tags?: string[] | null;
	parameters?: ParametersEntity[] | null;
	responses: unknown;
}

export interface PostOrPatch {
	summary: string;
	tags?: string[] | null;
	requestBody: RequestBody;
	responses: unknown;
}

export interface Delete {
	summary: string;
	tags?: string[] | null;
	responses: unknown;
}
export interface ParametersEntity {
	$ref?: string | null;
	name?: string | null;
	description?: string | null;
	in?: string | null;
	schema?: any | null;
	explode?: boolean | null;
}
export interface Items {
	type: string;
	enum?: string[] | null;
}

export interface Components {
	schemas: Schemas;
	parameters: Parameters;
	responses: unknown;
}

export interface Schemas {
	[key: string]: any;
}

export interface Parameters {
	top: Top;
	skip: Skip;
	count: CountOrSearch;
	search: CountOrSearch;
}
export interface Top {
	name: string;
	in: string;
	description: string;
	schema: any;
	example: number;
}

export interface Skip {
	name: string;
	in: string;
	description: string;
	schema: any;
}

export interface CountOrSearch {
	name: string;
	description: string;
	in: string;
	schema: any;
}
