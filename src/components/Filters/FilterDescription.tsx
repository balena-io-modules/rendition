import noop = require('lodash/noop');
import * as React from 'react';
import styled from 'styled-components';
import DeleteBtn from '../DeleteButton';
import { Box, Flex } from '../Grid';
import { JSONSchema6 } from 'json-schema';

const ButtonWrapper = styled.button`
	font-size: 13px;
	min-height: 22px;
	border: 0;
	border-radius: 3px;
	background-color: #e9e9e9;
	padding: 3px 8px;
`;

const FilterDescriptionInner = (props: { filter: JSONSchema6 }) => (
	<Box>
		{!!props.filter.anyOf &&
			props.filter.anyOf.map((f, i) => (
				<React.Fragment key={i}>
					{i > 0 && <em> or </em>}
					<span>{f.description}</span>
				</React.Fragment>
			))}
		{!props.filter.anyOf && <span>{props.filter.description}</span>}
	</Box>
);

interface FilterDescriptionProps {
	dark?: boolean;
	filter: JSONSchema6;
	edit?: false | (() => void);
	delete?: () => void;
}

const FilterDescription = (props: FilterDescriptionProps) => {
	return (
		<div>
			<ButtonWrapper onClick={!!props.edit ? props.edit : noop}>
				<Flex>
					<FilterDescriptionInner filter={props.filter} />
				</Flex>
			</ButtonWrapper>

			{!!props.delete && (
				<DeleteBtn
					color={props.dark ? '#fff' : undefined}
					onClick={props.delete}
				/>
			)}
		</div>
	);
};

export default FilterDescription;
