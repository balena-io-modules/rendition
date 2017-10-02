import styled from 'styled-components'
import { space, width } from 'styled-system'

const Image = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
  ${space} ${width};
`

Image.displayName = 'Image'

export default Image
