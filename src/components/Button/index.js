import React from 'react';
import classNames from 'classnames';

const { PropTypes } = React;

const Button = ({
  btnStyle,
  children,
  className,
  disabled,
  onClick,
  id,
} = {}) => {
  let classes = classNames('resin-control', className);

  if (btnStyle) {
    classes += ` resin-control_btn-${btnStyle}`;
  }

  return (
    <button
      onClick={onClick}
      id={id}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  btnStyle: PropTypes.string,
  children: React.PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  // 'primary', 'secondary', 'dark', 'light'
  btnStyle: 'dark',
};

export default Button;
