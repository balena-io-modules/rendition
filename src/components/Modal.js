import * as assign from 'lodash/assign'
import * as React from 'react'
import styled from 'styled-components'
import Button from './Button'
import Fixed from './Fixed'
import Text from './Text'
import { Box, Flex } from './Grid'

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
const DEFAULT_MODAL_WIDTH = 700

const ModalHeader = styled(Text)`
  margin-bottom: 50px;
  font-size: 24px;
`

const ModalTitleDetails = styled(Text)`
  color: ${props => props.theme.colors.text.light};
  font-size: 16px;
`

const ModalPanel = styled(Box)`
  position: relative;
  max-width: calc(100% - 30px);
  min-height: 50px;
  padding: 30px 50px;
  margin: 0 15px;
  border: solid 0.5px #9b9b9b;
  border-radius: 2px;
  background-color: #ffffff;
  z-index: 9999;
  box-shadow: 0px 0px 60px 1px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
`

const Modal = ({ w, width, ...props }) => {
  const cancelButtonProps = assign(
    { style: { marginRight: 20 } },
    props.cancelButtonProps
  )

  const primaryButtonProps = assign({ primary: true }, props.primaryButtonProps)

  return (
    <ModalWrapper align='center' justify='center'>
      <ModalBackdrop
        z={8888}
        bg='rgba(0,0,0,0.4)'
        top
        right
        bottom
        left
        onClick={() => (props.cancel || props.done)()}
      />
      <ModalPanel w={w || width || DEFAULT_MODAL_WIDTH}>
        {props.titleElement ? (
          <ModalHeader>{props.titleElement}</ModalHeader>
        ) : (
          !!props.title && (
            <ModalHeader>
              <strong>{props.title}</strong>
              {!!props.titleDetails && (
                <ModalTitleDetails>{props.titleDetails}</ModalTitleDetails>
              )}
            </ModalHeader>
          )
        )}
        {props.children}
        <Flex mt={50} align='center' justify='flex-end'>
          {props.cancel && (
            <Button {...cancelButtonProps} onClick={props.cancel}>
              Cancel
            </Button>
          )}
          <Button {...primaryButtonProps} onClick={props.done}>
            {props.action}
          </Button>
        </Flex>
      </ModalPanel>
    </ModalWrapper>
  )
}

export default Modal
