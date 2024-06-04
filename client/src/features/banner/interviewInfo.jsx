import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import ArrowButton from "../../components/button/arrowButton.jsx";
import { getInterviewInfo } from '../../services/getInterviewInfoService';
import { InterviewContext } from '../../context/interviewContext';

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
  width: 25%;
  padding: 24px;
  background-color: white;
`;
//원래는 15%

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tooltip = styled.div`
  visibility: hidden;
  width: auto;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Position the tooltip above the text */
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`;

const InfoWithTooltip = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
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
  const { interviewId } = useContext(InterviewContext);
  const [interviewData, setInterviewData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInterviewInfo = async () => {
      try {
        const data = await getInterviewInfo(interviewId);
        setInterviewData(data.data); // Assuming the response structure is { status, data, message }
      } catch (err) {
        setError(err.message);
      }
    };

    if (interviewId) {
      fetchInterviewInfo();
    }
  }, [interviewId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!interviewData) {
    return <div>Loading...</div>;
  }

  const formattedDate = new Date(interviewData.createDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const interviewType = interviewData.interviewType === 'text' ? '실시간 채팅 면접' : '음성 면접';
  // <ApplyContainer>사진들어가면댐</ApplyContainer> 

  return (
    <BannerContainer>
      <InnerContainer>
        <Title>{interviewData.title}</Title>
        <Info>면접 일자&nbsp;|&nbsp;{formattedDate}</Info>
        <Info>면접 방식&nbsp;|&nbsp;{interviewType}</Info>
        <InfoWithTooltip>
          <Info>이력서&nbsp;|&nbsp;{interviewData.resumeFileName}</Info>
          <Tooltip>{interviewData.resumeFileName}</Tooltip>
        </InfoWithTooltip>
        <ButtonContainer>
          <ArrowButton to="back">수정 하기</ArrowButton>
        </ButtonContainer>
      </InnerContainer>
    </BannerContainer>
  );
}

export default InterviewInfo;