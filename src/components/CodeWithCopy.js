import * as React from 'react'
import styled, { withTheme } from 'styled-components'
import * as copyToClipboard from 'copy-to-clipboard'
import { compose } from 'recompose'
import * as FaClipboard from 'react-icons/lib/fa/clipboard'
import Button from './Button'
import hoc from '../hoc'
import { stopEvent } from '../utils'

const Wrapper = styled.span`
  white-space: initial;

  code {
    font-family: ${props => props.theme.monospace};
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 2px;
    white-space: normal;
    word-wrap: break-word;
    font-size: 1em;
    margin-right: 3px;
  }

  .code-with-copy__copy {
    .text-selection--none;
    cursor: pointer;
  }
`

const copyIt = (copy, text) => {
  const copyText = (copy || text || '').trim()

  copyToClipboard(copyText)
}

const Base = ({ copy, text, color, ...props }) => {
  return (
    <Wrapper {...props} className='code-with-copy'>
      <code title={copy}>{text.trim()}</code>

      <span onClick={stopEvent}>
        <Button
          plaintext
          tooltip={{ text: 'Copied!', trigger: 'click' }}
          onClick={() => copyIt(copy, text)}
          className='code-with-copy__copy'
        >
          <FaClipboard color={color} />
        </Button>
      </span>
    </Wrapper>
  )
}

export default compose(withTheme, hoc)(Base)
