import * as React from 'react'
import styled from 'styled-components'
import * as isPlainObject from 'lodash/isPlainObject'
import * as keys from 'lodash/keys'
import * as values from 'lodash/values'
import DeleteBtn from '../DeleteButton'
import { Box, Flex } from '../Grid'
import PineTypes from '../PineTypes'

const ButtonWrapper = styled.button`
  font-size: 13px;
  min-height: 22px;
  border: 0;
  border-radius: 3px;
  background-color: #e9e9e9;
  padding: 3px 8px;
`

const getOperatorText = (operator, type, schemaEntry) => {
  const operatorItem = PineTypes[type].rules[operator]
  if (isPlainObject(operatorItem) && schemaEntry) {
    const label = operatorItem.getLabel(schemaEntry)

    return label || operator
  }

  return operator
}

const kvpFormat = (object, schema) => {
  if (keys(object).length > 1) {
    return `${object[schema.key]} : ${object[schema.value]}`
  }
  return values(object).pop()
}

const FilterDescription = props => (
  <div>
    <ButtonWrapper onClick={!!props.edit && props.edit}>
      <Flex>
        <Box mr={7}>{props.rule.label || props.rule.name} </Box>
        {props.rule.operator && (
          <Box mr={7}>
            <strong>
              {getOperatorText(
                props.rule.operator,
                props.rule.type,
                props.schema
              )}
            </strong>
          </Box>
        )}
        {props.rule.type === 'Key Value Pair' ? (
          <em>{kvpFormat(props.rule.value, props.schema)}</em>
        ) : (
          <em>{props.rule.value}</em>
        )}
      </Flex>
    </ButtonWrapper>

    {!!props.delete && (
      <DeleteBtn color={props.dark && '#fff'} onClick={props.delete} />
    )}
  </div>
)

export default FilterDescription
