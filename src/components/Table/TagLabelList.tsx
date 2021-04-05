import * as React from 'react';
import styled from 'styled-components';
import { TagLabel as TagLabelBase, TagLabelProps } from './TagLabel';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import { TxtProps } from '../Txt';
import { ResourceTagBase } from './TableUtils';
import { Flex } from '../Flex';

export const TagLabel = styled(TagLabelBase)`
	display: inline-flex;
	max-width: 200px;
` as React.ComponentType<TagLabelProps>;

const getDefaultState = () => ({
	sortedTags: [],
});

interface TagLabelListProps extends TxtProps {
	tags: ResourceTagBase[];
	nowrap?: boolean;
}

interface TagLabelListState {
	sortedTags: ResourceTagBase[];
}

export class TagLabelList extends React.Component<
	TagLabelListProps,
	TagLabelListState
> {
	constructor(props: TagLabelListProps) {
		super(props);
		this.state = getDefaultState();
	}

	public componentDidMount() {
		this.setState({ sortedTags: sortBy(this.props.tags || [], 'tag_key') });
	}

	public componentWillReceiveProps({ tags }: TagLabelListProps) {
		if (!this.state.sortedTags || !isEqual(this.props.tags, tags)) {
			this.setState({ sortedTags: sortBy(tags || [], 'tag_key') });
		}
	}

	public render() {
		const { tags, nowrap, ...restProps } = this.props;
		return (
			<Flex mx="-5px" flexWrap={nowrap ? 'nowrap' : 'wrap'} {...restProps}>
				{map(this.state.sortedTags, (tag) => (
					<TagLabel
						key={tag.tag_key}
						tag={tag}
						mx="5px"
						my={nowrap ? undefined : '5px'}
					/>
				))}
			</Flex>
		);
	}
}