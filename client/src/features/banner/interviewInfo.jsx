import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import ArrowButton from "../../components/button/arrowButton.jsx";

const BannerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  height: 28%;
  background-color: ${COLORS.background_gray};
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  height: 85%;
  width: 15%;
  padding: 24px;
  background-color: white;
`;

const Title = styled.div`
  display: flex;
  color: ${COLORS.font_black};
  border: none;
  border-radius: 15px;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: Medium;
`;

const Info = styled.div`
  display: flex;
  margin-bottom: 8px;
  color: ${COLORS.gray};
  font-size: 14px;
`;

const ApplyContainer = styled.div`
  height: 85%;
  width: 7%;
  background-color: white;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; 
`;

function InterviewInfo() {
  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('interviewData'));
    setInterviewData(data);
  }, []);

  if (!interviewData) {
    return <div>Loading...</div>;
  }

  return (
    <BannerContainer>
      <ApplyContainer>사진들어가면댐</ApplyContainer>
      <InnerContainer>
        <Title>{interviewData.title}</Title>
        <Info>면접 일자&nbsp;|&nbsp;2024.05.07</Info>
        <Info>면접 방식&nbsp;|&nbsp;{interviewData.interviewType}</Info>
        <Info>이력서&nbsp;|&nbsp;{interviewData.resumeId}</Info>
        <ButtonContainer>
          <ArrowButton to="back">수정 하기</ArrowButton>
        </ButtonContainer>
      </InnerContainer>
    </BannerContainer>
  );
}

export default InterviewInfo;
