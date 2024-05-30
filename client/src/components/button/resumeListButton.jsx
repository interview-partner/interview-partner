import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

const ResumeContainer = styled.div`
    display: flex;
    width: 100%; 
    margin-bottom: 16px; 
    background: white;
    border: ${({ borderColor }) => borderColor ? `2px solid ${borderColor}` : 'none'};
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(99, 99, 99, 0.2);
    padding: 16px;
    cursor: pointer; 
`;

const ResumeList = ({ text }) => {
    const [borderColor, setBorderColor] = useState(null);

    const toggleBorderColor = () => {
        setBorderColor(prevColor => 
            prevColor === null ? COLORS.activeBorder : null
        );
    };

    return (
        <ResumeContainer borderColor={borderColor} onClick={toggleBorderColor}>
            {text}
        </ResumeContainer>
    );
};

export default ResumeList;
