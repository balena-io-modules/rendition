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

export interface Dictionary<T> {
	[key: string]: T;
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
}
export interface OsVersionsByDeviceType {
	[deviceTypeSlug: string]: OsVersion[];
}
export interface User {
	id: number;
	actor: number;
	created_at: string;
	username: string;
}
export declare type OrganizationMembershipRoles = 'administrator' | 'member';
export interface ApiKey {
	id: number;
	created_at: string;
	name: string;
	description: string | null;
	is_of__actor: { _id: number };
}
export interface Application {
	id: number;
	created_at: string;
	app_name: string;
	slug: string;
	uuid: string;
	is_accessible_by_support_until__date: string;
	is_host: boolean;
	should_track_latest_release: boolean;
	is_public: boolean;
	is_archived: boolean;
	is_discoverable: boolean;
	is_stored_at__repository_url: string | null;
	application_type: NavigationResource<ApplicationType>;
}
export interface ApplicationType {
	id: number;
	name: string;
	slug: string;
	description: string | null;
	supports_gateway_mode: boolean;
	supports_multicontainer: boolean;
	supports_web_url: boolean;
	is_legacy: boolean;
	requires_payment: boolean;
	needs__os_version_range: string | null;
	maximum_device_count: number | null;
	is_host_os: boolean;
}
export declare type ReleaseStatus =
	| 'cancelled'
	| 'error'
	| 'failed'
	| 'interrupted'
	| 'local'
	| 'running'
	| 'success'
	| 'timeout'
	| null;
export interface Release {
	id: number;
	created_at: string;
	commit: string;
	composition: string | null;
	contract: string | null;
	status: ReleaseStatus;
	source: string;
	build_log: string | null;
	is_invalidated: boolean;
	start_timestamp: string;
	update_timestamp: string | null;
	end_timestamp: string;
	release_version: string | null;
}

export interface DeviceTypeInstructions {
	linux: string[];
	osx: string[];
	windows: string[];
}
export interface DeviceType {
	id: number;
	slug: string;
	name: string;
	is_private: boolean;
	logo: string | null;
	contract: Contract | null;
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
export interface DeviceTypeGettingStartedLink {
	linux: string;
	osx: string;
	windows: string;
	[key: string]: string;
}
export interface DeviceTypeOptions {
	options: DeviceTypeOptionsGroup[];
	collapsed: boolean;
	isCollapsible: boolean;
	isGroup: boolean;
	message: string;
	name: string;
}
export interface DeviceInitializationOptions {
	message: string;
	type: string;
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
	aliases: string[];
	arch: string;
	state?: string;
	community?: boolean;
	private?: boolean;
	isDependent?: boolean;
	imageDownloadAlerts?: DeviceTypeDownloadAlert[];
	instructions?: string[] | DeviceTypeInstructions;
	gettingStartedLink?: string | DeviceTypeGettingStartedLink;
	stateInstructions?: {
		[key: string]: string[];
	};
	options?: DeviceTypeOptions[];
	initialization?: {
		options?: DeviceInitializationOptions[];
		operations: Array<{
			command: string;
		}>;
	};
	supportsBlink?: boolean;
	yocto: {
		fstype?: string;
		deployArtifact: string;
	};
	/** Holds the latest balenaOS version */
	buildId?: string;
	logoUrl?: string;
}

export interface Device {
	id: number;
	created_at: string;
	custom_latitude?: string;
	custom_longitude?: string;
	device_name: string;
	download_progress?: number;
	ip_address: string | null;
	public_address: string | null;
	mac_address: string | null;
	is_accessible_by_support_until__date: string | null;
	is_connected_to_vpn: boolean;
	is_in_local_mode?: boolean;
	is_locked_until__date: string;
	is_web_accessible: boolean;
	is_active: boolean;
	is_online: boolean;
	last_connectivity_event: string | null;
	last_vpn_event: string;
	latitude?: string;
	local_id?: string;
	location: string;
	longitude?: string;
	note: string;
	os_variant?: string;
	os_version: string | null;
	provisioning_progress?: number;
	provisioning_state: string;
	state?: {
		key: string;
		name: string;
	};
	status: string;
	status_sort_index?: number;
	supervisor_version: string;
	uuid: string;
	vpn_address: string | null;
	api_heartbeat_state: 'online' | 'offline' | 'timeout' | 'unknown';
	memory_usage: number | null;
	memory_total: number | null;
	storage_block_device: string | null;
	storage_usage: number | null;
	storage_total: number | null;
	cpu_usage: number | null;
	cpu_temp: number | null;
	cpu_id: string | null;
	is_undervolted: boolean;
	overall_progress: number | null;
	is_of__device_type: NavigationResource<DeviceType>;
	belongs_to__application: NavigationResource<Application>;
	belongs_to__user: OptionalNavigationResource<User>;
	is_running__release: OptionalNavigationResource<Release>;
	should_be_running__release: OptionalNavigationResource<Release>;
	is_managed_by__device: OptionalNavigationResource<Device>;
}
