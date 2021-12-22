import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { ApplicationInstructions } from './ApplicationInstructions';
import { ImageForm, ModalAction } from './ImageForm';
import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';
import uniq from 'lodash/uniq';
import {
	OsVersionsByDeviceType,
	Application,
	DeviceType,
	OsTypesEnum,
} from './models';
import { Dictionary } from '../../common-types';
import { Box } from '../../components/Box';
import { Flex } from '../../components/Flex';
import { Txt } from '../../components/Txt';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import { Alert } from '../../components/Alert';
import { Modal } from '../../components/Modal';
import { Img } from '../../components/Img';
import { useTranslation } from '../../hooks/useTranslation';
import { stripVersionBuild } from './utils';
import { OsConfiguration } from './OsConfiguration';
import { FormModel } from './FormModel';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const DeviceLogo = styled(Img)<{ small?: boolean }>`
	// To prevent Save Image dialog
	pointer-events: none;
	display: inline-block;
	height: 100%;
	// required so that icons in long cells show in the Table in FF
	min-width: 16px;
	max-height: ${(props) => (props.small ? '16px' : '24px')};
	max-width: 100%;
	vertical-align: middle;

	&.device-logo--disabled {
		opacity: 0.4;
	}
`;

// TODO: This is a hack until we redesign this modal to match the rest.
const FooterlessModal = styled(Modal)`
	& > div > div:last-child {
		display: none;
	}
`;

const getUniqueOsTypes = (
	osVersions: OsVersionsByDeviceType,
	deviceTypeSlug: string | undefined,
) => {
	if (
		isEmpty(osVersions) ||
		!deviceTypeSlug ||
		isEmpty(osVersions[deviceTypeSlug])
	) {
		return [];
	}

	return uniq(osVersions[deviceTypeSlug].map((x) => x.osType));
};

export interface DownloadOptionsBase {
	appId: number;
	releaseId?: number;
	deviceType: string;
	provisioningKeyName?: string;
	downloadConfigOnly?: boolean;
	version: string;
	developmentMode?: boolean;
}

export interface DownloadOptions extends DownloadOptionsBase, FormModel {}

export interface UnstableTempDownloadImageModalProps {
	application: Application;
	releaseId?: number;
	compatibleDeviceTypes: DeviceType[] | null;
	initialDeviceType?: DeviceType;
	initialOsVersions?: OsVersionsByDeviceType;
	isInitialDefault?: boolean;
	downloadUrl: string;
	onDownloadStart?: (
		downloadConfigOnly: boolean,
		downloadOptions: DownloadOptions,
	) => void;
	getSupportedOsVersions?: () => Promise<OsVersionsByDeviceType>;
	getSupportedOsTypes?: (
		applicationId: number,
		deviceTypeSlug: string,
	) => Promise<string[]>;
	downloadConfig?: (
		deviceType: DeviceType,
		rawVersion: string | null,
		model: FormModel,
	) => Promise<void>;
	getDownloadSize?: (
		deviceType: DeviceType,
		rawVersion: string | null,
	) => Promise<string> | undefined;
	getDockerArtifact: (deviceTypeSlug: string, rawVersion: string) => string;
	hasEsrVersions?: (deviceTypeSlugs: string[]) => Promise<Dictionary<boolean>>;
	onClose: () => void;
	modalActions?: ModalAction[];
	authToken?: string;
	docsIcon?: IconProp;
}

export const UnstableTempDownloadImageModal = ({
	downloadUrl,
	application,
	releaseId,
	compatibleDeviceTypes,
	initialDeviceType,
	initialOsVersions,
	isInitialDefault,
	onDownloadStart,
	getSupportedOsVersions,
	getSupportedOsTypes,
	getDockerArtifact,
	hasEsrVersions,
	downloadConfig,
	getDownloadSize,
	onClose,
	modalActions,
	authToken,
	docsIcon,
}: UnstableTempDownloadImageModalProps) => {
	const { t } = useTranslation();
	const [deviceType, setDeviceType] = React.useState(initialDeviceType);
	const [rawVersion, setRawVersion] = React.useState<string | null>(null);
	const [developmentMode, setDevelopmentMode] = React.useState(false);
	const [osVersions, setOsVersions] = React.useState<OsVersionsByDeviceType>(
		initialOsVersions ?? {},
	);
	const [osType, setOsType] = React.useState<string | undefined>();
	const [osTypes, setOsTypes] = React.useState<string[]>(
		getUniqueOsTypes(osVersions, deviceType?.slug),
	);

	const [deviceTypeHasEsr, setDeviceTypeHasEsr] = React.useState<
		Dictionary<boolean>
	>(
		deviceType?.slug
			? { [deviceType.slug]: osTypes.includes(OsTypesEnum.ESR) }
			: {},
	);

	const [isDownloadingConfig, setIsDownloadingConfig] = React.useState(false);
	const [isFetching, setIsFetching] = React.useState(isEmpty(osVersions));

	const logoSrc = deviceType?.logo ?? deviceType?.logoUrl ?? undefined;
	const defaultDisplayName = deviceType?.name ?? '-';

	React.useEffect(() => {
		if (!compatibleDeviceTypes || !hasEsrVersions) {
			return;
		}
		hasEsrVersions(compatibleDeviceTypes.map((dt) => dt.slug)).then(
			setDeviceTypeHasEsr,
		);
	}, [compatibleDeviceTypes]);

	React.useEffect(() => {
		if (!deviceType) {
			return;
		}
		const osTypes = getUniqueOsTypes(osVersions, deviceType.slug);
		if (!osTypes.length) {
			return;
		}
		if (!!osType) {
			if (!osTypes.includes(osType)) {
				setOsType(osTypes[0]);
			}
		} else {
			setOsType(
				osTypes.includes(OsTypesEnum.ESR) ? OsTypesEnum.ESR : osTypes[0],
			);
		}
	}, [deviceType?.slug, osType, osVersions]);

	React.useEffect(() => {
		if (!compatibleDeviceTypes || !getSupportedOsVersions) {
			return;
		}
		// const applicationType = getExpanded(application.application_type);
		// as soon as the modal opens, start fetching the osVersions for all
		// the compatible device types
		getSupportedOsVersions()
			.then(setOsVersions)
			.catch((e) => {
				console.error(e);
			})
			.finally(() => setIsFetching(false));
	}, [compatibleDeviceTypes, application]);

	React.useEffect(() => {
		if (!deviceType || !getSupportedOsTypes) {
			return;
		}
		// Fetch the supported os types, so we can show the appropriate values in the Select box.
		// We only want to do it once, and we rely on the cached data here.
		getSupportedOsTypes(application.id, deviceType?.slug).then(setOsTypes);
	}, [deviceType?.slug, application.id]);

	if (!deviceType) {
		return null;
	}

	return (
		<FooterlessModal
			width={1400}
			titleElement={
				// fixed height prevents jumping due to the logo size changing.
				<Flex style={{ height: 32 }} alignItems="center">
					<DeviceLogo small={false} src={logoSrc} title={defaultDisplayName} />
					<Txt.span ml={3}>{t('actions.add_new_device')}</Txt.span>
					<Button
						ml="auto"
						icon={<FontAwesomeIcon icon={faTimes} />}
						plain
						onClick={onClose}
					></Button>
				</Flex>
			}
			cancel={onClose}
			done={noop}
		>
			<Flex flexDirection={['column', 'column', 'column', 'row']}>
				<Box flex={2} mr={[0, 0, 0, 3]}>
					<Spinner
						show={isDownloadingConfig}
						label={t('loading.generating_configuration_file')}
					>
						<Spinner show={isFetching} label={t('loading.fetching_versions')} />
						{!isFetching && (
							<>
								{isEmpty(osVersions) && (
									<Alert plaintext warning>
										{t('no_data.no_os_versions_available_for_download')}
									</Alert>
								)}
								{!!osType && !!compatibleDeviceTypes && (
									<ImageForm
										onDownloadStart={onDownloadStart}
										setIsDownloadingConfig={setIsDownloadingConfig}
										deviceType={deviceType}
										appId={application.id}
										releaseId={releaseId}
										downloadUrl={downloadUrl}
										rawVersion={rawVersion}
										developmentMode={developmentMode}
										modalActions={modalActions}
										authToken={authToken}
										{...(downloadConfig && {
											downloadConfig: ({
												appId,
												releaseId,
												deviceType: _deviceTypeSlug,
												version,
												...model
											}) =>
												// TODO: Change this to be passing the whole model
												downloadConfig(deviceType, version, model),
										})}
										{...(getDownloadSize && {
											getDownloadSize: async () =>
												getDownloadSize(deviceType, rawVersion),
										})}
										configurationComponent={
											<OsConfiguration
												compatibleDeviceTypes={compatibleDeviceTypes}
												selectedDeviceType={deviceType}
												selectedOsType={osType}
												deviceTypeOsVersions={osVersions}
												osTypes={osTypes}
												isInitialDefault={isInitialDefault}
												onSelectedDeviceTypeChange={setDeviceType}
												onSelectedVersionChange={setRawVersion}
												onSelectedDevelopmentMode={setDevelopmentMode}
												onSelectedOsTypeChange={setOsType}
												hasEsrVersions={
													deviceTypeHasEsr[deviceType.slug] ?? false
												}
												docsIcon={docsIcon}
											/>
										}
									/>
								)}
							</>
						)}
					</Spinner>
				</Box>
				<Box flex={1} ml={[0, 0, 0, 3]} mt={[3, 0, 0, 0]}>
					<ApplicationInstructions
						deviceType={deviceType}
						templateData={{
							dockerImage: rawVersion
								? getDockerArtifact(
										deviceType.slug,
										stripVersionBuild(rawVersion),
								  )
								: '',
						}}
					/>
				</Box>
			</Flex>
		</FooterlessModal>
	);
};
