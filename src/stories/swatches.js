import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Heading, Provider, Txt } from '../'
import { withTheme } from 'styled-components'
import Readme from './README/Swatches.md'
import { isLight } from '../utils'

const getColor = color => (isLight(color) ? '#3c3e42' : '#fff')

const S = ({ style, border, theme }) => {
  const { main, light, dark, semilight } = theme.colors[style]

  return (
    <Box
      style={{
        borderRadius: 4,
        overflow: 'hidden',
        border: border ? `1px solid ${main}` : 'none'
      }}
      fontSize={11}
      >
      <Flex
        style={{ height: 75, backgroundColor: main }}
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        <Txt color={getColor(main)} align='center'>
          <div>main</div>
          <div>{main.toUpperCase()}</div>
        </Txt>
      </Flex>
      {semilight && (
        <Flex
          style={{ height: 45, backgroundColor: semilight }}
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Txt color={getColor(semilight)} align='center'>
            <div>semilight</div>
            <div>{semilight.toUpperCase()}</div>
          </Txt>
        </Flex>
      )}
      <Flex style={{ height: 45 }}>
        <Flex
          flex={1}
          style={{ backgroundColor: light }}
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Txt color={getColor(light)} align='center'>
            <div>light</div>
            <div>{light.toUpperCase()}</div>
          </Txt>
        </Flex>
        <Flex
          flex={1}
          style={{ backgroundColor: dark }}
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Txt color={getColor(dark)} align='center'>
            <div>dark</div>
            <div>{dark.toUpperCase()}</div>
          </Txt>
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

storiesOf('Next/Swatches', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('All', () => {
    return (
      <Provider>
        <Box as='section' m={15}>
          <Box as='h2' mx={15}>
            Primary
          </Box>
          <Flex flexWrap='wrap'>
            <Swatch style='primary' />
            <Swatch style='secondary' />
            <Swatch style='tertiary' />
            <Swatch style='quartenary' />
          </Flex>
        </Box>
        <Box as='section' m={15}>
          <Box as='h2' mx={15}>
            Secondary
          </Box>
          <Flex flexWrap='wrap'>
            <Swatch border style='success' />
            <Swatch border style='danger' />
            <Swatch border style='warning' />
            <Swatch border style='info' />
          </Flex>
        </Box>
        <Box as='section' m={15}>
          <Box as='h2' mx={15}>
            Utility
          </Box>
          <Flex flexWrap='wrap'>
            <Swatch border style='text' />
            <Swatch border style='gray' />
          </Flex>
        </Box>
      </Provider>
    )
  })
