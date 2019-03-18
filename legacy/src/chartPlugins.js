export const doughnutDefaults = {
  primaryLabel: {
    text: '',
    font: 'Arial',
    color: '#5e5e5e',
    size: 38,
    offsetFromCenter: 10
  },
  secondaryLabel: {
    text: '',
    font: 'Arial',
    color: '#b8b8b8',
    size: 9,
    offsetFromCenter: -12
  }
}

export const doughnutLabel = {
  id: 'doughnut-label',
  drawlabel: function (chart, config) {
    const { width, height, ctx } = chart

    ctx.fillStyle = config.color
    ctx.font = `${config.size}px ${config.font}`

    const text = config.text
    const textX = Math.round((width - ctx.measureText(text).width) / 2)
    const textY = height / 2 + config.offsetFromCenter

    ctx.fillText(text, textX, textY)
  },
  beforeDraw: function (chart, easing) {
    const config = chart.options.plugins.doughnutLabel

    if (!config) {
      return false
    }

    const { primaryLabel, secondaryLabel } = config

    chart.ctx.textBaseline = 'middle'

    this.drawlabel(chart, primaryLabel)
    this.drawlabel(chart, secondaryLabel)
  }
}
