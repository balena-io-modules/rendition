import * as assign from 'lodash/assign'
import * as React from 'react'
import styled from 'styled-components'
import Button from './Button'
import Fixed from './Fixed'
import Text from './Text'
import { Box, Flex } from './Grid'
import { stopEvent } from '../utils'

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

const ModalSizer = styled(Box)`
  position: relative;
  width: 100%;
  max-height: 100%;
  padding: 0 15px;
  overflow-y: auto;
  background-color: transparent;
  z-index: 9999;
  pointer-events: auto;
`

const ModalPanel = styled(Box)`
  max-width: 100%;
  min-height: 50px;
  padding: 30px 50px;
  margin: 15px auto;
  border: solid 0.5px #9b9b9b;
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.4);
`

const Modal = ({ w, width, ...props }) => {
  const cancelButtonProps = assign(
    { style: { marginRight: 20 } },
    props.cancelButtonProps
  )

  const primaryButtonProps = assign({ primary: true }, props.primaryButtonProps)

  return (
    <ModalWrapper
      align='center'
      justify='center'
      onClick={() => (props.cancel || props.done)()}
      >
      <ModalBackdrop z={8888} bg='rgba(0,0,0,0.4)' top right bottom left />
      <ModalSizer>
        <ModalPanel w={w || width || DEFAULT_MODAL_WIDTH} onClick={stopEvent}>
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
      </ModalSizer>
    </ModalWrapper>
  )
}

export default Modal
