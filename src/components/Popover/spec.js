/* globals expect, describe, it */
import React from 'react'
import renderer from 'react-test-renderer'
import { Box, Popover, Provider, Txt } from '../../../dist'

describe('Popover component', () => {
  it('should match the stored snapshot', () => {
    const TextWithPopover = () => {
      const [target, setTarget] = React.useState(null)

      return (
        <Box m={3}>
          {target && (
            <Popover target={target} placement='right'>
              <Txt align='center'>Popover content</Txt>
            </Popover>
          )}
          <span ref={setTarget}>Popover target</span>
        </Box>
      )
    }

    const component = renderer.create(
      <Provider>
        <TextWithPopover />
      </Provider>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
