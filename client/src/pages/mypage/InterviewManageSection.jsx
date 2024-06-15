import React from 'react';
import styled from 'styled-components';

const InterviewSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 48%;
    padding-bottom: 1rem;
`;

const InterviewHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid #ccc;
    margin-bottom: 0.5rem;
    height: 40px;
`;

const HeaderText = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
`;

const IconButton = ({ onClick, iconSrc, altText, iconHeight }) => (
    <button onClick={onClick} style={{ backgroundColor: "transparent", border: "none", cursor: "pointer" }}>
        <img src={iconSrc} alt={altText} style={{ height: iconHeight }} />
    </button>
);

const InterviewManageSection = ({ title, titleIconSrc, onClick, iconSrc, altText, iconHeight, children }) => (
    <InterviewSection>
        <InterviewHeader>
            <HeaderText>
                {titleIconSrc && <img src={titleIconSrc} alt={`${title} icon`} style={{ height: '30px', marginRight: "8px" }} />}
                {title}
            </HeaderText>
            <IconButton
                onClick={onClick}
                iconSrc={iconSrc}
                altText={altText}
                iconHeight={iconHeight}
            />
        </InterviewHeader>
        {children}
    </InterviewSection>
);

export default InterviewManageSection;
