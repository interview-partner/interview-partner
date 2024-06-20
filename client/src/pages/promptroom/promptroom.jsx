import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import InterviewChat from "../../features/chat/interviewChat";
import InterviewInfo from "../../features/banner/interviewInfo";

const PromptroomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: hidden; /* 전체 화면에서 스크롤을 감춤 */
`;

const InterviewInfoContainer = styled.div`
  width: 100%;
  z-index: 1; /* InterviewInfo를 고정된 위치에 표시 */
`;

const ChatContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-y: auto; /* Chat 컨텐츠가 길어질 경우 스크롤을 허용 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
  -ms-overflow-style: none;  /* Internet Explorer 10+에서 스크롤바 숨기기 */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera에서 스크롤바 숨기기 */
  }
`;

function Promptroom() {
  const { id } = useParams();
  const interviewId = parseInt(id, 10);

  return (
    <PromptroomContainer>
      <InterviewInfoContainer>
        <InterviewInfo />
      </InterviewInfoContainer>
      <ChatContainer>
        {interviewId ? <InterviewChat interviewId={interviewId} /> : <div>Loading...</div>}
      </ChatContainer>
    </PromptroomContainer>
  );
}

export default Promptroom;
