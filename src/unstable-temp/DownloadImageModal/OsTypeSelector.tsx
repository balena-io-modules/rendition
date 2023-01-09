import * as React from 'react';
import { Badge } from '../../components/Badge';
import { Flex } from '../../components/Flex';
import { Select, SelectProps } from '../../components/Select';
import { Txt } from '../../components/Txt';
import { useTranslation } from '../../hooks/useTranslation';
import { OsTypesEnum } from './models';
import { getOsTypeName } from './utils';

interface OsTypeSelectorProps<T>
	extends Omit<
		SelectProps<T>,
		| 'options'
		| 'onChange'
		| 'valueKey'
		| 'disabledKey'
		| 'valueLabel'
		| 'children'
	> {
	supportedOsTypes: string[];
	hasEsrVersions: boolean;
	selectedOsTypeSlug: string | undefined;
	onSelectedOsTypeChange: (osType: string) => void;
}

interface OsTypeObj {
	slug: string;
	disabled: boolean;
	supportedForDeviceType: boolean;
	supportedForApp: boolean;
}

const OsTypeOption = ({
	osType,
	bold,
}: {
	osType: OsTypeObj | undefined;
	bold?: boolean;
}) => {
	const { t } = useTranslation();
	if (!osType) {
		return <Txt.span>{t('placeholders.select_os_type')}</Txt.span>;
	}
	return (
		<Flex width="100%" justifyContent="space-between" alignItems="center">
			<Txt.span bold={bold}>{getOsTypeName(osType.slug)}</Txt.span>
			<Flex>
				{!osType.supportedForDeviceType && (
					<Badge mx={2} shade={11}>
						{t('no_data.no_versions_yet')}
					</Badge>
				)}
				{!osType.supportedForApp && (
					<Badge shade={6} mx={2}>
						{t('info.production_and_enterprise_plan_only')}
					</Badge>
				)}
			</Flex>
		</Flex>
	);
};

export const OsTypeSelector = ({
	supportedOsTypes,
	hasEsrVersions,
	selectedOsTypeSlug,
	onSelectedOsTypeChange,
	...otherProps
}: OsTypeSelectorProps<OsTypeObj>) => {
	const { t } = useTranslation();
	const selectOsTypes = Object.values({
		default: OsTypesEnum.DEFAULT,
		ESR: OsTypesEnum.ESR,
	}).map<OsTypeObj>((osType: OsTypesEnum) => {
		const supportedForDeviceType =
			osType === OsTypesEnum.ESR ? hasEsrVersions : true;
		const supportedForApp = supportedOsTypes.includes(osType);
		const disabled = !supportedForApp || !supportedForDeviceType;

		return {
			slug: osType,
			disabled,
			supportedForDeviceType,
			supportedForApp,
		};
	});

	const selectedOsType = selectOsTypes.find(
		(osType) =>
			osType.slug === selectedOsTypeSlug && osType.supportedForDeviceType,
	);

	return (
		<Select<(typeof selectOsTypes)[number]>
			id="newAppApplicationType"
			options={selectOsTypes}
			valueKey="slug"
			disabledKey="disabled"
			disabled={supportedOsTypes.length === 0}
			value={selectedOsType}
			valueLabel={
				<Flex width="100%" py={2} pl={3}>
					<OsTypeOption osType={selectedOsType} />
				</Flex>
			}
			onChange={({ option }) =>
				!option.disabled && onSelectedOsTypeChange(option.slug)
			}
			{...otherProps}
		>
			{(option) => (
				<Flex
					tooltip={
						!option.supportedForDeviceType
							? t('info.no_esr_versions_are_available_for_device_type')
							: undefined
					}
					flexDirection="column"
					py={2}
					pl={3}
				>
					<OsTypeOption
						osType={option}
						bold={selectedOsTypeSlug === option.slug}
					/>
				</Flex>
			)}
		</Select>
	);
};
