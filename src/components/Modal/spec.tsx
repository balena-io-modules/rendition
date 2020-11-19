import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { Modal, Provider } from '../../';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

describe('Keyboard closing modals', () => {
	it('should call the callback of the top-most nested modal on Escape key press', () => {
		const firstModalSpy = sinon.spy();
		const secondModalSpy = sinon.spy();

		const component = mount(
			<Provider>
				<Modal done={firstModalSpy}>
					<Modal done={secondModalSpy}>Test</Modal>
				</Modal>
			</Provider>,
		);

		// Escape key
		component
			.find('div[onKeyDown]')
			.forEach((node) => node.simulate('keydown', { which: ESCAPE_KEY }));
		expect(firstModalSpy.notCalled).toBeTruthy();
		expect(secondModalSpy.calledOnce).toBeTruthy();
	});

	it('should call the callback of the only modal on Escape key press', () => {
		const modalSpy = sinon.spy();

		const component = mount(
			<Provider>
				<Modal done={modalSpy}>Test</Modal>
			</Provider>,
		);

		// Escape key
		component
			.find('div[onKeyDown]')
			.forEach((node) => node.simulate('keydown', { which: ESCAPE_KEY }));
		expect(modalSpy.calledOnce).toBeTruthy();
	});
});

describe('Keyboard submitting nested modals', () => {
	let originalAddEventListener: any;
	const eventListenersMap: any = {};
	beforeAll(() => {
		// You cannot simulate events on the document object in enzyme, so we need to stub the `addEventListener` function.
		originalAddEventListener = window.document.addEventListener;
		window.document.addEventListener = (event: any, cb: any) => {
			if (!eventListenersMap[event]) {
				eventListenersMap[event] = [];
			}

			eventListenersMap[event].push(cb);
		};
	});

	afterAll(() => {
		window.document.addEventListener = originalAddEventListener;
	});

	it('should call the callback of the top-most modal with done on Enter key press', () => {
		const firstModalSpy = sinon.spy();
		const secondModalSpy = sinon.spy();

		mount(
			<Provider>
				<Modal done={firstModalSpy}>
					<Modal done={secondModalSpy}>Test</Modal>
				</Modal>
			</Provider>,
		);

		// Enter key
		eventListenersMap.keydown.forEach((fn: any) =>
			fn({
				preventDefault: () => null,
				stopPropagation: () => null,
				which: ENTER_KEY,
			}),
		);
		expect(firstModalSpy.notCalled).toBeTruthy();
		expect(secondModalSpy.calledOnce).toBeTruthy();
	});

	it('should not call any callback of either modal on Enter key press when the primary button is disabled', () => {
		const firstModalSpy = sinon.spy();
		const secondModalSpy = sinon.spy();

		mount(
			<Provider>
				<Modal done={firstModalSpy}>
					<Modal primaryButtonProps={{ disabled: true }} done={secondModalSpy}>
						Test
					</Modal>
				</Modal>
			</Provider>,
		);

		// Enter key
		eventListenersMap.keydown.forEach((fn: any) =>
			fn({
				preventDefault: () => null,
				stopPropagation: () => null,
				which: ENTER_KEY,
			}),
		);
		expect(firstModalSpy.notCalled).toBeTruthy();
		expect(secondModalSpy.notCalled).toBeTruthy();
	});
});
