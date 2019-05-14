/* globals expect, test, describe */
import React from 'react'
import renderer from 'react-test-renderer'
import Link from '../../src/components/Link'
import {
  Navbar,
  Provider
} from '../../dist'

describe('Navbar renders correctly', () => {
  test('with more than one children prop', () => {
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

  test('with a single children prop', () => {
    const component = renderer.create(
      <Provider>
        <Navbar color='white'>
          <Link color='white' href={'/docs/'}>
            Docs
          </Link>
        </Navbar>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with no children prop', () => {
    const component = renderer.create(
      <Provider>
        <Navbar color='white' />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
