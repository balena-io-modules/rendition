import { AutoUIBaseResource, AutoUIRawModel } from '../schemaOps';
import { autoUIDefaultPermissions } from './helpers';

export interface AugmentedSshKey extends AutoUIBaseResource<AugmentedSshKey> {
	title: string;
	description: string;
	public_key: string;
	id: number;
	fingerprint?: string;
}

export const model: AutoUIRawModel<AugmentedSshKey> = {
	resource: 'sshKey',
	schema: {
		type: 'object',
		required: ['title', 'public_key'],
		properties: {
			id: {
				title: 'Id',
				type: 'number',
			},
			title: {
				title: 'Title',
				type: 'string',
			},
			description: {
				title: 'Description',
				type: 'string',
			},
			fingerprint: {
				title: 'Fingerprint',
				type: 'string',
			},
			public_key: {
				title: 'Public key',
				type: 'string',
				format: 'public-key',
				pattern:
					'^(ssh-rsa|ssh-dss|ssh-ed25519|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521) [A-Za-z0-9+/=]+( [^\b\n\v\f\r]+)*$',
			},
		},
	},
	permissions: {
		default: autoUIDefaultPermissions,
		administrator: {
			read: ['id', 'title', 'description', 'public_key', 'fingerprint'],
			create: ['title', 'public_key'],
			update: ['title', 'public_key'],
			delete: true,
		},
	},
	priorities: {
		primary: ['title'],
		secondary: ['description', 'public_key', 'fingerprint'],
		tertiary: [],
	},
};

export const transformers = {
	__permissions: () => model.permissions.administrator,
};

export const dataExample = [
	{
		id: 1,
		title: 'test1',
		description: 'Description key test1',
		public_key:
			'ecdsa-sha2-nistp521 faMAKw1VP0720N3IledQ38PA9RcnuUIR7wIprQK45y6QfxssSwNTI4r3AI9pJM',
		fingerprint: 'e1:c23:77:24:16:33:12:54:c3:98:9z:fr:0x:57:dg:0h',
	},
	{
		id: 2,
		title: 'test2',
		description: 'Description key test2',
		public_key:
			'ecdsa-sha2-nistp521 faMAKw1VP0720N3IledQ38PA9RcnuUIR7wIprQK45y6QfxssSwNTI4r3AI9pJM',
		fingerprint: 'e1:c23:77:24:16:33:12:54:c3:98:9z:fr:0x:57:dg:0h',
	},
	{
		id: 3,
		title: 'test3',
		description: 'Description key test3',
		public_key:
			'ecdsa-sha2-nistp521 faMAKw1VP0720N3IledQ38PA9RcnuUIR7wIprQK45y6QfxssSwNTI4r3AI9pJM',
		fingerprint: 'e1:c23:77:24:16:33:12:54:c3:98:9z:fr:0x:57:dg:0h',
	},
	{
		id: 4,
		title: 'test4',
		description: 'Description key test4',
		public_key:
			'ecdsa-sha2-nistp521 faMAKw1VP0720N3IledQ38PA9RcnuUIR7wIprQK45y6QfxssSwNTI4r3AI9pJM',
		fingerprint: 'e1:c23:77:24:16:33:12:54:c3:98:9z:fr:0x:57:dg:0h',
	},
	{
		id: 5,
		title: 'test5',
		description: 'Description key test5',
		public_key:
			'ecdsa-sha2-nistp521 faMAKw1VP0720N3IledQ38PA9RcnuUIR7wIprQK45y6QfxssSwNTI4r3AI9pJM',
		fingerprint: 'e1:c23:77:24:16:33:12:54:c3:98:9z:fr:0x:57:dg:0h',
	},
	{
		id: 6,
		title: 'test6',
		description: 'Description key test6',
		public_key:
			'ecdsa-sha2-nistp521 faMAKw1VP0720N3IledQ38PA9RcnuUIR7wIprQK45y6QfxssSwNTI4r3AI9pJM',
		fingerprint: 'e1:c23:77:24:16:33:12:54:c3:98:9z:fr:0x:57:dg:0h',
	},
	{
		id: 7,
		title: 'test7',
		description: 'Description key test7',
		public_key:
			'ecdsa-sha2-nistp521 faMAKw1VP0720N3IledQ38PA9RcnuUIR7wIprQK45y6QfxssSwNTI4r3AI9pJM',
		fingerprint: 'e1:c23:77:24:16:33:12:54:c3:98:9z:fr:0x:57:dg:0h',
	},
];
