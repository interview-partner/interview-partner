import React from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS } from "../../styles/colors";
import RoundButton from '../../components/button/RoundButton';
import InputInterviewSetting from './InputInterviewSetting';
import InputPersonalInfo from '../../features/input/InputPersonalInfo';
import InputResumeSelect from '../../features/input/InputResumeSelect.jsx';
import Inputready from '../../features/input/Inputready';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
  margin-left: 490px;
  transition: transform 0.5s ease-in-out;
  transform: ${({ currentIndex }) => `translateX(-${currentIndex * 62.2}%)`};
  width: 500%;
`;

const Card = styled.div`
  min-width: 60%;
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
  overflow-y: auto;  // Add this line to enable scrolling if content overflows
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

function InputInterviewInfo({ currentIndex, setCurrentIndex }) {
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

  return (
    <Container>
      <Carousel>
        <CardContainer currentIndex={currentIndex}>
          <Card>
            <InputInterviewSetting />
            <ButtonContainer>
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
            <InputPersonalInfo />
            <ButtonContainer>
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
            <InputResumeSelect />
            <ButtonContainer>
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
            <Inputready />
            <ButtonContainer>
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
        </CardContainer>
      </Carousel>
    </Container>
  );
}

export default InputInterviewInfo;
