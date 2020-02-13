/* globals expect, test, describe */
import React from 'react'
import renderer from 'react-test-renderer'
import {
  Button,
  Provider,
  Alert,
  Badge,
  Box,
  DropDownButton,
  Fixed,
  Flex,
  Link,
  Txt,
  Heading
} from '../../../dist'

describe('Tooltip renders correctly', () => {
  ;[
    { Component: Button, name: 'button' },
    { Component: Alert, name: 'alert' },
    { Component: Badge, name: 'badge' },
    { Component: Box, name: 'box' },
    { Component: DropDownButton, name: 'dropdown button' },
    { Component: Fixed, name: 'fixed' },
    { Component: Flex, name: 'flex' },
    { Component: Link, name: 'link' },
    { Component: Txt, name: 'txt' },
    { Component: Heading.h2, name: 'heading' }
  ].forEach(({ Component, name }) => {
    test(`on ${name}`, () => {
      const component = renderer.create(
        <Provider>
          <Component tooltip='Tooltip Content' aria-describedby='tooltip-id'>
            Children
          </Component>
        </Provider>
      )
      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
