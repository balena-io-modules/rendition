import * as React from 'react'
import styled from 'styled-components'
import Button from './Button'
import Fixed from './Fixed'
import Text from './Text'
import { px } from '../utils'
import { Flex } from './Grid'

const ModalWrapper = Flex.extend`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
`

const ModalBackdrop = styled(Fixed)`
  pointer-events: auto;
`
const MODAL_WIDTH = 700

const ModalPanel = styled.div`
  position: relative;
  width: ${px(MODAL_WIDTH)};
  min-height: 50px;
  padding: 30px 50px;
  margin: 0;
  border: solid 0.5px #9b9b9b;
  border-radius: 2px;
  background-color: #ffffff;
  z-index: 9999;
  box-shadow: 0px 0px 60px 1px rgba(0, 0, 0, 0.4);
  pointer-events: auto;

  @media (max-width: 730px) {
    width: auto;
    margin: 0 15px;
  }
`

const Modal = props => (
  <ModalWrapper align='center' justify='center'>
    <ModalBackdrop
      z={8888}
      bg='rgba(0,0,0,0.4)'
      top
      right
      bottom
      left
      onClick={() => props.cancel()}
    />
    <ModalPanel>
      {props.titleElement ? (
        <Text mb={50}>{props.titleElement}</Text>
      ) : (
        !!props.title && (
          <Text mb={50}>
            <strong>{props.title}</strong>
          </Text>
        )
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
  </ModalWrapper>
)

export default Modal
