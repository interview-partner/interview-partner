import React from 'react';
import styled from 'styled-components';
import ActiveCheckCircle from "../../assets/icons/activeCheckCircle.png";
import UnactiveCheckCircle from "../../assets/icons/unactiveCheckCircle.png";

const ResumeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center; /* Center content vertically */
  min-width: 100%;
  margin-bottom: 5px; 
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
  flex-grow: 1; /* Ensure text takes up available space */
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflow text */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
  padding-top: 3px;
`;

const ResumeListButton = ({ children, isActive, onClick }) => {
  const borderColor = isActive ? '#62AED5' : null;

  return (
    <ResumeContainer borderColor={borderColor} onClick={onClick} title={children}>
      <Icon src={isActive ? ActiveCheckCircle : UnactiveCheckCircle} alt="CheckCircle" />
      <MoveText>
        {children}
      </MoveText>
    </ResumeContainer>
  );
};

export default ResumeListButton;
