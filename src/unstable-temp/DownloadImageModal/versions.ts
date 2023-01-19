import uniq from 'lodash/uniq';
import partition from 'lodash/partition';
import { OsVersion } from './models';
import { Dictionary } from '../../common-types';

export type VersionSelectionOptions = {
	title: string;
	value: string;
	isRecommended?: boolean;
	osType: string;
	line?: string;
	knownIssueList: string | null;
} & (
	| {
			hasPrebuiltVariants: false;
			rawVersion: string;
	  }
	| {
			hasPrebuiltVariants: true;
			rawVersions: {
				dev?: string;
				prod?: string;
			};
	  }
);

export const transformVersions = (versions: OsVersion[]) => {
	// Get a single object per stripped version, with both variants of it included (if they exist). It expects a sorted `
	const optsByVersion: Dictionary<VersionSelectionOptions> = {};
	versions.forEach((version) => {
		const existingSelectionOpt = optsByVersion[version.strippedVersion];
		// We always want to use the 'prod' variant's formatted version as it can contain additional information (such as recommended label).
		const title =
			(version.variant === 'dev' ? existingSelectionOpt?.title : null) ??
			version.formattedVersion;

		optsByVersion[version.strippedVersion] = {
			title,
			value: version.strippedVersion,
			osType: version.osType,
			line: version.line,
			knownIssueList: version.known_issue_list,
			// Unified releases in the model have variant === ''
			// but we also test for nullish for backgwards compatibility w/ the typings.
			...(!version.variant
				? {
						hasPrebuiltVariants: false,
						rawVersion: version.raw_version,
				  }
				: {
						hasPrebuiltVariants: true,
						rawVersions: {
							...(existingSelectionOpt != null &&
								'rawVersions' in existingSelectionOpt &&
								existingSelectionOpt.rawVersions),
							[version.variant]: version.raw_version,
						},
				  }),
		};
	});

	return Object.values(optsByVersion);
};

const LEGACY_OS_VERSION_MAJOR = 1;

// This returns the 3 most preferred versions for an os type. For multi-line os types, that would be the latest of each line, otherwise it is the latest 3 versions.
export const getPreferredVersionOpts = (
	versionOpts: VersionSelectionOptions[],
) => {
	const [supportedVersions, legacyVersions] = partition(versionOpts, (v) => {
		// TODO: check if worth installing semver on rendition;
		// const major = semver.major(v.strippedVersion);
		const major = v.value.match(/\d+/)?.join();
		return major && parseInt(major, 10) > LEGACY_OS_VERSION_MAJOR;
	});

	const opts = supportedVersions.length ? supportedVersions : legacyVersions;

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
			if (
				match &&
				!preferredDefaultOpts.find((v) => v.value.startsWith(match[0]))
			) {
				preferredDefaultOpts.push(option);
			}
		}

		return preferredDefaultOpts;
	}
};
