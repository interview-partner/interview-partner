import React from 'react';
import styled from 'styled-components';
import InterviewChat from "../../features/chat/interviewChat.jsx";
import InterviewInfo from "../../features/banner/interviewInfo.jsx";

const PromptroomContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

function Promptroom() {
    return (
        <PromptroomContainer>
            <InterviewInfo />
            <InterviewChat />
        </PromptroomContainer>
    );
}
  
export default Promptroom;