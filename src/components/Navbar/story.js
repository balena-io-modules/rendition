import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Img, Link, Navbar } from '../../'
import logo from '../../stories/assets/etcher.svg'
import Readme from './README.md'

storiesOf('Core/Navbar', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    const Brand = (
      <Link color='white' href={'/'}>
        <Img style={{ height: '20px' }} src={logo} />
      </Link>
    )
    return (
      <Navbar brand={Brand} color='white'>
        <Link color='white' href={'/docs/'}>
          Docs
        </Link>
        <Link color='white' href={'/changelog/'}>
          changelog
        </Link>
        <Link color='white' href={'/gitter/'}>
          gitter
        </Link>
      </Navbar>
    )
  })
