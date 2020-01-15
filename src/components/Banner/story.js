import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Banner, Heading, Txt } from '../../'
import bgImage from '../../stories/assets/bg.png'
import Readme from './README.md'

storiesOf('Core/Banner', module)
  .addDecorator(withReadme(Readme))
  .add('BackgoundImage', () => {
    return (
      <Banner color='white' backgroundImage={bgImage}>
        <Heading.h1>balena</Heading.h1>
        <Txt>
          Balena brings the benefits of Linux containers to the IoT. Develop
          iteratively, deploy safely, and manage at scale.
        </Txt>
      </Banner>
    )
  })
