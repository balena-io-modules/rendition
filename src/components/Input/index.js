import React from 'react';
import classNames from 'classnames';

const { PropTypes } = React;

const Input = ({
  className,
  disabled,
  emphasized,
  id,
  name,
  onChange,
  placeholder,
  required,
  type,
  value,
  ...props
} = {}) => {
  const classes = classNames('resin-control', className, { emphasized });
  const Tag = type === 'textarea' ? 'textarea' : 'input';

  return (
    <Tag
      {...props}
      type={type}
      className={classes}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      onChange={onChange}
      value={value}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emphasized: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  emphasized: false,
};

export default Input;
