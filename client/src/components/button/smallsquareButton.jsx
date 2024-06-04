import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

const Button = styled.button`
  background-color: ${props => props.active ? COLORS.sky_blue : COLORS.light_gray};
  padding: 8px 52px;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
`;


const SmallsquareButton = ({ children, active, onClick }) => {
  return (
    <Button active={active} onClick={onClick}>
      {children}
    </Button>
  );
};

export default SmallsquareButton;
