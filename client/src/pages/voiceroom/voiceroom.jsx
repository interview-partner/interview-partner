import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import InterviewChat from "../../features/chat/interviewChat";
import InterviewInfo from "../../features/banner/interviewInfo";

const PromptroomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

function Voiceroom() {
  const { id } = useParams();
  const interviewId = parseInt(id, 10);

  return (
    <PromptroomContainer>
      <InterviewInfo />
      {interviewId ? <InterviewChat interviewId={interviewId} /> : <div>Loading...</div>}
    </PromptroomContainer>
  );
}

export default Voiceroom;