import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import Button from '../Button';
import { Flex } from '../Flex';
import Txt from '../Txt';

const Container = styled(Flex)`
	background-color: ${props => props.theme.colors.info.light};
	border: 1px solid ${props => props.theme.colors.info.main};
	border-radius: 2px;
	line-height: 1.5;
`;

const TagText = styled(Txt)`
	font-family: ${props => props.theme.titleFont};
`;

const DeleteButton = styled(Button)`
	color: ${props => props.theme.colors.tertiary.semilight};
`;

const TagBase = ({
	name,
	operator,
	value,
	multiple,
	onClose,
	onClick,
	className,
}: InternalTagProps) => {
	const tagArray = multiple || [{ name, operator, value }];

	const tagContent = (
		<Container py={1} px={2}>
			{tagArray.map((tagEntry, index) => {
				const nameValueSeparator = tagEntry.operator
					? ` ${tagEntry.operator} `
					: ': ';

				return (
					<React.Fragment key={index}>
						{index > 0 && (
							<Txt
								whitespace="pre"
								color="info.main"
								fontSize={0}
								italic
							>{`  ${tagEntry.prefix || ','}  `}</Txt>
						)}

						{!tagEntry.value && !tagEntry.name && (
							<TagText italic color="info.main" fontSize={0}>
								no value
							</TagText>
						)}

						{tagEntry.name && (
							<TagText whitespace="pre" color="info.main" fontSize={0}>
								{`${tagEntry.name}${tagEntry.value ? nameValueSeparator : ''}`}
							</TagText>
						)}

						{tagEntry.value && (
							<TagText bold color="info.main" fontSize={0}>
								{tagEntry.value}
							</TagText>
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
				<DeleteButton plain p={1} pl={2} pr={3} fontSize={0} onClick={onClose}>
					<FontAwesomeIcon icon={faTimes} />
				</DeleteButton>
			)}
		</Flex>
	);
};

export interface InternalTagProps {
	value?: string;
	name?: string;
	operator?: string;
	multiple?: Array<{
		value?: string;
		name?: string;
		operator?: string;
		prefix?: string;
	}>;
	onClose?: () => void;
	onClick?: () => void;
	className?: string;
}

export type TagProps = InternalTagProps & RenditionSystemProps;

export const Tag = asRendition<React.FunctionComponent<TagProps>>(
	TagBase as any,
);
