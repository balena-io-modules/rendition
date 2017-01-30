import LoadingBar from './';
import TestContainer from '../../utils/TestContainer';

import initStoryshots from 'storyshots';
initStoryshots();

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
