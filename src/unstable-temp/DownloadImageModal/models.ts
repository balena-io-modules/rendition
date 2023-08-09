import { Dictionary } from '../../common-types';

export interface WithId {
	id: number;
}

export interface PineDeferred {
	__id: number;
}

export type NavigationResource<T = WithId> = [T] | PineDeferred;
export type OptionalNavigationResource<T = WithId> =
	| []
	| [T]
	| PineDeferred
	| null;

export enum OsTypesEnum {
	DEFAULT = 'default',
	ESR = 'esr',
}

export interface WithId {
	id: number;
}

export interface Contract {
	slug: string;
	type: string;
	name?: string;
	version?: string;
	externalVersion?: string;
	contractVersion?: string;
	description?: string;
	aliases?: string[];
	tags?: string[];
	data?: any;
	assets?: any;
	requires?: string[];
	provides?: string[];
	composedOf?: any;
	partials?: any;
}

export declare type OsLines =
	| 'next'
	| 'current'
	| 'sunset'
	| 'outdated'
	| undefined;
export interface OsVersion {
	id: number;
	raw_version: string;
	strippedVersion: string;
	basedOnVersion?: string;
	osType: string;
	line?: OsLines;
	// TODO: Mark as non-nullable in the next major
	variant?: string;
	isRecommended?: boolean;
	known_issue_list: string | null;
}
export interface OsVersionsByDeviceType {
	[deviceTypeSlug: string]: OsVersion[];
}
export interface Application {
	id: number;
	app_name: string;
	slug: string;
	uuid: string;
}

// the legacy device-type.json format
export interface OsSpecificDeviceTypeJsonInstructions {
	linux: string[];
	osx: string[];
	windows: string[];
}

export type OsSpecificContractInstructions = Record<
	'Linux' | 'MacOS' | 'Windows',
	string[]
>;

export type OsSpecificDeviceTypeInstructions =
	| OsSpecificDeviceTypeJsonInstructions
	| OsSpecificContractInstructions;

// TODO: Fix me to include all possible types in the next major
export type DeviceTypeInstructions = OsSpecificDeviceTypeJsonInstructions;

export interface DeviceTypeDownloadAlert {
	type: string;
	message: string;
}
export interface DeviceTypeOptions {
	options: DeviceTypeOptionsGroup[];
	collapsed: boolean;
	isCollapsible: boolean;
	isGroup: boolean;
	message: string;
	name: string;
}
export interface DeviceTypeOptionsGroup {
	default: number | string;
	message: string;
	name: string;
	type: string;
	min?: number;
	max?: number;
	docs?: string;
	hidden?: boolean;
	when?: Dictionary<number | string | boolean>;
	choices?: string[] | number[];
	choicesLabels?: Dictionary<string>;
}
export interface DeviceType {
	slug: string;
	name: string;
	logo?: string | null;
	contract?: Record<string, any> | null;

	/** @deprecated */
	imageDownloadAlerts?: DeviceTypeDownloadAlert[];
	/** @deprecated */
	instructions?:
		| string[]
		| OsSpecificDeviceTypeJsonInstructions
		| OsSpecificContractInstructions;
	/** @deprecated */
	options?: DeviceTypeOptions[];
	/** @deprecated */
	yocto?: {
		fstype?: string;
		deployArtifact: string;
	};
	/** @deprecated use DeviceType.logo */
	logoUrl?: string;
}
