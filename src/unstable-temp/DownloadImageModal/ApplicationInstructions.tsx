import * as React from 'react';
import { Flex } from '../../components/Flex';
import { Box } from '../../components/Box';
import { Txt } from '../../components/Txt';
import { Tabs, Tab } from '../../components/Tabs';
import { Link } from '../../components/Link';
import { List } from '../../components/List';
import { Heading } from '../../components/Heading';
import { useTranslation } from '../../hooks/useTranslation';
import { DeviceType, OsSpecificContractInstructions } from './models';
import { interpolateMustache } from './utils';

export const getUserOs = () => {
	const platform = window.navigator.platform.toLowerCase();
	if (platform.includes('win')) {
		return 'Windows';
	}

	if (platform.includes('mac')) {
		return 'MacOS';
	}

	if (platform.includes('x11') || platform.includes('linux')) {
		return 'Linux';
	}

	return 'Unknown';
};

const dtJsonTocontractOsKeyMap = {
	windows: 'Windows',
	osx: 'MacOS',
	linux: 'Linux',
} as const;

export type OsOptions = ReturnType<typeof getUserOs>;

type KeysOfUnion<T> = T extends T ? keyof T : never;

export const ApplicationInstructions = React.memo(
	({
		deviceType,
		templateData,
	}: {
		deviceType: DeviceType;
		templateData: { dockerImage: string };
	}) => {
		const { t } = useTranslation();
		const [currentOs, setCurrentOs] = React.useState<OsOptions>(getUserOs());

		const instructions = React.useMemo(() => {
			if (
				deviceType?.instructions == null ||
				Array.isArray(deviceType.instructions) ||
				typeof deviceType.instructions !== 'object'
			) {
				return deviceType?.instructions;
			}

			const instructionsByOs = deviceType.instructions;

			return Object.fromEntries(
				(
					Object.entries(instructionsByOs) as Array<
						[KeysOfUnion<typeof instructionsByOs>, string[]]
					>
				).map(([key, value]) => {
					const normalizedKey =
						key in dtJsonTocontractOsKeyMap
							? dtJsonTocontractOsKeyMap[
									key as keyof typeof dtJsonTocontractOsKeyMap
							  ]
							: (key as keyof OsSpecificContractInstructions);
					return [normalizedKey, value];
				}),
			) as OsSpecificContractInstructions;
		}, [deviceType?.instructions]);
		const hasOsSpecificInstructions =
			instructions != null &&
			!Array.isArray(instructions) &&
			typeof instructions === 'object';
		const normalizedOs = currentOs === 'Unknown' ? 'Linux' : currentOs;

		React.useEffect(() => {
			if (hasOsSpecificInstructions) {
				const oses = Object.keys(instructions) as Array<
					keyof typeof instructions | 'Unknown'
				>;
				if (!oses.includes(currentOs) && oses.length > 0) {
					setCurrentOs(oses[0] as OsOptions);
				}
			}
		}, [currentOs, setCurrentOs, instructions, hasOsSpecificInstructions]);

		if (!deviceType || !instructions) {
			return <Txt>{t('no_data.no_instructions_found')}</Txt>;
		}

		const interpolatedInstructions = (
			hasOsSpecificInstructions
				? (instructions as Exclude<typeof instructions, string[]>)[normalizedOs]
				: instructions
		)?.map((instruction) =>
			interpolateMustache(
				templateData,
				instruction.replace(/<a/, '<a target="_blank"'),
			),
		);

		const hasConfigDownloadOnly =
			deviceType.yocto?.deployArtifact === 'docker-image';

		const finalInstructions = interpolatedInstructions
			? [
					hasConfigDownloadOnly
						? t('actions.use_form_to_download_configuration')
						: t('actions.use_from_to_configure_and_download'),
					...interpolatedInstructions, // TODO: i18n understand how to handle this case
					t('actions_messages.appearance_device_explanation'),
			  ]
			: null;

		return (
			<Flex flexDirection="column" alignItems="flex-start">
				<Heading.h5 mb={3}>{t('labels.instructions')}</Heading.h5>

				{hasOsSpecificInstructions && (
					<Box mb={3}>
						<Tabs
							activeIndex={Object.keys(instructions).indexOf(currentOs) ?? 0}
							onActive={(index) =>
								setCurrentOs(
									(
										Object.keys(instructions) as Array<
											keyof typeof instructions
										>
									)[index] ?? 'Unknown',
								)
							}
						>
							{Object.keys(instructions).map((os) => {
								return <Tab key={os} title={os}></Tab>;
							})}
						</Tabs>
					</Box>
				)}

				{finalInstructions != null && (
					<InstructionsList instructions={finalInstructions} />
				)}

				<Flex mt={4}>
					<Txt>
						For more details please refer to our{' '}
						<Link
							blank
							href={`https://www.balena.io/docs/learn/getting-started/${deviceType.slug}/nodejs/`}
						>
							Getting Started Guide
						</Link>
						.
					</Txt>
				</Flex>
			</Flex>
		);
	},
);

interface InstructionsItemProps {
	node: string;
}

interface InstructionsListProps {
	instructions: string[];
}

const InstructionsItem = ({ node }: InstructionsItemProps) => {
	return <span dangerouslySetInnerHTML={{ __html: node }} />;
};

const InstructionsList = ({ instructions }: InstructionsListProps) => {
	return (
		// TODO: On 13px the line height is calculated as 19.5px, which breaks the alignment of the number inside the list item due to rounding.
		// Remove custom font size once fixed in rendition https://github.com/balena-io-modules/rendition/issues/1025
		<List ordered fontSize={14}>
			{instructions.map((item, i) => {
				return <InstructionsItem key={`${item}_${i}`} node={item} />;
			})}
		</List>
	);
};
