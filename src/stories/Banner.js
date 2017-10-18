import React from 'react'
import { storiesOf } from '@storybook/react'
import { Banner } from '../'
import bgImage from './assets/bg.png'

storiesOf('Banner', module).addWithInfo('BackgoundImage', () => {
  return (
    <Banner color='white' backgroundImage={bgImage}>
      <h1>Resin.io</h1>
      <p>
        Resin.io brings the benefits of Linux containers to the IoT. Develop
        iteratively, deploy safely, and manage at scale.
      </p>
    </Banner>
  )
})
