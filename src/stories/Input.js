import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Input } from '../index';

storiesOf('Input', module)
.addWithInfo('Standard', () => {
  return (
    <div>
      <p>Standard</p>
      <Input />

      <p>Password</p>
      <Input type="password" placeholder="Password" />

      <p>Disabled</p>
      <Input placeholder="Placeholder" disabled />

      <p>Error</p>
      <Input placeholder="Placeholder" className="error" />

      <p>Success</p>
      <Input placeholder="Placeholder" className="success" />

      <p>Textarea</p>
      <Input placeholder="Placeholder" type="textarea" />
    </div>
  );
})
.addWithInfo('Emphasized', () => {
  return (
    <div>
      <p>Emphasized</p>
      <Input emphasized />

      <p>Password</p>
      <Input emphasized type="password" placeholder="Password" />

      <p>Disabled</p>
      <Input emphasized placeholder="Placeholder" disabled />

      <p>Error</p>
      <Input emphasized placeholder="Placeholder" className="error" />

      <p>Success</p>
      <Input emphasized placeholder="Placeholder" className="success" />

      <p>Textarea</p>
      <Input emphasized placeholder="Placeholder" type="textarea" />
    </div>
  );
});
