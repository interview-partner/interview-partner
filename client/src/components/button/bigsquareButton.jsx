import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

const Button = styled.button`
  width: 120px;
  height: 45px;
  background-color: ${COLORS.sky_blue};
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  cursor: pointer;
`;

const BigSquareButton = ({ to, children, onClick }) => {
  return (
    <Button onClick={onClick}>
      {children}
    </Button>
  );
};

export default BigSquareButton;
