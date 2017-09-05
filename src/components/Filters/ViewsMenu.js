import { h, Component } from 'preact'
import styled from 'styled-components'
import Divider from '../Divider'
import { Box } from '../Grid'
import Fixed from '../Fixed'
import Text from '../Text'
import { FaCaretDown, FaTrash, FaPieChart } from 'react-icons/lib/fa'
import Button from '../Button'
import FilterDescription from './FilterDescription'

const Wrapper = styled.div``

const UnstyledList = styled.ul`
  list-style: none;
  padding: 0 !important;
  margin: 0;
`

const PlainPanel = styled.div`
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  border: solid 0.5px #9b9b9b;
`

const Preview = styled(PlainPanel)`
  display: none;
  position: absolute;
  right: 230px;
  width: 400px;
  right: 302px;
  top: 2px;
  padding: 15px 15px 5px;
`

const ViewListItem = styled.li`
  position: relative;
  padding: 7px 20px;
  &:hover {
    background-color: #f3f3f3;
  }
  & > ${Text} {
    padding-right: 20px;
  }
  & > button {
    position: absolute;
    top: 7px;
    right: 10px;
    padding: 8px;
    background: none;
    border: none;
    display: none;
  }
  &:hover > button {
    display: block;
  }
  &:hover ${Preview} {
    display: block;
  }
`

const MenuPanel = styled(PlainPanel)`
  position: absolute;
  width: 300px;
  right: 0;
  top: 40px;
  z-index: 1;
`

class ViewsMenu extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showViewsMenu: false
    }
  }

  loadView (view) {
    this.props.setRules(view.rules)
    this.setState({ showViewsMenu: false })
  }

  render () {
    const { views } = this.props
    const hasGlobalViews = views.global && !!views.global.length
    const hasUserViews = views.user && !!views.user.length
    return (
      <Wrapper>
        <Button
          onClick={() =>
            this.setState({ showViewsMenu: !this.state.showViewsMenu })}
        >
          <FaPieChart style={{ marginRight: 10 }} />
          Views
          <FaCaretDown style={{ float: 'right' }} name='caret-down' />
        </Button>
        {this.state.showViewsMenu && (
          <Fixed
            z={1}
            onClick={() => this.setState({ showViewsMenu: false })}
            top
            right
            bottom
            left
          />
        )}
        {this.state.showViewsMenu && (
          <MenuPanel className='views-menu__panel'>
            {!hasGlobalViews &&
            !hasUserViews && (
            <Box p={3}>{"You haven't created any views yet"}</Box>
              )}
            {hasGlobalViews && (
              <Box>
                <Text fontSize={13} ml={20} mb={2} mt={2} color='#ccc'>
                  Global views
                </Text>
                <UnstyledList>
                  {views.global.map(view => (
                    <ViewListItem key={view.name}>
                      <Text onClick={() => this.loadView(view)}>
                        {view.name}
                        <br />
                        <Text fontSize={12}>
                          {view.rules.length} filter{view.rules.length > 1 && 's'}
                        </Text>
                      </Text>
                      <button>
                        <FaTrash
                          name='trash'
                          onClick={() => this.props.deleteView(view)}
                        />
                      </button>
                      <Preview>
                        {view.rules.map(rule => (
                          <Box mb={10} key={rule.id}>
                            <FilterDescription rule={rule} />
                          </Box>
                        ))}
                      </Preview>
                    </ViewListItem>
                  ))}
                </UnstyledList>
              </Box>
            )}
            {hasGlobalViews && hasUserViews && <Divider color='#ccc' />}
            {hasUserViews && (
              <Box>
                <Text fontSize={13} ml={20} mb={2} mt={2} color='#ccc'>
                  Your views
                </Text>
                <UnstyledList>
                  {views.user.map(view => (
                    <ViewListItem key={view.id}>
                      <Text onClick={() => this.loadView(view)}>
                        {view.name}
                        <br />
                        <Text fontSize={12}>
                          {view.rules.length} filter{view.rules.length > 1 && 's'}
                        </Text>
                      </Text>
                      <button>
                        <FaTrash
                          name='trash'
                          onClick={() => this.props.deleteView(view)}
                        />
                      </button>
                      <Preview>
                        {view.rules.map(rule => (
                          <Box mb={10} key={rule.id}>
                            <FilterDescription rule={rule} />
                          </Box>
                        ))}
                      </Preview>
                    </ViewListItem>
                  ))}
                </UnstyledList>
              </Box>
            )}
          </MenuPanel>
        )}
      </Wrapper>
    )
  }
}

export default ViewsMenu
