import filter = require('lodash/filter');
import * as React from 'react';
import { compose } from 'recompose';
import * as ResinDeviceStatus from 'resin-device-status';
import { withTheme } from 'styled-components';
import Gauge from './Gauge';

import { DeviceStatusGaugeProps } from 'rendition';
import asRendition from '../asRendition';
import theme from '../theme';

const { colors } = theme;

const pathFillColor = (status?: string) => {
	if (status === 'idle') {
		return colors.statusIdle.main;
	}

	if (status === 'configuring') {
		return colors.statusConfiguring.main;
	}

	if (status === 'updating') {
		return colors.statusUpdating.main;
	}

	if (status === 'post-provisioning') {
		return colors.statusPostProvisioning.main;
	}

	if (status === 'offline') {
		return colors.statusOffline.main;
	}
};

const DeviceStatusGauge = ({ devices, ...props }: DeviceStatusGaugeProps) => {
	const data: any[] = [];
	const allDevices = devices || [];

	ResinDeviceStatus.statuses.forEach(
		(status: ResinDeviceStatus.DeviceStatus) => {
			const devices = filter(
				allDevices,
				d => ResinDeviceStatus.getStatus(d).key === status.key,
			);

			data.push({
				key: status.key,
				name: status.name,
				value: devices.length,
				color: pathFillColor(status.key),
			});
		},
	);

	return (
		<Gauge
			{...props}
			data={data}
			title="Total Devices"
			placeholderColor={colors.statusOffline.main}
		/>
	);
};

export default compose(withTheme, asRendition)(
	DeviceStatusGauge,
) as React.ComponentClass<DeviceStatusGaugeProps>;
