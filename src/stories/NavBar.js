import { h } from 'preact'
import { storiesOf } from '@storybook/react'
import { Navbar, Image, Link } from '../'
import logo from './assets/etcher.svg'

storiesOf('Navbar', module).addWithInfo('standard', () => {
  const Brand = (
    <Link color='white' to={'/'}>
      <Image style={{ height: '20px' }} src={logo} />
    </Link>
  )
  return (
    <Navbar brand={Brand} color='white'>
      <Link color='white' to={'/docs/'}>
        Docs
      </Link>
      <Link color='white' to={'/changelog/'}>
        changelog
      </Link>
      <Link color='white' to={'/gitter/'}>
        gitter
      </Link>
    </Navbar>
  )
})
