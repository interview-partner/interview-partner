import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ padding }) => padding || '8px 16px'}; 
  font-size: ${({ fontSize }) => fontSize || '14px'}; 
  border: ${({ borderColor }) => borderColor ? `1px solid ${borderColor}` : 'none'}; 
  border-radius: 20px;
  color: ${({ color }) => color || COLORS.font_black}; 
  background-color: ${({ bgColor }) => bgColor || COLORS.sky_blue}; 
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  gap: 8px; 

  &:hover {
    opacity: 0.8; 
  }

  &:disabled {
    background-color: ${COLORS.light_gray};
    cursor: not-allowed;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

const RoundButton = ({ to, children, iconSrc, color, bgColor, fontSize, borderColor, padding, onClick, disabled }) => {
  const content = (
    <Button 
      color={color} 
      bgColor={bgColor} 
      fontSize={fontSize} 
      borderColor={borderColor} 
      padding={padding}
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
      {iconSrc && <img src={iconSrc} alt="icon" />} 
    </Button>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  
  return content;
};

export default RoundButton;
