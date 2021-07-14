import {
	ResourceTagBase,
	ResourceTagInfo,
	ResourceTagSubmitInfo,
	SubmitInfo,
	TaggedResource,
} from './models';
import keys from 'lodash/keys';
import flatMap from 'lodash/flatMap';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';

export const TAGS_COLUMN_KEY = 'Tags';

export const getTagKeyValueComposite = (tagKey: string, value: string) =>
	`${tagKey}: ${value}`;

export const getResourceTags = <T extends {}, P extends keyof T>(
	item: T,
	tagField: P,
) => ((tagField in item ? item[tagField] : null) ?? []) as ResourceTagBase[];

export const groupResourcesByTags = <
	T extends TaggedResource,
	P extends keyof T,
>(
	items: T[],
	tagField: P,
) => {
	const resourceTagInfos = flatMap(items, (item) => {
		const tags = getResourceTags(item, tagField);
		return tags.map((tag) => ({
			tag_key_value: getTagKeyValueComposite(tag.tag_key, tag.value),
			tag_key: tag.tag_key,
			value: tag.value,
			item,
		}));
	});

	const tagsByTagKeyValue = groupBy(resourceTagInfos, 'tag_key_value');
	const tagsWithItems = map(keys(tagsByTagKeyValue).sort(), (tagKeyValue) => {
		const tags = tagsByTagKeyValue[tagKeyValue];
		const firstTag = tags[0];
		return {
			tag_key: firstTag.tag_key,
			value: firstTag.value,
			items: map(tags, 'item'),
		} as ResourceTagInfo<T>;
	});

	return tagsWithItems;
};

export interface ResourceTagModelService {
	submit(
		tagSubmitInfo: SubmitInfo<ResourceTagSubmitInfo, ResourceTagSubmitInfo>,
	): Promise<void>;
}

export const getResourceTagSubmitInfo = <T extends TaggedResource>(
	tags: Array<ResourceTagInfo<T>>,
) => {
	const submitInfo: SubmitInfo<ResourceTagSubmitInfo, ResourceTagSubmitInfo> = {
		added: [],
		updated: [],
		deleted: [],
	};

	tags.forEach((tag) => {
		if (tag.state && tag.state in submitInfo) {
			Array.prototype.push.apply(
				submitInfo[tag.state],
				tag.items.map<ResourceTagSubmitInfo>((item) => ({
					resourceId: item.id,
					tag_key: tag.tag_key,
					value: tag.value,
				})),
			);
		}
	});

	return submitInfo;
};
