import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import UploadIcon from '../../assets/icons/uploadIcon.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  border: 2px dashed ${COLORS.light_gray};
  border-radius: 8px;
`;

const CircleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 55px;
  border: none;
  border-radius: 50%;
  background-color: ${COLORS.sky_blue};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8AC3E0; 
  }
`;

const Content = styled.div`
  display: flex;
  color: ${COLORS.gray};
  font-size: 16px;
  margin-top: 30px;
`

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const UploadResumeButton = ({ onClick }) => {
  return (
    <Container>
      <CircleButton onClick={onClick}>
        <Icon src={UploadIcon} alt="Upload Icon" />
      </CircleButton>
      <Content>
        이력서 파일을 업로드 해주세요
      </Content>
    </Container>
  );
};

export default UploadResumeButton;
