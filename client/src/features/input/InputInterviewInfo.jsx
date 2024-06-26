import React, { useState, useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { COLORS } from "../../styles/colors";
import RoundButton from '../../components/button/RoundButton';
import InputInterviewSetting from './InputInterviewSetting';
import InputPersonalInfo from '../../features/input/InputPersonalInfo';
import InputResumeSelect from '../../features/input/InputResumeSelect';
import InputReady from '../input/Inputready';
import { createInterviewRoom } from '../../services/interviewService';
import { useNavigate } from 'react-router-dom';
import { InterviewContext } from '../../context/interviewContext';
import LoadingModal from '../modal/InterviewLoadingModal';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 628px;
  width: 100%;
`;

const Carousel = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 90%;
  height: 628px;
  position: relative;
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 1;
  }
  &::before {
    left: 0;
    background: linear-gradient(to right, white, transparent);
  }
  &::after {
    right: 0;
    background: linear-gradient(to left, white, transparent);
  }
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: 430px;
  transition: transform 0.5s ease-in-out;
  transform: ${({ currentIndex }) => `translateX(-${currentIndex * 67}%)`};
  width: 500%;
`;

const Card = styled.div`
  min-width: 65%;
  max-width: 55%;
  height: 85%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
  padding: 20px;
  overflow-y: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  ${({ isVisible }) => css`
    visibility: ${isVisible ? 'visible' : 'hidden'};
    opacity: ${isVisible ? 1 : 0};
    animation: ${isVisible ? fadeIn : fadeOut} 0.5s ease-in-out;
  `}
`;

function InputInterviewInfo({ currentIndex, setCurrentIndex }) {
  const [interviewData, setInterviewData] = useState({
    title: '',
    interviewType: '',
    questionNumber: 0,
    jobAdvertisement: '',
    resumeId: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false); // 에러 상태 추가
  const navigate = useNavigate();
  const { setInterviewId } = useContext(InterviewContext);

  const nextCard = () => {
    if (currentIndex < 3) setCurrentIndex(currentIndex + 1);
  };

  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleCreateInterview = async () => {
    setIsLoading(true);
    setError(false); // 에러 상태 초기화
    try {
      const response = await createInterviewRoom(interviewData);
      if (response && response.status === 'success' && response.data) {
        const interviewId = response.data;
        setInterviewId(interviewId);
        const currentTime = new Date().toISOString();
        localStorage.setItem('interviewData', JSON.stringify({ ...interviewData, createdAt: currentTime }));
        navigate(`/promptroom/${interviewId}`);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      setError(true); // 에러 상태 설정
      console.error('Failed to create interview room:', error);
      alert('인터뷰 정보 작성을 마쳐주세요 '); // Display alert message
    } finally {
      setIsLoading(false); // 요청이 완료되면 로딩 상태 해제
    }
  };

  return (
    <Container>
      {isLoading && !error && <LoadingModal isOpen={true} />} {/* Show loading modal only if loading and no error */}
      <Carousel>
        <CardContainer currentIndex={currentIndex}>
          <Card>
            <InputInterviewSetting interviewData={interviewData} setInterviewData={setInterviewData} />
            <ButtonContainer isVisible={currentIndex === 0}>
              <RoundButton onClick={prevCard} disabled={currentIndex === 0} color="white" bgColor={COLORS.blue_black}>
                이전
              </RoundButton>
              <RoundButton onClick={nextCard} disabled={currentIndex === 3} color="white" bgColor={COLORS.blue_black}>
                다음
              </RoundButton>
            </ButtonContainer>
          </Card>
          <Card>
            <InputPersonalInfo interviewData={interviewData} setInterviewData={setInterviewData} />
            <ButtonContainer isVisible={currentIndex === 1}>
              <RoundButton onClick={prevCard} color="white" bgColor={COLORS.blue_black}>
                이전
              </RoundButton>
              <RoundButton onClick={nextCard} color="white" bgColor={COLORS.blue_black}>
                다음
              </RoundButton>
            </ButtonContainer>
          </Card>
          <Card>
            <InputResumeSelect interviewData={interviewData} setInterviewData={setInterviewData} />
            <ButtonContainer isVisible={currentIndex === 2}>
              <RoundButton onClick={prevCard} color="white" bgColor={COLORS.blue_black}>
                이전
              </RoundButton>
              <RoundButton onClick={nextCard} color="white" bgColor={COLORS.blue_black}>
                다음
              </RoundButton>
            </ButtonContainer>
          </Card>
          <Card>
            <InputReady
              interviewData={interviewData}
              setInterviewData={setInterviewData}
              onStartInterview={handleCreateInterview}
              currentIndex={currentIndex}
            />
            <ButtonContainer isVisible={currentIndex === 3}>
              <RoundButton onClick={prevCard} color="white" bgColor={COLORS.blue_black}>
                이전
              </RoundButton>
            </ButtonContainer>
          </Card>
        </CardContainer>
      </Carousel>
    </Container>
  );
}

export default InputInterviewInfo;
