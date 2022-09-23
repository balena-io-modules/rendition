import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Alert } from '../../components/Alert';
import { ButtonProps } from '../../components/Button';
import { DropDownButton } from '../../components/DropDownButton';
import { Flex } from '../../components/Flex';
import { Txt } from '../../components/Txt';
import { DownloadFormModel, FormModel } from './FormModel';
import {
	DeviceType,
	DeviceTypeOptions,
	DeviceTypeOptionsGroup,
} from './models';
import { DownloadOptions, DownloadOptionsBase } from './DownloadImageModal';
import { TFunction } from '../../hooks/useTranslation';
import pickBy from 'lodash/pickBy';

const ETCHER_OPEN_IMAGE_URL = 'https://www.balena.io/etcher/open-image-url';
const POLL_INTERVAL_DOCS =
	'https://www.balena.io/docs/reference/supervisor/bandwidth-reduction/#side-effects--warnings';

const debounceDownloadSize = debounce(
	async (
		getDownloadSize: NonNullable<ImageFormProps['getDownloadSize']>,
		deviceTypeSlug: string,
		rawVersion: string,
		setDownloadSize: (value: string | null) => void,
	) => {
		try {
			setDownloadSize(
				(await getDownloadSize(deviceTypeSlug, rawVersion)) ?? null,
			);
		} catch {
			setDownloadSize(null);
		}
	},
	200,
	{
		trailing: true,
		leading: false,
	},
);

const getDeviceTypeOptions = (t: TFunction, deviceType: DeviceType) => {
	if (!deviceType.options) {
		return [];
	}

	return cloneDeep(deviceType.options).map((group) => {
		// Add an extra label value for network config
		if (group.name === 'network') {
			group.options.forEach((g) => {
				if (g.name === 'network') {
					g.choicesLabels = {
						ethernet: 'Ethernet only',
						wifi: 'Wifi + Ethernet',
					};
				}
			});
		}

		// Add extra input field to advanced config
		if (group.name === 'advanced') {
			group.options.push({
				message: t('labels.provisioning_key_name'),
				name: 'provisioningKeyName',
				default: '',
				type: 'text',
			});

			group.options.push({
				message: t('labels.provisioning_key_expiry_date'),
				name: 'provisioningKeyExpiryDate',
				default: '',
				type: 'datetime-local',
			});

			group.options.map((option) => {
				if (option.message === 'Check for updates every X minutes') {
					option.docs = POLL_INTERVAL_DOCS;
				}
				return option;
			});
		}

		return group;
	});
};

const isDownloadDisabled = (
	formModel: FormModel,
	rawVersion: ImageFormProps['rawVersion'],
) => {
	if (!rawVersion) {
		return true;
	}

	return formModel.network === 'wifi' && !formModel.wifiSsid;
};

const flashWithEtcher = (
	_event: React.MouseEvent,
	model: DownloadOptions,
	downloadUrl: string,
	authToken?: string,
) => {
	const modelCopy = { ...model };
	// TODO check if possible to edit Etcher to avoid a double encode on the version.
	if (modelCopy.version) {
		modelCopy.version = encodeURIComponent(modelCopy.version);
	}
	if (modelCopy.network === 'ethernet') {
		modelCopy.wifiSsid = undefined;
		modelCopy.wifiKey = undefined;
	}
	const queryParams = Object.entries(modelCopy)
		.map(([key, value]) => (!!value ? `${key}=${value}` : null))
		.filter((param) => !!param)
		.join('&');
	const imageUrl = `${downloadUrl}?${queryParams}`;
	console.log('ROSE imageUrl', imageUrl);
	const data = pickBy(modelCopy, (value) => !!value);
	console.log('ROSE data', data);
	const axiosConfig = {
		method: 'POST',
		url: imageUrl,
		...(authToken && {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		}),
		data,
	};

	// TODO: Check how to remove from resin site the decode and avoid this double encodeURIComponent on a stringified obj
	const stringifiedAxiosConfig = encodeURIComponent(
		JSON.stringify(axiosConfig),
	);
	console.log('ROSE stringifiedAxiosConfig', stringifiedAxiosConfig);
	window.open(
		`${ETCHER_OPEN_IMAGE_URL}?imageUrl=${encodeURIComponent(
			stringifiedAxiosConfig,
		)}`,
		'_blank',
	);
};

export type ModalAction = Omit<ButtonProps, 'onClick' | 'label'> & {
	label: string;
	onClick?: (event: React.MouseEvent, model: DownloadOptions) => void;
};

interface ImageFormProps {
	downloadUrl: string;
	appId: number;
	releaseId?: number;
	rawVersion: string | null;
	developmentMode: boolean;
	deviceType: DeviceType;
	authToken?: string;
	onDownloadStart?: (
		downloadConfigOnly: boolean,
		downloadOptions: DownloadOptions,
	) => void;
	setIsDownloadingConfig: (isDownloading: boolean) => void;
	downloadConfig?: (model: DownloadOptions) => Promise<void> | undefined;
	getDownloadSize?: (
		slug: string,
		version: string | null,
	) => Promise<string | undefined>;
	modalActions?: ModalAction[];
	configurationComponent: React.ReactNode;
}

export const ImageForm = ({
	downloadUrl,
	appId,
	releaseId,
	rawVersion,
	developmentMode,
	deviceType,
	authToken,
	onDownloadStart,
	setIsDownloadingConfig,
	downloadConfig,
	getDownloadSize,
	modalActions,
	configurationComponent,
}: ImageFormProps) => {
	const { t } = useTranslation();
	const formElement = React.useRef<HTMLFormElement | null>(null);
	const [downloadSize, setDownloadSize] = React.useState<string | null>(null);
	// If the image is deployed to docker, we only offer config
	// download, so there is no need to show the toggle
	const hasDockerImageDownload =
		deviceType?.yocto?.deployArtifact === 'docker-image';
	const [downloadConfigOnly, setDownloadConfigOnly] = React.useState(
		hasDockerImageDownload,
	);
	const [model, setModel] = React.useState<FormModel>({});

	const downloadOptionsBase = React.useMemo(
		(): DownloadOptionsBase => ({
			appId,
			releaseId,
			deviceType: deviceType.slug,
			version: rawVersion ?? '',
			developmentMode,
		}),
		[appId, releaseId, deviceType, rawVersion, developmentMode],
	);

	const downloadOptions = React.useMemo(
		(): DownloadOptions => ({
			...downloadOptionsBase,
			...model,
		}),
		[downloadOptionsBase, model],
	);

	const actions: ModalAction[] = [
		...(modalActions ?? []),
		{
			plain: true,
			onClick: (event) =>
				flashWithEtcher(event, downloadOptions, downloadUrl, authToken),
			icon: <img width="20px" alt="etcher" src={etcherLogoBase64} />,
			disabled: hasDockerImageDownload,
			tooltip: hasDockerImageDownload
				? t('warnings.image_deployed_to_docker')
				: t('warning.etcher_min_requirement'),
			label: t('actions.flash'),
		},
		{
			plain: true,
			onClick: (event) =>
				etchWithEtcher(event, downloadOptions, downloadUrl, authToken),
			icon: <img width="20px" alt="etcher" src={etcherLogoBase64} />,
			disabled: hasDockerImageDownload,
			tooltip: hasDockerImageDownload
				? t('warnings.image_deployed_to_docker')
				: t('warning.etcher_min_requirement'),
			label: t('actions.etch'),
		},
		{
			plain: true,
			onClick: () => {
				formElement?.current?.submit();
			},
			icon: <FontAwesomeIcon icon={faDownload} />,
			disabled: hasDockerImageDownload,
			tooltip: hasDockerImageDownload
				? t('warnings.image_deployed_to_docker')
				: '',
			label: `${t('actions.download_balenaos')} ${
				rawVersion && downloadSize ? ` (~${downloadSize})` : ''
			}`,
			type: 'submit',
		},
	];

	if (!!downloadConfig) {
		actions.push({
			plain: true,
			onClick: async () => {
				if (downloadConfigOnly && downloadConfig) {
					setIsDownloadingConfig(true);
					await downloadConfig(downloadOptions);
					setIsDownloadingConfig(false);
				}
				startDownload(true);
			},
			icon: <FontAwesomeIcon icon={faDownload} />,
			label: t('actions.download_configuration_file_only'),
		});
	}

	const [selectedActionLabel, setSelectedActionLabel] = React.useState<string>(
		actions.find((a) => !a.disabled)?.label || actions[0].label,
	);

	const startDownload = (downloadConfigOnly: boolean) => {
		if (typeof onDownloadStart === 'function') {
			onDownloadStart(downloadConfigOnly, {
				...downloadOptions,
			});
		}
		setDownloadConfigOnly(downloadConfigOnly);
	};

	React.useEffect(() => {
		if (hasDockerImageDownload && !downloadConfigOnly) {
			setDownloadConfigOnly(true);
		}
	}, [hasDockerImageDownload, downloadConfigOnly]);

	React.useEffect(() => {
		if (!deviceType || !rawVersion || !getDownloadSize) {
			setDownloadSize(null);
			return;
		}

		// Debounce as the version changes right after the devicetype does, resulting in multiple requests.
		debounceDownloadSize(
			getDownloadSize,
			deviceType.slug,
			rawVersion,
			setDownloadSize,
		);
	}, [deviceType?.slug, rawVersion]);

	const memoizedItems = React.useMemo(
		() =>
			!!actions?.length
				? [
						actions.map(({ label, tooltip, onClick, disabled }) => ({
							disabled,
							content: (
								<Txt bold={selectedActionLabel === label} tooltip={tooltip}>
									{label}
								</Txt>
							),
							onClick: (event: React.MouseEvent) => {
								setSelectedActionLabel(label);
								onClick?.(event, downloadOptions);
							},
						})),
				  ]
				: [],
		[actions, downloadOptions],
	);

	const options = React.useMemo<DeviceTypeOptions[]>(
		() => getDeviceTypeOptions(t, deviceType),
		[t, deviceType],
	);

	const isInputValid = React.useMemo(() => {
		const opts = options.map((option) => {
			const optionOptions = option.options.map(
				(opt: DeviceTypeOptionsGroup) => {
					const value = model[opt.name];
					if (value !== undefined && typeof value === 'number') {
						if (opt.min) {
							if (value < opt.min) {
								return false;
							}
						}
						if (opt.max) {
							if (value > opt.max) {
								return false;
							}
						}
					}
					return true;
				},
			);
			return !optionOptions.includes(false);
		});
		return !opts.includes(false);
	}, [options, model]);

	const action = actions.find((act) => act.label === selectedActionLabel);

	return (
		<form
			action={downloadUrl}
			target="_blank"
			method="post"
			autoComplete="off"
			style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
			ref={formElement}
		>
			<input type="hidden" name="_token" value={authToken} />
			<input name="fileType" value=".zip" type="hidden" />

			{Object.entries(downloadOptionsBase).map(([key, value]) => {
				if (value === undefined) {
					return null;
				}
				return <input type="hidden" name={key} key={key} value={`${value}`} />;
			})}

			{configurationComponent}

			<Flex flexDirection="column" flex="1">
				<DownloadFormModel
					model={model}
					onModelChange={setModel}
					options={options}
				/>
			</Flex>

			{(deviceType.imageDownloadAlerts ?? []).map((alert) => {
				return (
					<Alert
						key={alert.message}
						mb={3}
						info={alert.type === 'info'}
						warning={alert.type === 'warning'}
						danger={alert.type === 'danger'}
						success={alert.type === 'success'}
					>
						{alert.message}
					</Alert>
				);
			})}

			<Flex>
				<DropDownButton
					mt={2}
					primary
					ml="auto"
					className="e2e-download-image-submit"
					type={action?.type || 'button'}
					disabled={isDownloadDisabled(model, rawVersion) || !isInputValid}
					tooltip={
						isDownloadDisabled(model, rawVersion)
							? t('warnings.fill_wifi_credentials')
							: !isInputValid
							? t('warnings.some_fields_are_invalid')
							: action?.tooltip
					}
					onClick={(event: React.MouseEvent) => {
						if (downloadOptions.provisioningKeyExpiryDate) {
							// Convert to UTC for /download
							downloadOptions.provisioningKeyExpiryDate = new Date(
								downloadOptions.provisioningKeyExpiryDate,
							).toISOString();
						}

						if (action?.onClick) {
							action.onClick(event, downloadOptions);
						}
					}}
					icon={action?.icon}
					label={selectedActionLabel}
					alignRight
					dropUp
					items={memoizedItems}
				/>
			</Flex>
		</form>
	);
};

const etcherLogoBase64 =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5FdGNoZXI8L3RpdGxlPgogIDxnIGlkPSJzdmdfMSIgc3Ryb2tlPSJudWxsIj4KICAgPHBhdGggaWQ9InN2Z18yIiBjbGFzcz0ic3QxIiBkPSJtNDEyLjkwMzgzLDM1OC4wNjcxM2wwLDE3MS40OTU4M2M3LjQ5MjU0LC0xLjY2NTAxIDE0LjE1MjU3LC0zLjMzMDAyIDIwLjgxMjYsLTcuNDkyNTRsMTQyLjM1ODE5LC04MS41ODUzOWMyMC44MTI2LC0xMS42NTUwNiAzMy4zMDAxNiwtMzQuMTMyNjYgMzMuMzAwMTYsLTU4LjI3NTI4bDAsLTE2Mi4zMzgyOGMwLC02LjY2MDAzIC0wLjgzMjUsLTEzLjMyMDA2IC0zLjMzMDAyLC0xOS4xNDc1OWwtMTU0LjAxMzI0LDg5LjA3NzkzYy0zMi40Njc2NiwyMi40Nzc2MSAtMzkuMTI3NjksNDMuMjkwMjEgLTM5LjEyNzY5LDY4LjI2NTMzbDAsLTAuMDAwMDF6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z18zIiBjbGFzcz0ic3QyIiBkPSJtNjYyLjY1NTAzLDE2Ny40MjM3MWwtNTYuNjEwMjcsMzIuNDY3NjZjMS42NjUwMSw1LjgyNzUzIDMuMzMwMDIsMTIuNDg3NTYgMy4zMzAwMiwxOS4xNDc1OWwwLDE2My4xNzA3OWMwLDI0LjE0MjYyIC0xMy4zMjAwNiw0Ni42MjAyMiAtMzMuMzAwMTYsNTguMjc1MjhsLTE0Mi4zNTgxOSw4MS41ODUzOWMtNi42NjAwMywzLjMzMDAyIC0xMy4zMjAwNiw1LjgyNzUzIC0yMC44MTI2LDcuNDkyNTRsMCw2NC45MzUzMWM5Ljk5MDA1LC0xLjY2NTAxIDE5Ljk4MDEsLTQuOTk1MDIgMjguMzA1MTQsLTkuOTkwMDVsMTg0LjgxNTg5LC0xMDUuNzI4MDFjMjUuODA3NjIsLTE0Ljk4NTA3IDQxLjYyNTIsLTQyLjQ1NzcgNDEuNjI1MiwtNzIuNDI3ODVsMCwtMjExLjQ1NjAyYzAsLTkuMTU3NTQgLTEuNjY1MDEsLTE4LjMxNTA5IC00Ljk5NTAyLC0yNy40NzI2M2wtMC4wMDAwMSwweiIgZmlsbD0iI0M4RjE3OCIgc3Ryb2tlPSJudWxsIi8+CiAgIDxwYXRoIGlkPSJzdmdfNCIgY2xhc3M9InN0MSIgZD0ibTM5OS41ODM3NiwzMDMuOTU0MzZjOC4zMjUwNCwtMTMuMzIwMDYgMjAuODEyNiwtMjUuODA3NjIgMzkuMTI3NjksLTM2LjYzMDE4bDE1NS42NzgyNSwtODkuOTEwNDNjLTQuOTk1MDIsLTYuNjYwMDMgLTExLjY1NTA2LC0xMi40ODc1NiAtMTguMzE1MDksLTE2LjY1MDA4bC0xNDIuMzU4MTksLTgxLjU4NTM5Yy0yMC44MTI2LC0xMS42NTUwNiAtNDYuNjIwMjIsLTExLjY1NTA2IC02Ny40MzI4MiwwbC0xNDEuNTI1NjgsODEuNTg1MzljLTcuNDkyNTQsNC4xNjI1MiAtMTMuMzIwMDYsOS45OTAwNSAtMTkuMTQ3NTksMTYuNjUwMDhsMTU0Ljg0NTc1LDg5LjkxMDQzYzE4LjMxNTA5LDExLjY1NTA2IDMwLjgwMjY1LDIzLjMxMDExIDM5LjEyNzY5LDM2LjYzMDE4bC0wLjAwMDAxLDB6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z181IiBjbGFzcz0ic3QyIiBkPSJtMjI0Ljc1NzkyLDE2MS41OTYxOGwxNDEuNTI1NjgsLTgxLjU4NTM5YzIwLjgxMjYsLTExLjY1NTA2IDQ2LjYyMDIyLC0xMS42NTUwNiA2Ny40MzI4MiwwbDE0Mi4zNTgxOSw4MS41ODUzOWM3LjQ5MjU0LDQuMTYyNTIgMTMuMzIwMDYsOS45OTAwNSAxOC4zMTUwOSwxNi42NTAwOGw1Ni42MTAyNywtMzIuNDY3NjZjLTYuNjYwMDMsLTkuMTU3NTQgLTE0Ljk4NTA3LC0xNi42NTAwOCAtMjQuOTc1MTIsLTIxLjY0NTFsLTE4NC44MTU4OSwtMTA3LjM5MzAyYy0yNS44MDc2MiwtMTQuOTg1MDcgLTU3LjQ0Mjc4LC0xNC45ODUwNyAtODMuMjUwNCwwbC0xODMuMTUwODgsMTA2LjU2MDUxYy05Ljk5MDA1LDUuODI3NTMgLTE4LjMxNTA5LDEzLjMyMDA2IC0yNC45NzUxMiwyMi40Nzc2MWw1Ni42MTAyNywzMi40Njc2NmM0LjE2MjUyLC02LjY2MDAzIDEwLjgyMjU1LC0xMi40ODc1NiAxOC4zMTUwOSwtMTYuNjUwMDh6IiBmaWxsPSIjQzhGMTc4IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z182IiBjbGFzcz0ic3QyIiBkPSJtMzY2LjI4MzYsNTIyLjA3MDQxbC0xNDEuNTI1NjgsLTgxLjU4NTM5Yy0yMC44MTI2LC0xMS42NTUwNiAtMzMuMzAwMTYsLTM0LjEzMjY2IC0zMy4zMDAxNiwtNTguMjc1MjhsMCwtMTYzLjE3MDc5YzAsLTYuNjYwMDMgMC44MzI1LC0xMi40ODc1NiAyLjQ5NzUxLC0xOC4zMTUwOWwtNTYuNjEwMjcsLTMyLjQ2NzY2Yy0zLjMzMDAyLDkuMTU3NTQgLTQuOTk1MDIsMTcuNDgyNTggLTQuOTk1MDIsMjYuNjQwMTNsMCwyMTIuMjg4NTJjMCwyOS45NzAxNCAxNS44MTc1OCw1Ny40NDI3OCA0MS42MjUyLDcxLjU5NTM0bDE4My45ODMzOSwxMDUuNzI4MDFjOC4zMjUwNCw0Ljk5NTAyIDE4LjMxNTA5LDguMzI1MDQgMjguMzA1MTQsOS45OTAwNWwwLC02NC45MzUzMWMtNi42NjAwMywtMC44MzI1IC0xMy4zMjAwNiwtMy4zMzAwMiAtMTkuOTgwMSwtNy40OTI1NGwtMC4wMDAwMSwwLjAwMDAxeiIgZmlsbD0iI0M4RjE3OCIgc3Ryb2tlPSJudWxsIi8+CiAgIDxwYXRoIGlkPSJzdmdfNyIgY2xhc3M9InN0MSIgZD0ibTM0Ny4xMzYwMSwyODguOTY5MjlsLTE1My4xODA3NCwtODguMjQ1NDJjLTEuNjY1MDEsNS44Mjc1MyAtMi40OTc1MSwxMi40ODc1NiAtMi40OTc1MSwxOC4zMTUwOWwwLDE2My4xNzA3OWMwLDI0LjE0MjYyIDEyLjQ4NzU2LDQ2LjYyMDIyIDMzLjMwMDE2LDU4LjI3NTI4bDE0MS41MjU2OCw4MS41ODUzOWM2LjY2MDAzLDMuMzMwMDIgMTMuMzIwMDYsNS44Mjc1MyAyMC44MTI2LDcuNDkyNTRsMCwtMTcxLjQ5NTgzYy0wLjgzMjUsLTI0Ljk3NTEyIC03LjQ5MjU0LC00NS43ODc3MiAtMzkuOTYwMTksLTY5LjA5NzgzbDAsLTAuMDAwMDF6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICA8L2c+CiA8L2c+Cgo8L3N2Zz4=';
