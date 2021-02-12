import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { Txt } from '../Txt';

// Prevent the filters taking up too much horizontal space
const MAX_ITEMS_TO_DISPLAY = 3;

const Container = styled(Flex)`
	background-color: ${(props) => props.theme.colors.info.light};
	border: 1px solid ${(props) => props.theme.colors.info.main};
	border-radius: 2px;
	line-height: 1.5;
`;

const DeleteButton = styled(Button)`
	color: ${(props) => props.theme.colors.tertiary.semilight};
`;

const tagItemsToString = (items: TagItem[]) => {
	return items
		.map((item, index) => {
			const prefix = index > 0 ? `${item.prefix || ','} ` : '';
			const separator = item.operator ? ` ${item.operator} ` : ': ';
			return (
				prefix +
				(item.value ? `${item.name}${separator}${item.value}` : item.name)
			);
		})
		.join('\n');
};

const BaseTag = ({
	name,
	operator,
	value,
	multiple,
	onClose,
	onClick,
	className,
}: InternalTagProps) => {
	let tagArray = multiple || [{ name, operator, value }];

	if (!tagArray.length) {
		return null;
	}
	const overflow = tagArray.length > MAX_ITEMS_TO_DISPLAY;

	if (overflow) {
		tagArray = [tagArray[0], { name: `... and ${tagArray.length - 1} more` }];
	}

	const tagContent = (
		<Container
			py={1}
			px={2}
			tooltip={
				overflow
					? { text: tagItemsToString(multiple ?? []), placement: 'bottom' }
					: undefined
			}
		>
			{tagArray.map((tagEntry, index) => {
				const nameValueSeparator = tagEntry.operator
					? ` ${tagEntry.operator} `
					: ': ';

				return (
					<React.Fragment key={index}>
						{index > 0 && !overflow && (
							<Txt whitespace="pre" color="info.main" fontSize={1} italic>{`  ${
								tagEntry.prefix || ','
							}  `}</Txt>
						)}

						{!tagEntry.value && !tagEntry.name && (
							<Txt italic color="info.main" fontSize={1}>
								no value
							</Txt>
						)}

						{tagEntry.name && (
							<Txt whitespace="pre" color="info.main" fontSize={1}>
								{`${tagEntry.name}${tagEntry.value ? nameValueSeparator : ''}`}
							</Txt>
						)}

						{tagEntry.value && (
							<Txt bold color="info.main" fontSize={1}>
								{tagEntry.value}
							</Txt>
						)}
					</React.Fragment>
				);
			})}
		</Container>
	);

	return (
		<Flex className={className}>
			{onClick ? (
				<Button plain onClick={onClick}>
					{tagContent}
				</Button>
			) : (
				tagContent
			)}
			{onClose && (
				<DeleteButton plain p={1} pl={2} pr={3} fontSize={1} onClick={onClose}>
					<FontAwesomeIcon icon={faTimes} />
				</DeleteButton>
			)}
		</Flex>
	);
};

export interface TagItem {
	value?: string;
	name?: string;
	operator?: string;
	prefix?: string;
}

export interface InternalTagProps {
	/** The value part of the tag */
	value?: string;
	/** The name part of the tag, if not provided, only the value will be shown */
	name?: string;
	/** The operator that goes between the name and value of the tag */
	operator?: string;
	/** An array of name-value pairs, with an optional delimiter to be used between the previous and current tag entry */
	multiple?: TagItem[];
	/** Callback method, that if passed, a "close" button will be added to the right-hand side of the tag */
	onClose?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	/** Callback method, that if passed, the tag will become clickable */
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	className?: string;
}

export type TagProps = InternalTagProps & RenditionSystemProps;

/**
 * Represents a name-value pair with an optional operator between.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Tag/Tag.stories.tsx)
 */
export const Tag = asRendition<React.FunctionComponent<TagProps>>(
	BaseTag as any,
);
