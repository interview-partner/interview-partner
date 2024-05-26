import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

export const CounterContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledCounterButton = styled.button`
    display: flex;
    
    width: 30px;
    height: 30px;
    border: 1px solid ${COLORS.light_gray};
    background-color: white;
    cursor: pointer;
    font-size: 18px;
    border-radius: 5px;
    padding-top: 2px;
    justify-content: center; 
    text-align: center;
    &:hover {
    background-color: ${COLORS.light_gray};
    }
`;

export const CounterInput = styled.input`
  width: 50px;
  text-align: center;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 5px;
  height: 30px;
  margin: 0 10px;
`;

const CounterButton = () => {
  const [counter, setCounter] = useState(0);

  const handleCounterChange = (delta) => {
    setCounter(prevCounter => {
      const newCounter = prevCounter + delta;
      return newCounter < 0 ? 0 : newCounter;
    });
  };

  return (
    <CounterContainer>
      <StyledCounterButton type="button" onClick={() => handleCounterChange(-1)}>-</StyledCounterButton>
      <CounterInput type="text" value={counter} readOnly />
      <StyledCounterButton type="button" onClick={() => handleCounterChange(1)}>+</StyledCounterButton>
    </CounterContainer>
  );
};

export default CounterButton;
