import { h } from 'preact'
import _ from 'lodash'
import Pie from 'paths-js/pie'
import styled, { withTheme } from 'styled-components'
import { compose } from 'recompose'

import hoc from '../hoc'
import theme from '../theme'

const { font } = theme

const StatusGaugeWrapper = styled.div`
  display: block;
  color: ${({ theme }) => theme.colors.text.main};

  /* fix edge hover missplacing bug
    on svg text inside anchors
  */
  &,
  &:hover {
    text-decoration: none;

    text {
      text-decoration: none !important;
    }

    .gauge__graph__total-label,
    .gauge__graph__total {
      transform: translateX(0);
    }
  }

  .gauge__graph {
    display: block;
    width: 100%;
    max-width: 180px;
    margin: 0 auto 10px;
  }

  .gauge__graph__total-label {
    font-family: ${font};
    font-size: 5px;
    fill: #b8b8b8;
    text-anchor: middle;
  }

  .gauge__graph__total {
    font-family: ${font};
    font-size: 26px;
    fill: #5e5e5e;
    letter-spacing: -1px;
    text-anchor: middle;
  }

  .gauge__legend {
    list-style: none;
    padding: 5px;
    margin: 0 auto;
    background: white;
    border-radius: 5px;
    max-width: 240px;
    border: 1px solid #ececec;
    overflow: hidden;
  }

  .gauge__legend-item {
    display: flex;
    padding: 3px 0 3px 2px;
    line-height: 9px;
    width: 50%;
    float: left;
  }

  .gauge__legend-color {
    display: inline-block;
    flex: 0 0 auto;
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }

  .gauge__legend-name {
    font-size: 11px;
  }
`

/**
 * data: [{
 *   key: string
 *   value: number
 *   color: string
 *   name: string
 * }]
*/
const StatusGauge = ({
  placeholderColor = theme.colors.gray.light,
  legend,
  data,
  title,
  ...props
}) => {
  const count = data.reduce((carry, item) => {
    return carry + item.value
  }, 0)

  const graph = Pie({
    accessor: item => item.value,
    center: [0, 0],
    data: data,
    R: 46,
    r: 25
  })

  const gauge = graph.curves
  return (
    <StatusGaugeWrapper {...props}>
      <svg
        class='gauge__graph'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          fill=' white'
          stroke='#dadada'
          stroke-width='5'
          cx='50'
          cy='50'
          r='46'
        />

        <g>
          <circle fill={placeholderColor} cx='50' cy='50' r='46' />
          <circle fill='white' cx='50' cy='50' r='25' />
        </g>

        <g transform='translate(50, 50)'>
          {_.map(gauge, segment => {
            if (count > 0 && segment.item.value === count) {
              return (
                <g>
                  <path
                    transform='translate(-100, -100)'
                    fill={segment.item.color}
                    d='M100 100m-46,0a46,46,0 1,0 92,0a 46,46 0 1,0 -92,0zM100 100m-25,0a25,25,0 0,1 50,0a 25,25 0 0,1 -50,0z'
                  />
                </g>
              )
            }
            return (
              <g>
                <path
                  fill={segment.item.color}
                  d={segment.sector.path.print()}
                />
              </g>
            )
          })}
        </g>
        <text class='gauge__graph__total-label' x='50' y='41'>
          {title ? ` ${title.toUpperCase()}` : 'TOTAL'}
        </text>
        <text class='gauge__graph__total' x='50' y='63'>
          {count}
        </text>
      </svg>

      <ul class='gauge__legend'>
        {_.map(data, item => {
          return (
            <li className={`gauge__legend-item`}>
              <span
                className={`gauge__legend-color`}
                style={{ backgroundColor: item.color }}
              >
                &nbsp;
              </span>
              <span class='gauge__legend-name'>{item.name}</span>
            </li>
          )
        })}
      </ul>
    </StatusGaugeWrapper>
  )
}

export default compose(withTheme, hoc)(StatusGauge)
