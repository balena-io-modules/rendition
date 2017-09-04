import { h } from 'preact'
import styled from 'styled-components'
import Button from './Button'
import Fixed from './Fixed'
import Text from './Text'
import { Flex } from './Grid'

const MODAL_WIDTH = 700

const ModalPanel = styled.div`
  border-radius: 2px;
  background-color: #ffffff;
  border: solid 0.5px #9b9b9b;
  position: fixed;
  width: ${MODAL_WIDTH}px;
  top: 225px;
  min-height: 50px;
  left: 50%;
  margin-left: -${MODAL_WIDTH / 2}px;
  padding: 30px 50px;
  z-index: 10;
  box-shadow: 0px 0px 60px 1px rgba(0, 0, 0, 0.4);

  @media (max-width: 730px) {
    left: 15px;
    right: 15px;
    margin: 0;
    width: auto;
  }
`

const Modal = props => (
  <div>
    <Fixed
      z={9}
      bg='rgba(0,0,0,0.4)'
      top
      right
      bottom
      left
      onClick={() => props.cancel()}
    />
    <ModalPanel>
      {!!props.title && (
        <Text mb={50}>
          <strong>{props.title}</strong>
        </Text>
      )}
      {props.children}
      <Flex mt={60} align='center' justify='center'>
        <Button style={{ marginRight: 20 }} onClick={props.cancel}>
          Cancel
        </Button>
        <Button primary onClick={props.done}>
          {props.action}
        </Button>
      </Flex>
    </ModalPanel>
  </div>
)

export default Modal
