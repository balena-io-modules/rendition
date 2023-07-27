import invert from 'lodash/invert';
import * as React from 'react';
import { Flex } from '../../components/Flex';
import { Box } from '../../components/Box';
import { Txt } from '../../components/Txt';
import { Tabs, Tab } from '../../components/Tabs';
import { Link } from '../../components/Link';
import { List } from '../../components/List';
import { Heading } from '../../components/Heading';
import { useTranslation } from '../../hooks/useTranslation';
import { DeviceType, DeviceTypeInstructions } from './models';
import { interpolateMustache } from './utils';

export type OsOptions = ReturnType<typeof getUserOs>;

export const osTitles: Record<OsOptions, string> = {
	windows: 'Windows',
	macos: 'MacOS',
	linux: 'Linux',
	unknown: 'Unknown',
};

export const getUserOs = () => {
	const platform = window.navigator.platform.toLowerCase();
	if (platform.includes('win')) {
		return 'windows';
	}

	if (platform.includes('mac')) {
		return 'macos';
	}

	if (platform.includes('x11') || platform.includes('linux')) {
		return 'linux';
	}

	return 'unknown';
};

const osTabIndices: Record<OsOptions, number> = {
	linux: 0,
	macos: 1,
	windows: 2,
	unknown: 0,
};

const osTabNames = invert(osTabIndices) as Record<string, OsOptions>;

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

		const instructions = deviceType?.instructions;
		const hasOsSpecificInstructions = !Array.isArray(instructions);
		const normalizedOs = currentOs === 'unknown' ? 'linux' : currentOs;

		React.useEffect(() => {
			if (hasOsSpecificInstructions && instructions) {
				const oses = Object.keys(instructions).map((os) =>
					os.toLowerCase(),
				) as unknown as OsOptions;
				if (!oses.includes(currentOs) && oses.length > 0) {
					setCurrentOs(oses[0] as OsOptions);
				}
			}
		}, [currentOs, setCurrentOs, instructions, hasOsSpecificInstructions]);

		if (!deviceType || !instructions) {
			return <Txt>{t('no_data.no_instructions_found')}</Txt>;
		}

		const interpolatedInstructions = (
			(hasOsSpecificInstructions
				? (instructions as DeviceTypeInstructions)[
						osTitles[normalizedOs] as keyof DeviceTypeInstructions
				  ]
				: instructions) ?? []
		).map((instruction) =>
			interpolateMustache(
				templateData,
				instruction.replace(/<a/, '<a target="_blank"'),
			),
		);

		const hasConfigDownloadOnly =
			deviceType.yocto?.deployArtifact === 'docker-image';

		const finalInstructions = [
			hasConfigDownloadOnly
				? t('actions.use_form_to_download_configuration')
				: t('actions.use_from_to_configure_and_download'),
			...interpolatedInstructions, // TODO: i18n understand how to handle this case
			t('actions_messages.appearance_device_explanation'),
		];

		return (
			<Flex flexDirection="column" alignItems="flex-start">
				<Heading.h5 mb={3}>{t('labels.instructions')}</Heading.h5>

				{hasOsSpecificInstructions && (
					<Box mb={3}>
						<Tabs
							activeIndex={osTabIndices[currentOs]}
							onActive={(index) => {
								setCurrentOs(osTabNames[index.toString()]);
							}}
						>
							{Object.keys(instructions).map((os) => {
								return (
									<Tab
										key={os}
										title={osTitles[os.toLowerCase() as keyof typeof osTitles]}
									></Tab>
								);
							})}
						</Tabs>
					</Box>
				)}

				<InstructionsList instructions={finalInstructions} />

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
