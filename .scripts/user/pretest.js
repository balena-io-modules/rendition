// Use this file to setup any test utilities.
// importing
import { shallow, render, mount } from 'enzyme';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';

chai.use(chaiEnzyme());

console.log(chai.expect)

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.chai = chai;
global.chaiExpect = chai.expect;
global.React = React;

// Skip createElement warnings but fail tests on any other warning
console.error = message => {
    if (!/(React.createElement: type should not be null)/.test(message)) {
        throw new Error(message);
    }
};
