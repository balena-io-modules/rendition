import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Heading, Provider } from '../'
import { withTheme } from 'styled-components'
import * as Readme from './README/Swatches.md'

const S = ({ style, border, theme }) => {
  const { main, light, dark, semilight } = theme.colors[style]

  return (
    <Box
      style={{
        borderRadius: 4,
        overflow: 'hidden',
        border: border ? `1px solid ${main}` : 'none'
      }}
      fontSize={10}
      >
      <Flex
        style={{ height: 75, backgroundColor: main }}
        align='center'
        justify='center'
        flexDirection='column'
      >
        <div>main</div>
        {main}
      </Flex>
      {semilight && (
        <Flex
          style={{ height: 45, backgroundColor: semilight }}
          align='center'
          justify='center'
          flexDirection='column'
        >
          <div>semilight</div>
          {semilight}
        </Flex>
      )}
      <Flex style={{ height: 45 }}>
        <Flex
          flex={1}
          style={{ backgroundColor: light }}
          align='center'
          justify='center'
          flexDirection='column'
        >
          <div>light</div>
          {light}
        </Flex>
        <Flex
          flex={1}
          style={{ backgroundColor: dark }}
          align='center'
          justify='center'
          flexDirection='column'
        >
          <div>dark</div>
          {dark}
        </Flex>
      </Flex>
    </Box>
  )
}

const Swatch = withTheme(props => (
  <Flex
    style={{
      minWidth: 120,
      maxWidth: 160
    }}
    m={15}
    flexDirection='column'
    flex={1}
    >
    <Heading.h5>{props.style}</Heading.h5>
    <S {...props} />
  </Flex>
))

storiesOf('Core/Swatches', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('All', () => {
    return (
      <Provider>
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
        <Box is='section' m={15}>
          <Box is='h2' mx={15}>
            Utility
          </Box>
          <Flex wrap>
            <Swatch border style='text' />
            <Swatch border style='gray' />
          </Flex>
        </Box>
      </Provider>
    )
  })
