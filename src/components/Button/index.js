import React from 'react';
import classNames from 'classnames';

const { PropTypes } = React;

const Button = ({
  btnStyle,
  children,
  className,
  disabled,
  emphasized,
  href,
  id,
  onClick,
  ...props
} = {}) => {
  let classes = classNames('resin-control', 'resin-control-btn', className, { emphasized });

  if (btnStyle) {
    classes += ` resin-control-btn-${btnStyle}`;
  }

  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      {...props}
      onClick={onClick}
      id={id}
      className={classes}
      disabled={disabled}
      href={href}
    >
      {children}
    </Tag>
  );
};

Button.propTypes = {
  btnStyle: PropTypes.string,
  children: React.PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emphasized: PropTypes.bool,
  href: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  btnStyle: 'dark',
  emphasized: false,
};

export default Button;
