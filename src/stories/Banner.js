import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Banner } from '../'
import * as bgImage from './assets/bg.png'
import * as Readme from './README/Banner.md'

storiesOf('Core/Banner', module)
  .addDecorator(withReadme(Readme))
  .add('BackgoundImage', () => {
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
