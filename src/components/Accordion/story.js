import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Accordion, Box } from '../../'
import AccordionReadme from './README.md'

storiesOf('Next/Accordion', module)
  .addDecorator(withReadme(AccordionReadme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Accordion
          items={[
            { label: 'Heading one', panel: 'First Panel' },
            { label: 'Second Heading', panel: 'Second Panel' }
          ]}
        />
      </Box>
    )
  })
