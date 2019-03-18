declare module 'resin-device-status' {
	export interface DeviceStatus {
		key?: string;
		name?: string;
		value?: number;
		color?: string;
	}

	export const statuses: DeviceStatus[];
	export function getStatus(device: any): DeviceStatus;
}
