import * as React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Flex } from '../../components/Flex';
import { Select } from '../../components/Select';
import { Txt } from '../../components/Txt';
import { DeviceLogo } from './DownloadImageModal';
import { DeviceType } from './models';

interface DeviceTypeOptionProps {
	deviceType?: DeviceType;
	isSelected?: boolean;
	isOption?: boolean;
	emphasized?: boolean;
}

const DeviceTypeOption = ({
	deviceType,
	isSelected,
	emphasized,
	isOption = false,
}: DeviceTypeOptionProps) => {
	const { t } = useTranslation();
	const typeDisplayName =
		deviceType?.name ?? t('placeholders.choose_device_type');
	const logoSrc = deviceType?.logoUrl ?? undefined;
	const defaultDisplayName = deviceType?.name ?? '-';

	return (
		<Flex
			style={{ height: emphasized ? 46 : 36 }}
			py={2}
			pl={3}
			width="100%"
			alignItems="center"
		>
			{!isOption && <DeviceLogo src={logoSrc} title={defaultDisplayName} />}
			<Txt
				className={isOption ? 'e2e-device-type-option' : ''}
				ml={2}
				bold={isSelected}
			>
				{typeDisplayName}
			</Txt>
		</Flex>
	);
};

interface DeviceTypeSelectorProps {
	deviceTypeOptions: DeviceType[];
	selectedDeviceType: DeviceType;
	selectDeviceTypeOption: (deviceType: DeviceType | null) => void;
	emphasized?: boolean;
	id?: string;
}

const DeviceTypeSelectorBase = ({
	deviceTypeOptions,
	selectedDeviceType,
	selectDeviceTypeOption,
	emphasized,
	id,
}: DeviceTypeSelectorProps) => {
	const [query, setQuery] = React.useState('');
	const [filteredDeviceTypes, setFilteredDeviceTypes] = React.useState<
		DeviceType[]
	>([]);

	React.useEffect(() => {
		const filtered = deviceTypeOptions.filter(
			(s) => s.name.toLowerCase().indexOf(query.toLowerCase()) >= 0,
		);

		setFilteredDeviceTypes(filtered);
	}, [deviceTypeOptions, query]);

	React.useEffect(() => {
		if (deviceTypeOptions.length === 0) {
			return;
		}

		if (!deviceTypeOptions.some((dt) => dt.slug === selectedDeviceType.slug)) {
			selectDeviceTypeOption(null);
		}
	}, [deviceTypeOptions, selectedDeviceType, selectDeviceTypeOption]);

	return (
		<Select<DeviceType>
			id={id}
			emphasized={emphasized}
			options={filteredDeviceTypes}
			valueKey="slug"
			labelKey="name"
			value={selectedDeviceType || {}}
			placeholder={<DeviceTypeOption emphasized={emphasized} />}
			valueLabel={
				<DeviceTypeOption
					emphasized={emphasized}
					deviceType={selectedDeviceType}
				/>
			}
			onChange={({ option }) => {
				selectDeviceTypeOption(option);
				setQuery('');
			}}
			onSearch={setQuery}
		>
			{(option) => (
				<DeviceTypeOption
					deviceType={option}
					isSelected={option.slug === selectedDeviceType.slug}
					isOption={true}
				/>
			)}
		</Select>
	);
};

export const DeviceTypeSelector = React.memo(DeviceTypeSelectorBase);
