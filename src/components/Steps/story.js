import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { faMapSigns } from '@fortawesome/free-solid-svg-icons/faMapSigns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withReadme from 'storybook-readme/with-readme'
import { Checkbox, Flex, Steps, Step } from '../../'
import Readme from './README.md'

const stepLabels = [
  'Do this',
  'then this',
  'and then this',
  'and finally this!'
]

const getStep = (index, isComplete, setActiveStepIndex) => {
  return (
    <Step
      key={index}
      status={isComplete[index] ? 'completed' : 'pending'}
      onClick={() => setActiveStepIndex(index)}
      >
      {stepLabels[index]}
    </Step>
  )
}

const OrderedStepsWrapper = props => {
  const [activeStepIndex, setActiveStepIndex] = React.useState(1)
  const [isComplete, setIsComplete] = React.useState([true, true, false, false])
  const toggleIsComplete = () => {
    const newIsComplete = [...isComplete]
    newIsComplete.splice(activeStepIndex, 1, !isComplete[activeStepIndex])
    setIsComplete(newIsComplete)
  }

  return (
    <React.Fragment>
      <Steps
        ordered
        activeStepIndex={activeStepIndex}
        alignItems='center'
        justifyContent='center'
        m={3}
        {...props}
      >
        {stepLabels.map((_, index) =>
          getStep(index, isComplete, setActiveStepIndex)
        )}
      </Steps>
      <Flex mb={4} justifyContent='center' alignItems='center'>
        <Checkbox
          label={`Step ${activeStepIndex + 1} is complete`}
          onChange={toggleIsComplete}
          checked={isComplete[activeStepIndex]}
        />
      </Flex>
    </React.Fragment>
  )
}

storiesOf('Next/Steps', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <React.Fragment>
        <Steps m={3}>
          <Step status='completed'>These are</Step>
          <Step status='completed'>all completed</Step>
          <Step status='completed'>and not clickable</Step>
        </Steps>
        <Steps m={3}>
          <Step status='pending' onClick={() => null}>
            This one
          </Step>
          <Step status='completed' onClick={() => null}>
            Doesn't have
          </Step>
          <Step status='pending' onClick={() => null}>
            Title or dismiss button
          </Step>
          <Step status='none' onClick={() => null}>
            That's it (no icon)
          </Step>
        </Steps>
        <Steps
          m={3}
          titleIcon={<FontAwesomeIcon icon={faMapSigns} />}
          titleText={'Beginners Guide'}
          onClose={() => null}
        >
          <Step status='pending' onClick={() => null}>
            Do this
          </Step>
          <Step status='completed' onClick={() => null}>
            And then this
          </Step>
          <Step status='pending' onClick={() => null}>
            And finally this
          </Step>
        </Steps>
        <Steps m={3} bordered={false}>
          <Step status='pending' onClick={() => null}>
            Do this
          </Step>
          <Step status='completed' onClick={() => null}>
            And then this
          </Step>
          <Step status='pending' onClick={() => null}>
            And finally this
          </Step>
        </Steps>
      </React.Fragment>
    )
  })
  .add('Ordered', () => {
    return (
      <React.Fragment>
        <OrderedStepsWrapper bordered={false} />
        <OrderedStepsWrapper titleText='With title' onClose={() => null} />
      </React.Fragment>
    )
  })
