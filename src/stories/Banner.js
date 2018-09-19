import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Banner, Heading, Provider, Txt } from '../'
import * as bgImage from './assets/bg.png'
import * as Readme from './README/Banner.md'

storiesOf('Core/Banner', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('BackgoundImage', () => {
    return (
      <Provider>
        <Banner color='white' backgroundImage={bgImage}>
          <Heading.h1>Resin.io</Heading.h1>
          <Txt>
            Resin.io brings the benefits of Linux containers to the IoT. Develop
            iteratively, deploy safely, and manage at scale.
          </Txt>
        </Banner>
      </Provider>
    )
  })
