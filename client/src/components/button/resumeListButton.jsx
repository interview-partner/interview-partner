import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import ActiveCheckCircle from "../../assets/icons/activeCheckCircle.png";
import UnactiveCheckCircle from "../../assets/icons/unactiveCheckCircle.png";

const ResumeContainer = styled.div`
    display: flex;
    flex-direction: row;
    text-align: center;
    width: 100%;
    margin-bottom: 16px; 
    background: white;
    border-radius: 10px;
    box-shadow: ${({ borderColor }) => borderColor ? `inset 0 0 0 2px ${borderColor}` : '0 2px 8px rgba(99, 99, 99, 0.2)'};
    padding: 16px;
    cursor: pointer; 
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 16px;
`;

const MoveText = styled.div`
    padding-top: 3px;
`;

const ResumeListButton = ({ children }) => {
    const [borderColor, setBorderColor] = useState(null);
    const [isActive, setIsActive] = useState(false);

    const toggleBorderColor = () => {
        setBorderColor(prevColor => 
            prevColor === null ? '#62AED5' : null
        );
        setIsActive(prevActive => !prevActive);
    };

    return (
        <ResumeContainer borderColor={borderColor} onClick={toggleBorderColor}>
            <Icon src={isActive ? ActiveCheckCircle : UnactiveCheckCircle} alt="CheckCircle" />
            <MoveText>
                {children}
            </MoveText>
        </ResumeContainer>
    );
};

export default ResumeListButton;