import * as React from 'react'
import * as Pie from 'paths-js/pie'
import styled, { withTheme } from 'styled-components'
import * as map from 'lodash/map'
import { compose } from 'recompose'
import { px } from '../utils'

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

    .gauge__graph__total-label {
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

const GaugeTotalText = styled.text`
  font-family: ${font};
  font-size: ${props => px(props.count > 999 ? 20 : 26)};
  fill: #5e5e5e;
  letter-spacing: -1px;
  text-anchor: middle;
  transform: translateX(0);
`

const GaugeTotal = ({ count, ...props }) => (
  <GaugeTotalText count={count} {...props}>
    {count}
  </GaugeTotalText>
)

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
        className='gauge__graph'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          fill=' white'
          stroke='#dadada'
          strokeWidth='5'
          cx='50'
          cy='50'
          r='46'
        />

        <g>
          <circle fill={placeholderColor} cx='50' cy='50' r='46' />
          <circle fill='white' cx='50' cy='50' r='25' />
        </g>

        <g transform='translate(50, 50)'>
          {map(gauge, segment => {
            if (!count) {
              return
            }
            if (segment.item.value === count) {
              return (
                <g key={segment.item.key || segment.item.name}>
                  <path
                    transform='translate(-100, -100)'
                    fill={segment.item.color}
                    d='M100 100m-46,0a46,46,0 1,0 92,0a 46,46 0 1,0 -92,0zM100 100m-25,0a25,25,0 0,1 50,0a 25,25 0 0,1 -50,0z'
                  />
                </g>
              )
            }
            return (
              <g key={segment.item.key || segment.item.name}>
                <path
                  fill={segment.item.color}
                  d={segment.sector.path.print()}
                />
              </g>
            )
          })}
        </g>
        <text className='gauge__graph__total-label' x='50' y='41'>
          {title ? ` ${title.toUpperCase()}` : 'TOTAL'}
        </text>
        <GaugeTotal x='50' y='63' count={count} />
      </svg>

      <ul className='gauge__legend'>
        {map(data, item => {
          return (
            <li key={item.key || item.name} className={`gauge__legend-item`}>
              <span
                className={`gauge__legend-color`}
                style={{ backgroundColor: item.color }}
              >
                &nbsp;
              </span>
              <span className='gauge__legend-name'>{item.name}</span>
            </li>
          )
        })}
      </ul>
    </StatusGaugeWrapper>
  )
}

export default compose(withTheme, hoc)(StatusGauge)
