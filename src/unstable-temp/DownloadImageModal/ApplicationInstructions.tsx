import invert from 'lodash/invert';
import has from 'lodash/has';
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
import { getGettingStartedLink, interpolateMustache } from './utils';

export type OsOptions = ReturnType<typeof getUserOs>;

export const osTitles: Record<OsOptions, string> = {
	windows: 'Windows',
	osx: 'MacOS',
	linux: 'Linux',
	unknown: 'Unknown',
};

export const getUserOs = () => {
	const platform = window.navigator.platform.toLowerCase();
	if (platform.includes('win')) {
		return 'windows';
	}

	if (platform.includes('mac')) {
		return 'osx';
	}

	if (platform.includes('x11') || platform.includes('linux')) {
		return 'linux';
	}

	return 'unknown';
};

const osTabIndices: Record<OsOptions, number> = {
	windows: 0,
	osx: 1,
	linux: 2,
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
				const oses = Object.keys(instructions) as unknown as OsOptions;
				if (!oses.includes(currentOs) && oses.length > 0) {
					setCurrentOs(oses[0] as OsOptions);
				}
			}
		}, [currentOs, setCurrentOs, instructions, hasOsSpecificInstructions]);

		if (
			!deviceType ||
			!instructions ||
			deviceType?.yocto.deployArtifact === 'empty'
		) {
			return <Txt>{t('no_data.no_instructions_found')}</Txt>;
		}

		const interpolatedInstructions = (
			hasOsSpecificInstructions
				? (instructions as DeviceTypeInstructions)[normalizedOs]
				: (instructions as string[])
		).map((instruction) =>
			interpolateMustache(
				templateData,
				instruction.replace(/<a/, '<a target="_blank"'),
			),
		);

		const finalInstructions = [
			t('actions.use_from_to_configure_and_download'),
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
							onActive={(index) => setCurrentOs(osTabNames[index.toString()])}
						>
							{(Object.keys(instructions) as OsOptions[]).map((os) => {
								return <Tab key={os} title={osTitles[os]}></Tab>;
							})}
						</Tabs>
					</Box>
				)}

				<InstructionsList instructions={finalInstructions} />

				{!!deviceType.gettingStartedLink && (
					<Flex mt={4}>
						<Txt>
							For more details please refer to our{' '}
							<Link
								blank
								href={getGettingStartedLink(deviceType, normalizedOs)}
							>
								Getting Started Guide
							</Link>
							.
						</Txt>
					</Flex>
				)}
			</Flex>
		);
	},
);

interface InstructionsItemProps {
	node: any;
}

interface InstructionsListProps {
	instructions: any[];
}

const InstructionsItem = (props: InstructionsItemProps) => {
	const { node } = props;

	const hasChildren = has(node, 'children');
	let text = null;

	if (typeof node === 'string') {
		text = node;
	}

	if (node?.text) {
		text = node.text;
	}

	return (
		<span>
			<span dangerouslySetInnerHTML={{ __html: text }} />

			{hasChildren && (
				<List>
					{node.children.map((item: any) => {
						return <InstructionsItem node={item} />;
					})}
				</List>
			)}
		</span>
	);
};

const InstructionsList = (props: InstructionsListProps) => {
	const { instructions } = props;

	return (
		// TODO: On 13px the line height is calculated as 19.5px, which breaks the alignment of the number inside the list item due to rounding.
		// Remove custom font size once fixed in rendition https://github.com/balena-io-modules/rendition/issues/1025
		<List ordered fontSize={14}>
			{instructions.map((item) => {
				return <InstructionsItem key={item} node={item} />;
			})}
		</List>
	);
};
