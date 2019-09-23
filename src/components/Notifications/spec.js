/* globals expect, describe, it */
import { mount } from 'enzyme'
import React from 'react'
import sinon from 'sinon'
import {
  Button,
  Provider,
  NotificationsContainer,
  notifications
} from '../../../dist'

// Calling methods from `notifications` from inside Jest and outside the React realm doesn't work, so we call it from the component instead
const NotificationsComponent = ({ content, idToRemove }) => {
  return (
    <Provider>
      <NotificationsContainer />
      <Button onClick={() => notifications.addNotification(content)}>
        Add text notification
      </Button>
      <Button onClick={() => notifications.removeNotification(idToRemove)}>
        Remove text notification
      </Button>
    </Provider>
  )
}

describe('Notifications component', () => {
  it('can add a notification', () => {
    const component = mount(
      <NotificationsComponent content={'A notification'} />
    )

    component
      .find('button')
      .first()
      .simulate('click')

    expect(component.find('.notification-item').text()).toBe('A notification')
  })

  it('can remove a notification using the API', () => {
    const id = 'notification-id'

    const component = mount(
      <NotificationsComponent
        content={{ content: 'A notification', id }}
        idToRemove={id}
      />
    )

    component
      .find('button')
      .first()
      .simulate('click')

    component
      .find('button')
      .at(2)
      .simulate('click')

    // The notifications depend on the `transitionend` event for it to be removed from the dom, but we mock the css import for the animations, so it will never happen.
    component
      .find('.notification-item')
      .first()
      .simulate('transitionend')

    expect(component.find('.notification-item')).toHaveLength(0)
  })

  it('can remove a notification by clicking on the dismiss button', () => {
    const component = mount(
      <NotificationsComponent content={'A notification'} />
    )

    component
      .find('button')
      .first()
      .simulate('click')

    component
      .find('.notification-item')
      .find('button')
      .first()
      .simulate('click')

    component
      .find('.notification-item')
      .first()
      .simulate('transitionend')

    expect(component.find('.notification-item')).toHaveLength(0)
  })

  it('calls the onDismiss callback when the dismiss button is clicked', () => {
    const callback = sinon.spy()

    const component = mount(
      <NotificationsComponent
        content={{ content: 'A notification', onDismiss: callback }}
      />
    )

    component
      .find('button')
      .first()
      .simulate('click')

    component
      .find('.notification-item')
      .find('button')
      .first()
      .simulate('click')

    expect(callback.callCount).toEqual(1)
  })

  it('disappears after the duration passes', () => {
    const component = mount(
      <NotificationsComponent
        content={{ content: 'A notification', duration: 20 }}
      />
    )
    const clock = sinon.useFakeTimers()

    component
      .find('button')
      .first()
      .simulate('click')

    // On the first transitionend (on entry), it creates the timer, and on the second one (on exit), it removes the element from the DOM.
    component
      .find('.notification-item')
      .first()
      .simulate('transitionend')
    clock.tick(200)
    component
      .find('.notification-item')
      .first()
      .simulate('transitionend')

    expect(component.find('.notification-item')).toHaveLength(0)

    clock.restore()
  })
})
