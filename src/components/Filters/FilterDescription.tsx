import isPlainObject = require('lodash/isPlainObject');
import keys = require('lodash/keys');
import noop = require('lodash/noop');
import values = require('lodash/values');
import * as React from 'react';
import { FilterModel, FilterRule, SchemaEntry } from 'rendition';
import styled from 'styled-components';
import DeleteBtn from '../DeleteButton';
import { Box, Flex } from '../Grid';
import PineTypes from '../PineTypes';
import Txt from '../Txt';

const ButtonWrapper = styled.button`
	font-size: 13px;
	min-height: 22px;
	border: 0;
	border-radius: 3px;
	background-color: #e9e9e9;
	padding: 3px 8px;
`;

const getOperatorText = (
	operator: string,
	type: string,
	schemaEntry: SchemaEntry,
) => {
	const operatorItem = PineTypes[type].rules[operator];
	if (isPlainObject(operatorItem) && schemaEntry) {
		const label = operatorItem.getLabel(schemaEntry);

		return label || operator;
	}

	return operator;
};

const kvpFormat = (object: any, schema: SchemaEntry) => {
	if (keys(object).length > 1) {
		return `${object[schema.key!]} : ${object[schema.value!]}`;
	}
	return values(object).pop();
};

const FilterDescriptionInner = (props: {
	rule: FilterModel;
	schema: SchemaEntry;
}) => (
	<Flex>
		<Box mr={7}>{props.rule.label || props.rule.name} </Box>
		{props.rule.operator && (
			<Box mr={7}>
				<strong>
					{getOperatorText(props.rule.operator, props.rule.type, props.schema)}
				</strong>
			</Box>
		)}
		{props.rule.type === 'Key Value Pair' ? (
			<em>{kvpFormat(props.rule.value, props.schema)}</em>
		) : (
			<em>{props.rule.value}</em>
		)}
	</Flex>
);

interface FilterDescriptionProps {
	dark?: boolean;
	schema: SchemaEntry;
	rule: FilterRule;
	edit?: false | (() => void);
	delete?: () => void;
}

const FilterDescription = (props: FilterDescriptionProps) => {
	return (
		<div>
			<ButtonWrapper onClick={!!props.edit ? props.edit : noop}>
				<Flex>
					<FilterDescriptionInner rule={props.rule} schema={props.schema} />
					{!!props.rule.extra &&
						!!props.rule.extra.or &&
						props.rule.extra.or.map((rule, index) => (
							<Flex key={index}>
								<Txt mx={2} bold>
									OR
								</Txt>
								<FilterDescriptionInner rule={rule} schema={props.schema} />
							</Flex>
						))}
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
