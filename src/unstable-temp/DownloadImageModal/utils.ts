import template from 'lodash/template';
import { OptionalNavigationResource, OsTypesEnum } from './models';
import { Dictionary } from '../../common-types';

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

export const getOsVariantDisplayText = (variant: string): string => {
	return OS_VARIANT_FULL_DISPLAY_TEXT_MAP[variant] || variant;
};
