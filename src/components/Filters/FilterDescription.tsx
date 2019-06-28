import { JSONSchema6 } from 'json-schema';
import noop from 'lodash/noop';
import * as React from 'react';
import FaClose from 'react-icons/lib/fa/close';
import styled from 'styled-components';
import { Button } from '../../';
import { Box, Flex } from '../Grid';

const ButtonWrapper = styled.button`
	cursor: pointer;
	font-size: 12px;
	min-height: 22px;
	border: 1px solid ${props => props.theme.colors.quartenary.main};
	color: ${props => props.theme.colors.tertiary.main};
	border-radius: 16px;
	background-color: white;
	padding: 4px 8px;
`;

const WrappingEm = styled.em`
	white-space: pre-wrap;
`;

const DeleteButton = styled(Button)`
	color: ${props => props.theme.colors.tertiary.semilight};
`;

const FilterDescriptionInner = (props: { filter: JSONSchema6 }) => (
	<Box>
		{!!props.filter.anyOf &&
			props.filter.anyOf.map((f, i) => (
				<React.Fragment key={i}>
					{i > 0 && <WrappingEm> or </WrappingEm>}
					<span>{f ? (f as JSONSchema6).description : ''}</span>
				</React.Fragment>
			))}
		{!props.filter.anyOf && <span>{props.filter.description}</span>}
	</Box>
);

const FilterDescription = (props: FilterDescriptionProps) => {
	return (
		<Flex alignItems="center" justifyContent="center">
			<ButtonWrapper onClick={!!props.edit ? props.edit : noop}>
				<Flex>
					<FilterDescriptionInner filter={props.filter} />
				</Flex>
			</ButtonWrapper>

			{!!props.delete && (
				<DeleteButton
					plain
					p={1}
					fontSize={1}
					ml={1}
					color={props.dark ? '#fff' : undefined}
					onClick={props.delete}
				>
					<FaClose />
				</DeleteButton>
			)}
		</Flex>
	);
};

export interface FilterDescriptionProps {
	dark?: boolean;
	filter: JSONSchema6;
	edit?: false | (() => void);
	delete?: () => void;
}

export default FilterDescription;
