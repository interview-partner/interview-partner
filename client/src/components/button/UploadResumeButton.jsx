import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import UploadIcon from '../../assets/icons/uploadIcon.png';
import RefreshIcon from '../../assets/icons/refreshIcon.png';

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
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const UploadResumeButton = ({ onFileSelect }) => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setIsFileUploaded(true);
        setErrorMessage(''); // Reset error message
        onFileSelect(file); // Pass the file to the parent component
      } else {
        setIsFileUploaded(false);
        setErrorMessage('PDF 파일만 업로드 가능합니다.'); // Display error message
      }
    }
  };

  return (
    <Container>
      <CircleButton onClick={handleButtonClick}>
        <Icon src={isFileUploaded ? RefreshIcon : UploadIcon} alt="Upload Icon" />
      </CircleButton>
      <Content>
        이력서 파일을 업로드 해주세요 (PDF만 가능)
      </Content>
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf" // Only accept PDF files
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} {/* 에러 메시지를 표시 */}
    </Container>
  );
};

export default UploadResumeButton;
