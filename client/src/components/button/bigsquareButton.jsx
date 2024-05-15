import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"

const Button = styled.button`
  width: 120px;
  height: 45px;
  background-color: ${COLORS.sky_blue};
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const BigsquareButton = ({ to, children }) => {
  return (
    <Link to={to}>
      <Button>{children}</Button>
    </Link>
  );
};

export default BigsquareButton;
