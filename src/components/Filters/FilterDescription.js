import { h } from 'preact'
import styled from 'styled-components'
import DeleteBtn from '../DeleteButton'

const ButtonWrapper = styled.button`
  font-size: 13px;
  height: 22px;
  border: 0;
  border-radius: 3px;
  background-color: #e9e9e9;
  padding: 3px 8px;
`

const FilterDescription = props => (
  <div>
    <ButtonWrapper onClick={!!props.edit && props.edit}>
      {props.rule.name}{' '}
      <strong style={{ marginLeft: 7, marginRight: 7 }}>
        {props.rule.operator}
      </strong>{' '}
      <em>{props.rule.value}</em>
    </ButtonWrapper>

    {!!props.delete && <DeleteBtn onClick={props.delete} />}
  </div>
)

export default FilterDescription
