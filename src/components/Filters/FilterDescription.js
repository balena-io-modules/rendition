import * as React from 'react'
import styled from 'styled-components'
import DeleteBtn from '../DeleteButton'
import { Box, Flex } from '../Grid'

const ButtonWrapper = styled.button`
  font-size: 13px;
  min-height: 22px;
  border: 0;
  border-radius: 3px;
  background-color: #e9e9e9;
  padding: 3px 8px;
`

const FilterDescription = props => (
  <div>
    <ButtonWrapper onClick={!!props.edit && props.edit}>
      <Flex>
        {props.rule.label || props.rule.name}{' '}
        <Box mx={7}>
          <strong>{props.rule.operator}</strong>
        </Box>{' '}
        <em>{props.rule.value}</em>
      </Flex>
    </ButtonWrapper>

    {!!props.delete && <DeleteBtn onClick={props.delete} />}
  </div>
)

export default FilterDescription
