import React from 'react';
import classNames from 'classnames';

const { PropTypes } = React;

const Input = ({
  className,
  disabled,
  id,
  name,
  onChange,
  placeholder,
  required,
  type,
} = {}) => {
  const classes = classNames('resin-control', className);

  return (
    <input
      type={type}
      className={classes}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
};

export default Input;
