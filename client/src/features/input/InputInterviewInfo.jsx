import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
`;

const Carousel = styled.div`
  display: flex;
  overflow: hidden;
  width: 80%;
  height: 200px;
  position: relative;
`;

const CardContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: ${({ currentIndex }) => `translateX(-${currentIndex * 100}%)`};
`;

const Card = styled.div`
  min-width: 100%;
  height: 100%;
  background-color: ${COLORS.sky_blue};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
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
