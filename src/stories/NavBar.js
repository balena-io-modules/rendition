import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import { Navbar, Image, Link } from '../'
import logo from './assets/etcher.svg'

storiesOf('Navbar', module).addWithInfo('standard', () => {
  const Brand = (
    <Link color='white' href={'/'}>
      <Image style={{ height: '20px' }} src={logo} />
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
