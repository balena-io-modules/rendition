import React from 'react';
import { UncontrolledAlert } from 'reactstrap';
import classNames from 'classnames';

const CustomizeUncontrolledAlert = ({ inverse, color, className, size, ...props }) => (
  <UncontrolledAlert
    className={
      classNames({ [`bg-${color}`]: inverse, 'text-white': inverse, 'border-0': inverse, [`alert-${size}`]: size }, className)
    }
    color={color}
    {...props}
  />
);

export default CustomizeUncontrolledAlert;
