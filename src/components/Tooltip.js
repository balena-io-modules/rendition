import styled, { withTheme } from 'styled-components'
import { compose } from 'recompose'
import { px } from '../utils'
import ReactAriaTooltip from 'react-aria-tooltip'
import hoc from '../hoc'

const Tooltip = styled(ReactAriaTooltip)`
  .ra-tooltip {
    border-radius: ${props => px(props.theme.radius)};

    p {
      padding: 3px 8px;
      font-size: 12px;
    }
  }
`

export default compose(withTheme, hoc)(Tooltip)
