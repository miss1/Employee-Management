import { Steps } from 'antd';
import {useState} from "react";
import { getCurrentOnboardingStep } from '../../utils/util';
import OnboardingForm from '../../components/OnboardingForm';

const OnBoarding = () => {
  const [currentStep, setCurrentStep] = useState(getCurrentOnboardingStep());
  const [feedback, setFeedback] = useState('');

  const updateSteps = (step: number, msg: string) => {
    setCurrentStep(step);
    setFeedback(msg);
  };

  return (
    <div className="content" style={{overflowY: 'auto'}}>
      <div style={{width: '70%', margin: '20px auto'}}>
        <Steps
          current={currentStep}
          items={[
            {title: 'Waiting for submit', description: 'Please submit your application'},
            {title: 'Pending', description: 'Please wait for HR to review your application'},
            {
              title: currentStep === 2 ? 'Rejected' : 'Waiting for decision',
              description: feedback,
              status: currentStep === 2 ? 'error' : 'wait'}
          ]}
        />
      </div>
      <OnboardingForm callback={updateSteps} />
    </div>
  );
};

export default OnBoarding;