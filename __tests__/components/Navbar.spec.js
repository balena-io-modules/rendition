/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Link from '../../src/components/Link'
import Provider from '../../src/components/Provider'
import Navbar from '../../src/components/Navbar'

test('Navbar renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Navbar color='white'>
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
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
