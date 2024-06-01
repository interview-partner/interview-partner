import React, { useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/close_Icon.png';
import UploadResumeButton from '../../components/button/UploadResumeButton';
import RoundButton from '../../components/button/RoundButton.jsx';
import { COLORS } from "../../styles/colors";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 56px;
  border-radius: 8px;
  max-width: 800px;
  width: 450px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 50px;
`;

const CloseContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const FileName = styled.div`
  margin-top: 20px;
  color: ${COLORS.gray};
  font-size: 16px;
`;

const ResumeUploadModal = ({ isOpen, onClose, children }) => {
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleFileSelect = (file) => {
    setUploadedFileName(file.name);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseContainer>
          <Icon src={CloseIcon} alt="Close Icon" onClick={onClose} />
        </CloseContainer>
        {children}
        <ContentContainer>
          <UploadResumeButton onFileSelect={handleFileSelect} />
          {uploadedFileName && <FileName>{uploadedFileName}</FileName>}
        </ContentContainer>
        <ButtonContainer>
          <RoundButton color="white" bgColor={COLORS.blue_black}>
            이력서 업로드 하기
          </RoundButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ResumeUploadModal;
