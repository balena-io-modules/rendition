import uniq from 'lodash/uniq';
import { OsVersion } from './models';
import { Dictionary } from '../../common-types';

export interface VersionSelectionOptions {
	title: string;
	value: string;
	isRecommended?: boolean;
	supportsBuildEditions: boolean;
	osType: string;
	line?: string;
	knownIssueList: string | null;
	rawVersions: {
		dev: string | null;
		prod: string | null;
	};
}

export const transformVersions = (
	versions: OsVersion[],
	hasEditions: boolean,
) => {
	if (!hasEditions) {
		return versions.map<VersionSelectionOptions>((v) => {
			return {
				title: v.formattedVersion,
				value: v.strippedVersion,
				isRecommended: v.isRecommended,
				supportsBuildEditions: false,
				osType: v.osType,
				line: v.line,
				knownIssueList: v.known_issue_list,
				rawVersions: {
					dev: null,
					prod: v.rawVersion,
				},
			};
		});
	}

	// Get a single object per stripped version, with both variants of it included (if they exist). It expects a sorted `
	const selectionOptsMap = versions.reduce(
		(selectionOpts: Dictionary<VersionSelectionOptions>, version) => {
			const existingSelectionOpt = selectionOpts[version.strippedVersion];
			// We always want to use the 'prod' variant's formatted version as it can contain additional information (such as recommended label).
			const defaultTitle =
				existingSelectionOpt?.title ?? version.formattedVersion;
			const title =
				version.variant !== 'dev' ? version.formattedVersion : defaultTitle;

			selectionOpts[version.strippedVersion] = {
				title,
				value: version.strippedVersion,
				supportsBuildEditions: true,
				osType: version.osType,
				line: version.line,
				knownIssueList: version.known_issue_list,
				rawVersions: {
					dev:
						version.variant === 'dev'
							? version.rawVersion
							: existingSelectionOpt?.rawVersions.dev,
					prod:
						version.variant !== 'dev'
							? version.rawVersion
							: existingSelectionOpt?.rawVersions.prod,
				},
			};

			return selectionOpts;
		},
		{},
	);

	return Object.values(selectionOptsMap);
};

// This returns the 3 most preferred versions for a os type. For multi-line os types, that would be the latest of each line, otherwise it is the latest 3 versions.
export const getPreferredVersionOpts = (
	proposedVersionOpts: VersionSelectionOptions[],
	noBuildVariantVersionOpts: VersionSelectionOptions[],
) => {
	const opts = proposedVersionOpts.length
		? proposedVersionOpts
		: noBuildVariantVersionOpts;

	const lines = uniq(opts.map((option) => option.line));
	const hasMultipleLines = lines.length > 1;

	if (hasMultipleLines) {
		const preferredMultilineOpts: {
			[key: string]: VersionSelectionOptions;
		} = {};

		opts.forEach((option) => {
			if (option.line && !preferredMultilineOpts[option.line]) {
				preferredMultilineOpts[option.line] = option;
			}
		});

		return Object.values(preferredMultilineOpts);
	} else {
		const preferredDefaultOpts: VersionSelectionOptions[] = [];
		for (const option of opts) {
			if (preferredDefaultOpts.length >= 3) {
				break;
			}

			const match = option.value.match(/\d+\.\d+\./);
			if (match) {
				if (!preferredDefaultOpts.find((v) => v.value.startsWith(match[0]))) {
					preferredDefaultOpts.push(option);
				}
			}
		}

		return preferredDefaultOpts;
	}
};
