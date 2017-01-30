import LoadingBar from './';
import TestContainer from '../../utils/TestContainer';

describe('LoadingBar', () => {
  const instance = mount(
    <TestContainer>
      <LoadingBar />
    </TestContainer>
  );
  it('Should mount with 4 child divs', () => {
    chaiExpect(instance.find('div').length).to.equal(4);
  });
});
