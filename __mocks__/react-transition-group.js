const CSSTransitionGroup = jest.genMockFromModule('react-transition-group/CSSTransitionGroup');

// .animate() throws an error (false negative) when running tests, so we
// mock it here.
CSSTransitionGroup.animate = () => {
};

export default CSSTransitionGroup;
