import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/useTranslation';
import { stopEvent } from '../../utils';
import { ResourceTagBase } from './models';
import { Txt, TxtProps } from '../Txt';

const Label = styled(Txt.span)`
	display: inline-flex;
	align-items: stretch;
	justify-content: stretch;
	max-width: 100%;
	height: 30px;
	padding: 7px;
	border: 0.5px solid ${(props) => props.theme.colors.info.main};
	font-size: 11px;
	font-weight: bold;
	border-radius: 3px;
	color: ${(props) => props.theme.colors.info.main};
	background-color: ${(props) => props.theme.colors.info.light};
	position: relative;
`;

const TagText = styled(Txt.span)`
	display: inline-block;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	${Label}:hover & {
		opacity: 0.5;
	}
`;

const TagValue = styled.span`
	font-weight: normal;
`;

const CopyButton = styled.span`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${(props) => props.theme.colors.text.main};
	user-select: none;
	cursor: pointer;
	visibility: hidden;

	${Label}:hover & {
		visibility: visible;
	}
`;

const FaCopyBase = (props: any) => <FontAwesomeIcon icon={faCopy} {...props} />;

const FaCopy = styled(FaCopyBase)`
	background-color: ${(props) => props.theme.colors.info.light};
	box-shadow: 0 0 1px 3px ${(props) => props.theme.colors.info.light};
`;

const getTagCompositeText = (tag: ResourceTagBase) => {
	let text = tag.tag_key;
	if (tag.value) {
		text = `${text} : ${tag.value}`;
	}
	return text;
};

export interface TagLabelProps extends TxtProps {
	tag?: ResourceTagBase;
	maxValueLength?: number;
	wrapValue?: boolean;
	showTagKey?: boolean;
	placeholder?: string;
}

export const TagLabel = (props: TagLabelProps) => {
	const { t } = useTranslation();
	const {
		tag,
		maxValueLength,
		wrapValue,
		showTagKey = true,
		placeholder = t('no_data.no_value') as string,
		...restProps
	} = props;

	if (!tag) {
		return null;
	}

	const compositeTagString = getTagCompositeText(tag);
	const tagCopyValue = showTagKey
		? compositeTagString
		: tag.value || placeholder;
	return (
		<Label onClick={stopEvent} title={compositeTagString} {...restProps}>
			<TagText
				tooltip={{
					text: t('actions_messages.copied'),
					trigger: 'click',
				}}
			>
				{showTagKey && tag.tag_key}
				{showTagKey && tag.value && ': '}
				{tag.value && (
					<TagValue style={{ whiteSpace: wrapValue ? 'normal' : 'nowrap' }}>
						{maxValueLength && tag.value.length > maxValueLength
							? `${tag.value.substring(0, maxValueLength)}...`
							: tag.value}
					</TagValue>
				)}
				{!showTagKey && !tag.value && (
					<TagValue>
						<i>{placeholder}</i>
					</TagValue>
				)}
				<CopyButton onClick={() => copyToClipboard(tagCopyValue)}>
					<FaCopy />
				</CopyButton>
			</TagText>
		</Label>
	);
};
