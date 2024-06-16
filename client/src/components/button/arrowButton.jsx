import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center; 
    align-items: center; 
    gap: 8px;
`;

const Button = styled.button`
    display: flex;
    background-color: ${COLORS.sky_blue};
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;

    &:hover {
    background: linear-gradient(
        58deg,
        #7BC7EE 20%,
        #7BC7EE 100%
    );
    }
`;

const ButtonIndex = styled.div`
    display: flex;
    font-size: 14px;
    color : ${COLORS.font_black};
`

const ArrowButton = ({ to, children }) => {

    const navigate = useNavigate();

    const handleClick = (e) => {
      if (to === "back") {
        e.preventDefault(); 
        navigate(-1);
      }
    };
  
    if (to === "back") {
      return (
        <ButtonContainer>
            <ButtonIndex>
                {children}
            </ButtonIndex>
            <Button onClick={handleClick}>
                <span class="material-symbols-outlined">
                    arrow_forward
                </span>
            </Button>
        </ButtonContainer>
        
      );
    }

    return (
    <Link to={to}>
        <Button>{children}</Button>
    </Link>
    );
};

export default ArrowButton;
