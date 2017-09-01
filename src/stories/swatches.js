import { h } from 'preact'
import { storiesOf } from '@kadira/storybook'
import { Flex, Box } from 'rebass'
import { colors } from '../theme'

const Swatch = ({ style, border }) => {
  const { main, light, dark } = colors[style]

  console.log('dark ' + style, dark)
  console.log('light ' + style, light)

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
