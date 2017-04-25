import React from 'react';
import classNames from 'classnames';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

const { Component, PropTypes } = React;
const FirstChild = ({ children }) => (
  React.Children.toArray(children)[0] || null
);

class Alert extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: true };

    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ isOpen: false });
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  render() {
    const {
      children,
      className,
      dismissable,
      emphasized,
      id,
      onDismiss,
      transitionAppearTimeout,
      transitionEnterTimeout,
      transitionLeaveTimeout,
      type,
      title,
      ...props
    } = this.props;

    const classes = classNames(
      'resin-alert',
      className,
      { emphasized },
      { dismissable },
      `resin-alert-${type}`,
    );

    const alert = (
      <div
        {...props}
        role="alert"
        id={id}
        className={classes}
      >
        { (onDismiss || dismissable) &&
          <button type="button" className="close" aria-label="Close" onClick={this.close}>
            <span aria-hidden="true">&times;</span>
          </button> }
        { title && <span className="resin-alert__title">{title}</span> }
        {children}
      </div>
    );

    return (
      <CSSTransitionGroup
        component={FirstChild}
        transitionName={{
          appear: 'fade',
          appearActive: 'show',
          enter: 'fade',
          enterActive: 'show',
          leave: 'fade',
          leaveActive: 'out',
        }}
        transitionAppear={transitionAppearTimeout > 0}
        transitionAppearTimeout={transitionAppearTimeout}
        transitionEnter={transitionEnterTimeout > 0}
        transitionEnterTimeout={transitionEnterTimeout}
        transitionLeave={transitionLeaveTimeout > 0}
        transitionLeaveTimeout={transitionLeaveTimeout}
      >
        {this.state.isOpen ? alert : null}
      </CSSTransitionGroup>
    );
  }
}

Alert.propTypes = {
  children: React.PropTypes.node,
  className: PropTypes.string,
  dismissable: PropTypes.bool,
  emphasized: PropTypes.bool,
  id: PropTypes.string,
  onDismiss: PropTypes.func,
  transitionAppearTimeout: PropTypes.number,
  transitionEnterTimeout: PropTypes.number,
  transitionLeaveTimeout: PropTypes.number,
  // success, danger, warning, info
  type: PropTypes.string,
};

Alert.defaultProps = {
  isOpen: true,
  emphasized: false,
  transitionAppearTimeout: 250,
  transitionEnterTimeout: 250,
  transitionLeaveTimeout: 250,
  type: 'success',
};

export default Alert;
