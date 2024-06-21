import React, { useState, useEffect } from 'react';
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
  pointer-events: none; // 사용자가 직접 입력하지 못하도록 설정
`;

const CounterButton = ({ value, onChange }) => {
  const [counter, setCounter] = useState(value || 2); // 초기값을 2로 설정

  useEffect(() => {
    setCounter(value || 2); // 부모 컴포넌트로부터 받은 값이 있을 경우 해당 값으로 설정, 없으면 2로 설정
  }, [value]);

  const handleCounterChange = (delta) => {
    setCounter(prevCounter => {
      const newCounter = prevCounter + delta;
      if (newCounter < 2) return 2; // 최소값을 2로 제한
      onChange(newCounter);
      return newCounter;
    });
  };

  return (
    <CounterContainer>
      <StyledCounterButton type="button" onClick={() => handleCounterChange(-1)} disabled={counter <= 2}>-</StyledCounterButton>
      <CounterInput type="text" value={counter} readOnly />
      <StyledCounterButton type="button" onClick={() => handleCounterChange(1)}>+</StyledCounterButton>
    </CounterContainer>
  );
};

export default CounterButton;
