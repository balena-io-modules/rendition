import template from 'lodash/template';
import {
	Dictionary,
	DeviceType,
	OptionalNavigationResource,
	OsTypesEnum,
	Device,
} from './models';

export const OS_VARIANT_FULL_DISPLAY_TEXT_MAP: Dictionary<string> = {
	dev: 'Development',
	prod: 'Production',
};

export const getExpanded = <T>(obj: OptionalNavigationResource<T>) =>
	(Array.isArray(obj) && obj[0]) || undefined;

export const stripVersionBuild = (version: string) =>
	version.replace(/(\.dev|\.prod)/, '');

// Use lodash templates to simulate moustache templating
export const interpolateMustache = (
	data: { [key: string]: string },
	tpl: string,
) => template(tpl, { interpolate: /{{([\s\S]+?)}}/g })(data);

export const getGettingStartedLink = (
	deviceType: DeviceType,
	preferredOsType: 'linux' | 'osx' | 'windows' = 'windows',
) => {
	if (!deviceType || !deviceType.gettingStartedLink) {
		return '';
	}
	if (typeof deviceType.gettingStartedLink === 'string') {
		return deviceType.gettingStartedLink;
	}
	return (
		deviceType.gettingStartedLink[preferredOsType] ||
		deviceType.gettingStartedLink['windows']
	);
};

export const getOsTypeName = (osTypeSlug: string) => {
	switch (osTypeSlug) {
		case OsTypesEnum.DEFAULT:
			return 'balenaOS';
		case OsTypesEnum.ESR:
			return 'balenaOS ESR';
		default:
			return 'unknown';
	}
};

/**
 * @return known return values are 'dev', 'prod' & ''
 */
export const getOsVariant = (deviceOrVersion: Device | string): string => {
	if (!deviceOrVersion) {
		return '';
	}

	let version;
	if (typeof deviceOrVersion === 'string') {
		version = deviceOrVersion;
	} else {
		if (deviceOrVersion.os_variant) {
			return deviceOrVersion.os_variant;
		}

		version = deviceOrVersion.os_version || '';
	}

	const versionVariantMatch = version.match(/(prod|dev)/) || [];
	return versionVariantMatch[1] || '';
};

export const getOsVariantDisplayText = (
	deviceOrVariant: Device | string,
): string => {
	const variant =
		typeof deviceOrVariant === 'string'
			? deviceOrVariant
			: getOsVariant(deviceOrVariant as Device);

	return OS_VARIANT_FULL_DISPLAY_TEXT_MAP[variant] || variant;
};
