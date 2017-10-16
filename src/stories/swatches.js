import React from 'react'
import { storiesOf } from '@storybook/react'
import { Flex, Box } from '../'
import { withTheme } from 'styled-components'

const S = ({ style, border, theme }) => {
  const { main, light, dark } = theme.colors[style]

  return (
    <Box
      style={{
        borderRadius: 4,
        overflow: 'hidden',
        border: border ? `1px solid ${main}` : 'none'
      }}
      width={160}
      m={15}
      >
      <Box style={{ height: 75, backgroundColor: main }} />
      <Flex style={{ height: 45 }}>
        <Box width={1 / 2} style={{ backgroundColor: light }} />
        <Box width={1 / 2} style={{ backgroundColor: dark }} />
      </Flex>
    </Box>
  )
}

const Swatch = withTheme(S)

storiesOf('Swatches', module)
  .addWithInfo('Primary', () => {
    return (
      <Flex m={15}>
        <Swatch style='primary' />
        <Swatch style='secondary' />
        <Swatch style='tertiary' />
        <Swatch style='quartenary' />
      </Flex>
    )
  })
  .addWithInfo('Secondary', () => {
    return (
      <Flex m={15}>
        <Swatch border style='success' />
        <Swatch border style='danger' />
        <Swatch border style='warning' />
        <Swatch border style='info' />
      </Flex>
    )
  })
