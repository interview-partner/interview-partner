import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

const Button = styled.button`
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 20px;
  color: ${({ color }) => color || COLORS.font_black}; 
  background-color: ${({ bgColor }) => bgColor || COLORS.sky_blue}; 
  cursor: pointer;
  text-align: center;
  text-decoration: none;

  &:hover {
    opacity: 0.8; 
  }

  &:disabled {
    background-color: ${COLORS.light_gray};
    cursor: not-allowed;
  }
`;

const RoundButton = ({ to, children, color, bgColor, onClick, disabled }) => {
  if (to) {
    return (
      <Link to={to}>
        <Button color={color} bgColor={bgColor} disabled={disabled}>
          {children}
        </Button>
      </Link>
    );
  }
  return (
    <Button color={color} bgColor={bgColor} onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
};

export default RoundButton;
