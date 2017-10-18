import React from 'react'
import styled, { withTheme } from 'styled-components'
import copyToClipboard from 'copy-to-clipboard'
import { compose } from 'recompose'
import FaClipboard from 'react-icons/lib/fa/clipboard'
import Tooltip from './Tooltip'
import hoc from '../hoc'

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

const Base = ({ copy, text, ...props }) => {
  const getCopyText = () => (copy || text || '').trim()
  return (
    <Wrapper className='code-with-copy'>
      <code title={copy}>{text.trim()}</code>

      <Tooltip message='Copied!' eventType='click'>
        <span
          onClick={() => copyToClipboard(getCopyText())}
          className='code-with-copy__copy'
        >
          <FaClipboard />
        </span>
      </Tooltip>
    </Wrapper>
  )
}

export default compose(withTheme, hoc)(Base)
