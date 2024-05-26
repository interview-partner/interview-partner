import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

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
  margin-left: 180px;
  transition: transform 0.5s ease-in-out;
  transform: ${({ currentIndex }) => `translateX(-${currentIndex * 83}%)`};
  width: 500%;
`;

const Card = styled.div`
  min-width: 80%;
  height: 90%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${COLORS.light_gray}; 
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px;
  background-color: ${COLORS.sky_blue};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: ${COLORS.light_gray};
    cursor: not-allowed;
  }
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
          <Card>Card 1</Card>
          <Card>Card 2</Card>
          <Card>Card 3</Card>
          <Card>Card 4</Card>
        </CardContainer>
      </Carousel>
      <div>
        <Button onClick={prevCard} disabled={currentIndex === 0}>
          Previous
        </Button>
        <Button onClick={nextCard} disabled={currentIndex === 3}>
          Next
        </Button>
      </div>
    </Container>
  );
}

export default InputInterviewInfo;
