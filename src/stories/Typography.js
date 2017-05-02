import React from 'react';
import { storiesOf } from '@kadira/storybook';

storiesOf('Typography', module)
.addWithInfo('Standard', () => {
  return (
    <div>
      <h1>Header 1</h1>
      <h2>Header 2</h2>
      <h3>Header 3</h3>
      <h4>Header 4</h4>
      <h5>Header 5</h5>
      <p>
        Pargraph text - Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed vitae leo malesuada, aliquet sapien at, elementum mauris.
        In quis pharetra quam. Sed vitae leo malesuada, aliquet sapien at,
        elementum mauris. In quis pharetra quam.Sed vitae leo malesuada,
        aliquet sapien at, elementum mauris. In quis pharetra quam
      </p>
      <a href="/">This is an inline link</a>
      <div className="mb-2" />
      <pre>This is an example of preformatted text</pre>

    </div>
  );
}).addWithInfo('Badges', () => {
  return (
    <div className="mb-2">
      <p>
        <span className="mx-1 badge badge-default">Default</span>
        <span className="mx-1 badge badge-primary">Primary</span>
        <span className="mx-1 badge badge-success">Success</span>
        <span className="mx-1 badge badge-info">Info</span>
        <span className="mx-1 badge badge-warning">Warning</span>
        <span className="mx-1 badge badge-danger">Danger</span>
      </p>
    </div>
  );
});
