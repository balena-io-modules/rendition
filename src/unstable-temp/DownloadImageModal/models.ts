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
	rawVersion: string;
	strippedVersion: string;
	basedOnVersion?: string;
	osType: string;
	line?: OsLines;
	variant?: string;
	formattedVersion: string;
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

export interface DeviceTypeInstructions {
	linux: string[];
	osx: string[];
	windows: string[];
}
export interface DeviceTypeDownloadAlert {
	type: string;
	message: string;
}
export interface DeviceTypeInstructions {
	linux: string[];
	osx: string[];
	windows: string[];
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
	hidden?: boolean;
	when?: Dictionary<number | string | boolean>;
	choices?: string[] | number[];
	choicesLabels?: Dictionary<string>;
}
export interface DeviceType {
	slug: string;
	name: string;
	logo?: string;
	contract?: Record<string, any>;

	/** @deprecated */
	imageDownloadAlerts?: DeviceTypeDownloadAlert[];
	/** @deprecated */
	instructions?: string[] | DeviceTypeInstructions;
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
