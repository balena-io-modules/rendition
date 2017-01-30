import Avatar from './';
import TestContainer from '../../utils/TestContainer';

describe('Avatar', () => {
  it('Should mount with src prop', () => {
    const image = 'http://openplus.ca/images/photo.jpg'
    const instance = mount(
      <TestContainer>
        <Avatar src={image}/>
      </TestContainer>
    );
    console.log()
    chaiExpect(instance.find('img')).to.have.attr('src', image);
  });

  it('Should mount without src prop', () => {
    const instance = mount(
      <TestContainer>
        <Avatar />
      </TestContainer>
    );
    chaiExpect(instance.find('img')).to.have.attr('src');
  });
});
