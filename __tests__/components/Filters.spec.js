/* globals expect, describe, it */
import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Filters from '../../src/components/Filters'
import FiltersSummary from '../../src/components/Filters/Summary'
import * as SchemaSieve from '../../src/components/Filters/SchemaSieve'
import { ViewListItem } from '../../src/components/Filters/ViewsMenu'

const schema = {
  type: 'object',
  properties: {
    Name: {
      title: 'Pokemon Name',
      type: 'string'
    }
  }
}

const filter = SchemaSieve.createFilter(schema, [{
  field: 'Name',
  operator: 'is',
  value: 'Squirtle'
}])

const view = {
  id: 'abcde',
  name: 'Test',
  scope: null,
  filters: [ filter ]
}

describe('Filters component', () => {
  it('should match the stored snapshot', () => {
    const tree = renderer.create(
      <Provider>
        <Filters schema={schema} />
      </Provider>
    )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('filters property', () => {
    it('should not render a summary if there are no filters', () => {
      const component = mount(
        <Provider>
          <Filters
            schema={schema}
          />
        </Provider>
      )

      expect(component.find(FiltersSummary)).toHaveLength(0)

      component.unmount()
    })

    it('should render a summary of filters that are provided as props', () => {
      const component = mount(
        <Provider>
          <Filters
            schema={schema}
            filters={[filter]}
          />
        </Provider>
      )

      expect(component.find(FiltersSummary)).toHaveLength(1)

      component.unmount()
    })

    it('should render a summary of filters that are added as props after the component mounts', () => {
      const component = mount(
        <Filters
          schema={schema}
        />
      )

      component.setProps({ filters: [ filter ] })

      component.update()

      expect(component.find(FiltersSummary)).toHaveLength(1)

      component.unmount()
    })

    it('should not render a summary of filters if they are removed after the component mounts', () => {
      const component = mount(
        <Filters
          schema={schema}
          filters={[filter]}
        />
      )

      component.setProps({ filters: null })

      component.update()

      expect(component.find(FiltersSummary)).toHaveLength(0)
      component.unmount()
    })
  })

  describe('views property', () => {
    it('should not render a views menu if there are no views', () => {
      const component = mount(
        <Provider>
          <Filters
            schema={schema}
          />
        </Provider>
      )

      component.find('button').at(1).simulate('click')
      expect(component.find(ViewListItem)).toHaveLength(0)
      component.unmount()
    })

    it('should render a list of views that are provided as props', () => {
      const component = mount(
        <Provider>
          <Filters
            schema={schema}
            views={[view]}
          />
        </Provider>
      )

      component.find('button').at(1).simulate('click')
      expect(component.find(ViewListItem)).toHaveLength(1)
      component.unmount()
    })

    it('should render a list of views that are added as props after the component mounts', () => {
      const component = mount(
        <Filters
          schema={schema}
        />
      )

      component.setProps({ views: [ view ] })
      component.update()
      component.find('button').at(1).simulate('click')
      expect(component.find(ViewListItem)).toHaveLength(1)
      component.unmount()
    })

    it('should not render a list of views if they are removed after the component mounts', () => {
      const component = mount(
        <Filters
          schema={schema}
          views={[view]}
        />
      )

      component.setProps({ views: null })
      component.update()
      component.find('button').at(1).simulate('click')
      expect(component.find(ViewListItem)).toHaveLength(0)
      component.unmount()
    })

    it('should render when the schema contains an unknown type', () => {
      const unknownSchema = {
        type: 'object',
        properties: {
          test: {
            type: 'Foo Bar'
          }
        }
      }
      const component = mount(
        <Filters
          schema={unknownSchema}
        />
      )

      component.unmount()
    })
  })
})
