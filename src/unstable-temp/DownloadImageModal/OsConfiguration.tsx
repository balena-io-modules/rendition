import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons/faFileAlt';
import { Alert } from '../../components/Alert';
import { Box } from '../../components/Box';
import { Checkbox } from '../../components/Checkbox';
import { Flex } from '../../components/Flex';
import { Link } from '../../components/Link';
import { Select } from '../../components/Select';
import { RadioButton, RadioButtonProps } from '../../components/RadioButton';
import { Txt } from '../../components/Txt';

import { QuestionMark } from './QuestionMark';
import { DeviceTypeSelector } from './DeviceTypeSelector';
import { OsTypeSelector } from './OsTypeSelector';
import {
	getPreferredVersionOpts,
	transformVersions,
	VersionSelectionOptions,
} from './versions';
import { DeviceType, OsVersionsByDeviceType } from './models';
import { useTranslation } from '../../hooks/useTranslation';
import { getOsVariantDisplayText } from './utils';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '~/theme';

export const DownloadImageLabel = styled.label`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 21px;
	font-size: 12px;
	margin-bottom: 8px;
	font-weight: normal;
`;

interface OsConfigurationProps {
	deviceTypeOsVersions: OsVersionsByDeviceType;
	compatibleDeviceTypes: DeviceType[];
	selectedDeviceType: DeviceType;
	osTypes: string[];
	hasEsrVersions: boolean;
	selectedOsType: string;
	isInitialDefault?: boolean;
	onSelectedDeviceTypeChange: (deviceType: DeviceType) => void;
	onSelectedVersionChange: (osVersion: string) => void;
	onSelectedDevelopmentMode: (developmentMode: boolean) => void;
	onSelectedOsTypeChange: (osType: string) => void;
	docsIcon?: IconProp;
}

const BuildVariants = ['dev', 'prod'] as const;

export type BuildVariant = (typeof BuildVariants)[number];

const getCategorizedVersions = (
	deviceTypeOsVersions: OsVersionsByDeviceType,
	deviceType: DeviceType,
	osType: string | null,
) => {
	const osVersions = deviceTypeOsVersions[deviceType.slug] ?? [];
	const deviceOsVersions = osType
		? osVersions.filter((osVersion) => osVersion.osType === osType)
		: osVersions;

	const selectionOpts = transformVersions(deviceOsVersions);
	const preferredSelectionOpts = getPreferredVersionOpts(selectionOpts);

	return {
		selectionOpts,
		preferredSelectionOpts,
	};
};

const VariantSelector = ({
	version,
	variant,
	onVariantChange,
	t,
}: {
	version: VersionSelectionOptions | undefined;
	onVariantChange: (variant: BuildVariant) => void;
	variant: BuildVariant;
	t: (s: string) => string;
}) => {
	const [devOpts, prodOpts] = BuildVariants.map((vrnt): RadioButtonProps => {
		let label = <Txt.span bold>{getOsVariantDisplayText(vrnt)}</Txt.span>;
		if (vrnt === 'dev') {
			label = (
				<>
					{label}
					<Alert ml={3} info plaintext>
						{t('info.recommended_for_new_users')}
					</Alert>
				</>
			);
		}
		return {
			label,
			disabled:
				version == null ||
				(version.hasPrebuiltVariants && !version.rawVersions[vrnt]),
			checked: vrnt === variant,
			onChange: () => onVariantChange(vrnt),
		};
	});
	return (
		<>
			<RadioButton {...devOpts} />
			<Txt.p fontSize={1} mt={1} mb={3} color="tertiary.main">
				{t('info.development_images_for_local_development_1')}{' '}
				<Link href="https://balena.io/docs/development/local-mode/" blank>
					{t('info.development_images_for_local_development_2')}
				</Link>{' '}
				{t('info.development_images_for_local_development_3')}{' '}
				<strong>{t('info.development_images_for_local_development_4')}</strong>
			</Txt.p>

			<RadioButton {...prodOpts} />
			<Txt.p fontSize={1} mt={1} color="tertiary.main">
				{t('info.production_images_not_for_local_development')}
			</Txt.p>
		</>
	);
};

const VersionSelectOption = ({
	option,
	theme,
}: {
	option: VersionSelectionOptions;
	theme: Theme;
}) => (
	<Flex
		alignItems="center"
		py={2}
		pl={3}
		tooltip={option.knownIssueList ?? undefined}
		maxWidth="445px"
	>
		<Txt mr={2}>{option.title}</Txt>{' '}
		{!!option.knownIssueList && (
			<Box
				ml={2}
				tooltip={option.knownIssueList}
				display="contents"
				style={{ lineHeight: 'normal' }}
			>
				<FontAwesomeIcon
					color={theme.colors.warning.main}
					icon={faExclamationTriangle}
				/>
				<Txt ml={1} truncate>
					{option.knownIssueList}
				</Txt>
			</Box>
		)}
	</Flex>
);
export const OsConfiguration = ({
	deviceTypeOsVersions,
	compatibleDeviceTypes,
	selectedDeviceType,
	osTypes,
	hasEsrVersions,
	selectedOsType,
	isInitialDefault,
	onSelectedVersionChange,
	onSelectedDevelopmentMode,
	onSelectedDeviceTypeChange,
	onSelectedOsTypeChange,
	docsIcon,
}: OsConfigurationProps) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [showAllVersions, setShowAllVersions] = React.useState(false);
	const [version, setVersion] = React.useState<
		VersionSelectionOptions | undefined
	>();
	const [variant, setVariant] = React.useState<BuildVariant>('prod');
	const { selectionOpts, preferredSelectionOpts } = getCategorizedVersions(
		deviceTypeOsVersions,
		selectedDeviceType,
		selectedOsType,
	);
	const versionSelectionOpts = showAllVersions
		? selectionOpts
		: preferredSelectionOpts;
	const showAllVersionsToggle =
		preferredSelectionOpts.length < selectionOpts.length;

	React.useEffect(() => {
		if (!version) {
			return;
		}

		const versionWithVariant = version.hasPrebuiltVariants
			? version.rawVersions[variant]
			: version.rawVersion;
		if (versionWithVariant) {
			onSelectedVersionChange(versionWithVariant);
			onSelectedDevelopmentMode(variant === 'dev');
		}

		if (version.hasPrebuiltVariants && !version.rawVersions[variant]) {
			setVariant(variant === 'dev' ? 'prod' : 'dev');
		}
	}, [version, variant]);

	const handleShowAllVersions = (e: any) => {
		const isChecked = e.target.checked;
		setShowAllVersions(isChecked);

		if (isChecked || !version) {
			return;
		}

		const selectedValueIsPreferred = preferredSelectionOpts.some(
			(ver) => ver.value === version.value,
		);
		if (selectedValueIsPreferred) {
			return;
		}

		const preferred =
			preferredSelectionOpts.find((ver) => ver.isRecommended) ??
			preferredSelectionOpts?.[0];
		if (preferred) {
			setVersion(preferred);
		}
	};

	const handleSelectedDeviceTypeChange = React.useCallback(
		(dt: DeviceType) => {
			if (selectedDeviceType?.slug === dt.slug) {
				return;
			}

			const newDeviceType = compatibleDeviceTypes?.find(
				(cdt) => cdt.slug === dt.slug,
			);
			if (!newDeviceType) {
				return;
			}

			onSelectedDeviceTypeChange(newDeviceType);
		},
		[compatibleDeviceTypes, selectedDeviceType],
	);

	React.useEffect(() => {
		setVersion(
			versionSelectionOpts.find((ver) => ver.isRecommended) ??
				versionSelectionOpts[0],
		);
	}, [selectedDeviceType, selectedOsType]);

	return (
		<>
			<Flex mb={3} mx={-2}>
				{compatibleDeviceTypes.length > 1 && (
					<Box flex={3} mx={2}>
						<DownloadImageLabel>
							{t('placeholders.select_device_type')}
							<QuestionMark
								tooltip={t(
									'info.applications_support_devices_with_same_architecture',
								)}
							/>
						</DownloadImageLabel>
						<DeviceTypeSelector
							deviceTypeOptions={compatibleDeviceTypes}
							selectedDeviceType={selectedDeviceType}
							selectDeviceTypeOption={handleSelectedDeviceTypeChange}
						/>
					</Box>
				)}
				{(!isInitialDefault || !selectedOsType) && hasEsrVersions && (
					<Box flex={2} mx={2}>
						<DownloadImageLabel>
							{t('placeholders.select_os_type_status')}{' '}
							<DocsLink
								href="https://www.balena.io/docs/reference/OS/extended-support-release"
								docsIcon={docsIcon}
							/>
						</DownloadImageLabel>
						<OsTypeSelector
							supportedOsTypes={osTypes}
							hasEsrVersions={hasEsrVersions}
							selectedOsTypeSlug={selectedOsType}
							onSelectedOsTypeChange={onSelectedOsTypeChange}
						/>
					</Box>
				)}
			</Flex>
			{(!isInitialDefault || !version) && (
				<Box mb={3}>
					<DownloadImageLabel>
						{t('placeholders.select_version')}
					</DownloadImageLabel>

					<Flex alignItems="center" mx={-2}>
						<Box flex={3} mx={2}>
							<Select<VersionSelectionOptions>
								id="e2e-download-image-versions-list"
								valueKey="value"
								labelKey="title"
								emptySearchMessage="No version available for this application type"
								value={version}
								valueLabel={
									version && (
										<VersionSelectOption option={version} theme={theme} />
									)
								}
								placeholder={'Choose a version...'}
								onChange={({ option }) => {
									setVersion(option);
								}}
								options={versionSelectionOpts}
							>
								{(option) => (
									<VersionSelectOption option={option} theme={theme} />
								)}
							</Select>
						</Box>

						{showAllVersionsToggle && (
							<Box flex={2} mx={2}>
								<Checkbox
									checked={showAllVersions}
									label={'Show outdated versions'}
									onChange={handleShowAllVersions}
								/>
							</Box>
						)}
					</Flex>
				</Box>
			)}

			{(!isInitialDefault || !variant) && (
				<Box>
					<DownloadImageLabel>
						{t('placeholders.select_edition')}
					</DownloadImageLabel>
					<Box>
						<VariantSelector
							t={t}
							version={version}
							variant={variant}
							onVariantChange={setVariant}
						/>
					</Box>
				</Box>
			)}
		</>
	);
};

interface DocsLinkProps {
	href: string;
	docsIcon?: IconProp;
}

export const DocsLink = ({ href, docsIcon }: DocsLinkProps) => {
	return (
		<Link blank href={href} fontSize={2} ml={2}>
			{docsIcon ? (
				<FontAwesomeIcon icon={docsIcon} />
			) : (
				<FontAwesomeIcon icon={faFileAlt} />
			)}
		</Link>
	);
};
