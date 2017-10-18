import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { compose, withProps } from 'recompose'

const setDefaultProps = withProps(props => {
  // set defaults
  // always allow override with provided props
  return Object.assign(
    {
      p: [3, 4],
      minHeight: `80vh`
    },
    props
  )
})

const setBgImage = bgImage => (bgImage ? `url(${bgImage})` : 'none')

const Base = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.minHeight};
  background-size: cover;
  background-position: center;
  background-image: ${props => setBgImage(props.backgroundImage)};
`

export default compose(withTheme, setDefaultProps, hoc)(Base)
