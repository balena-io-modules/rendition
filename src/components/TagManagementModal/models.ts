export type TaggedResource = { id: number };

export interface ResourceTagBase {
	id: number;
	tag_key: string;
	value: string;
}

export type ResourceTagInfoState = 'added' | 'updated' | 'deleted';

export interface ResourceTagInfo<T> {
	tag_key: string;
	value: string;
	initialValue?: string;
	items: T[];
	state?: ResourceTagInfoState;
}

export interface ResourceTagSubmitInfo {
	resourceId: number;
	tag_key: string;
	value: string;
}

export interface SubmitInfo<T, TDeleted> {
	added: T[];
	updated: T[];
	deleted: TDeleted[];
}
