import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { COLORS } from "../../styles/colors";
import RoundButton from '../../components/button/RoundButton';
import InputInterviewSetting from './InputInterviewSetting';
import InputPersonalInfo from '../../features/input/InputPersonalInfo';
import InputResumeSelect from '../../features/input/InputResumeSelect';
import InputReady from './InputReady';
import { createInterviewRoom } from '../../services/interviewService';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 628px;
  width: 100%;
`;

const Carousel = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 90%;
  height: 628px;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 1;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, white, transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, white, transparent);
  }
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: 630px;
  transition: transform 0.5s ease-in-out;
  transform: ${({ currentIndex }) => `translateX(-${currentIndex * 57}%)`};
  width: 500%;
`;

const Card = styled.div`
  min-width: 55%;
  height: 85%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${COLORS.light_gray}; 
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
  padding: 20px;
  overflow-y: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  ${({ isVisible }) => css`
    visibility: ${isVisible ? 'visible' : 'hidden'};
    opacity: ${isVisible ? 1 : 0};
    animation: ${isVisible ? fadeIn : fadeOut} 0.5s ease-in-out;
  `}
`;

function InputInterviewInfo({ currentIndex, setCurrentIndex }) {
  const [interviewData, setInterviewData] = useState({
    title: '',
    interviewType: '',
    questionNumber: 0,
    jobAdvertisement: '',
    resumeId: null
  });

  const nextCard = () => {
    if (currentIndex < 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCreateInterview = async () => {
    try {
      const response = await createInterviewRoom(interviewData);
      alert('Interview room created successfully!');
      console.log('Created interview room:', response);
    } catch (error) {
      alert(`Failed to create interview room: ${error.message}`);
    }
  };

  return (
    <Container>
      <Carousel>
        <CardContainer currentIndex={currentIndex}>
          <Card>
            <InputInterviewSetting interviewData={interviewData} setInterviewData={setInterviewData} />
            <ButtonContainer isVisible={currentIndex === 0}>
              <RoundButton
                onClick={prevCard}
                disabled={currentIndex === 0}
                color="white"
                bgColor={COLORS.blue_black}
              >
                Previous
              </RoundButton>
              <RoundButton
                onClick={nextCard}
                disabled={currentIndex === 3}
                color="white"
                bgColor={COLORS.blue_black}
              >
                Next
              </RoundButton>
            </ButtonContainer>
          </Card>
          <Card>
            <InputPersonalInfo interviewData={interviewData} setInterviewData={setInterviewData} />
            <ButtonContainer isVisible={currentIndex === 1}>
              <RoundButton
                onClick={prevCard}
                disabled={currentIndex === 0}
                color="white"
                bgColor={COLORS.blue_black}
              >
                Previous
              </RoundButton>
              <RoundButton
                onClick={nextCard}
                disabled={currentIndex === 3}
                color="white"
                bgColor={COLORS.blue_black}
              >
                Next
              </RoundButton>
            </ButtonContainer>
          </Card>
          <Card>
            <InputResumeSelect interviewData={interviewData} setInterviewData={setInterviewData} />
            <ButtonContainer isVisible={currentIndex === 2}>
              <RoundButton
                onClick={prevCard}
                disabled={currentIndex === 0}
                color="white"
                bgColor={COLORS.blue_black}
              >
                Previous
              </RoundButton>
              <RoundButton
                onClick={nextCard}
                disabled={currentIndex === 3}
                color="white"
                bgColor={COLORS.blue_black}
              >
                Next
              </RoundButton>
            </ButtonContainer>
          </Card>
          <Card>
            <InputReady interviewData={interviewData} setInterviewData={setInterviewData} />
            <ButtonContainer isVisible={currentIndex === 3}>
              <RoundButton
                onClick={prevCard}
                disabled={currentIndex === 0}
                color="white"
                bgColor={COLORS.blue_black}
              >
                Previous
              </RoundButton>
              <RoundButton
                onClick={handleCreateInterview}
                disabled={currentIndex !== 3}
                color="white"
                bgColor={COLORS.blue_black}
              >
                Create Interview
              </RoundButton>
            </ButtonContainer>
          </Card>
        </CardContainer>
      </Carousel>
    </Container>
  );
}

export default InputInterviewInfo;
