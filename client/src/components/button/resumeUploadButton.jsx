import React from 'react';
import styled from 'styled-components';
import PlusCircle from '../../assets/icons/plusCircle.png';

const ResumeContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center; 
  width: 100%;
  margin-bottom: 5px; 
  background: rgba(217, 217, 217, 0.38);
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: rgba(217, 217, 217, 0.58);
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const ResumeUploadButton = ({ children, isActive, onClick }) => {
  return (
    <ResumeContainer onClick={onClick}>
      <Icon src={PlusCircle} alt="PlusCircle" />
    </ResumeContainer>
  );
};

export default ResumeUploadButton;
