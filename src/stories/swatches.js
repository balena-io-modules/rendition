import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { Flex, Box } from '../'
import { withTheme } from 'styled-components'

const S = ({ style, border, theme }) => {
  const { main, light, dark, semilight } = theme.colors[style]

  return (
    <Box
      style={{
        minWidth: 120,
        maxWidth: 160,
        borderRadius: 4,
        overflow: 'hidden',
        border: border ? `1px solid ${main}` : 'none'
      }}
      fontSize={10}
      flex={1}
      m={15}
      >
      <Flex
        style={{ height: 75, backgroundColor: main }}
        align='center'
        justify='center'
      >
        {main}
      </Flex>
      {semilight && (
        <Flex
          style={{ height: 45, backgroundColor: semilight }}
          align='center'
          justify='center'
        >
          {semilight}
        </Flex>
      )}
      <Flex style={{ height: 45 }}>
        <Flex
          flex={1}
          style={{ backgroundColor: light }}
          align='center'
          justify='center'
        >
          {light}
        </Flex>
        <Flex
          flex={1}
          style={{ backgroundColor: dark }}
          align='center'
          justify='center'
        >
          {dark}
        </Flex>
      </Flex>
    </Box>
  )
}

const Swatch = withTheme(S)

storiesOf('Swatches', module).addWithInfo('All', () => {
  return (
    <div>
      <Box is='section' m={15}>
        <Box is='h2' mx={15}>
          Primary
        </Box>
        <Flex wrap>
          <Swatch style='primary' />
          <Swatch style='secondary' />
          <Swatch style='tertiary' />
          <Swatch style='quartenary' />
        </Flex>
      </Box>
      <Box is='section' m={15}>
        <Box is='h2' mx={15}>
          Secondary
        </Box>
        <Flex wrap>
          <Swatch border style='success' />
          <Swatch border style='danger' />
          <Swatch border style='warning' />
          <Swatch border style='info' />
        </Flex>
      </Box>
    </div>
  )
})
