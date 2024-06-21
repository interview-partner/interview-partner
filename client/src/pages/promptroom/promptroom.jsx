import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import InterviewChat from "../../features/chat/interviewChat";
import InterviewInfo from "../../features/banner/interviewInfo";
import VoiceCheckModal from '../../features/modal/VoiceCheckModal'; // 모달 임포트
import { getInterviewInfo } from '../../services/getInterviewInfoService';


const PromptroomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: hidden;
`;

const InterviewInfoContainer = styled.div`
  width: 100%;
  z-index: 1;
`;

const ChatContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

function Promptroom() {
  const { id } = useParams(); // URL에서 interviewId를 가져옴
  const interviewId = parseInt(id, 10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoiceChecked, setIsVoiceChecked] = useState(false);
  const [interviewType, setInterviewType] = useState('');

  useEffect(() => {
    // 인터뷰 타입을 가져오는 로직 추가
    const fetchInterviewType = async () => {
      try {
        // getInterviewInfo는 인터뷰 타입을 포함한 정보를 반환해야 함
        const interviewInfo = await getInterviewInfo(interviewId);
        setInterviewType(interviewInfo.data.interviewType);

        // 인터뷰 타입이 'voice'인 경우 모달을 열기
        if (interviewInfo.data.interviewType === 'voice') {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error('인터뷰 정보를 가져오는 중 오류 발생:', error.message);
      }
    };

    if (interviewId) {
      fetchInterviewType();
    }
  }, [interviewId]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProceedToInterview = () => {
    setIsVoiceChecked(true);
    setIsModalOpen(false);
  };

  return (
    <PromptroomContainer>
      <InterviewInfoContainer>
        <InterviewInfo />
      </InterviewInfoContainer>
      <ChatContainer>
        {interviewId ? (
          <InterviewChat interviewId={interviewId} interviewType={interviewType} />
        ) : (
          <div>Loading...</div>
        )}
      </ChatContainer>
      <VoiceCheckModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProceed={handleProceedToInterview}
      />
    </PromptroomContainer>
  );
}

export default Promptroom;
