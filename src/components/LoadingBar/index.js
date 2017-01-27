import React from 'react';
import styles from './style.module.scss';
import _ from 'lodash';

const renderBars = (colors) => {
  return _.times(3, (i) => {
    return (
      <div
        key={i}
        style={{ backgroundColor: colors ? colors[i] : null }}
        className={styles.bar}>
      </div>
    );
  });
};

const Loading = ({ colors }) => {
  return (
    <section className={styles.loadBar}>
      {renderBars(colors)}
    </section>
  );
};

export default Loading;
