import { LoadingBar } from '../';

describe('LoadingBar', () => {
  const wrapper = shallow(<LoadingBar></LoadingBar>);
  it('Should render with 3 child divs', () => {
    chaiExpect(wrapper.find('div').length).to.equal(3);
  });

  it('Should render with props.colors', () => {
    const wrapper = shallow(<LoadingBar colors={['red', 'blue', 'green']}></LoadingBar>);
    chaiExpect(wrapper.childAt(0)).to.have.style('background-color', 'red');
  });
});
