import React from 'react';
import styles from './style.module.scss';
import Identicon from 'identicon.js';
import _ from 'lodash';

const GenerateIcon = (id, size) => {
  // key can be any unique id
  return new Identicon(id, size).toString();
};

const getImage = (image, id, size) => {
  if (!image) {
    return `data:image/png;base64,${GenerateIcon(id, size)}`;
  }
  return image;
};

const Container = ({ children }) => {
  return (
    <div className={styles.user}>
      {children}
    </div>
  );
};

const Icon = ({
  image,
  id = _.random(5 * 999).toString(),
  size = 100,
  borderRadius = 'rounded-circle',
  border = true
}) => {
  return (
    <span
      className={[ styles.imageContainer, borderRadius, !border && 'border-0' ].join(' ')}
      style={{ width: size, height: size }
    }>
      <img
      className={[ styles.image, borderRadius ].join(' ')}
      src={getImage(image, id, size)}
      alt={name} />
    </span>
  );
};

const Info = ({ children }) => {
  return (
    <span className={styles.infoContainer}>
      {children}
    </span>
  );
};

export {
  Container,
  Icon,
  Info
};
