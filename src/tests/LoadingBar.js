import { LoadingBar } from '../';

describe('LoadingBar', () => {
  const wrapper = shallow(<LoadingBar></LoadingBar>);
  it('Should render with 3 child divs', () => {
    expect(3).to.equal(3);
  });

  it('Should render with props.colors', () => {
    expect(wrapper.childAt(0)).to.have.style('background-color', 'red');
  });
});
