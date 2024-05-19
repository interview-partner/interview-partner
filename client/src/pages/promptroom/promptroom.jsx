import React from 'react';
import styled from 'styled-components';
import InterviewChat from "../../features/chat/interviewChat.jsx";

const PromptroomContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

function Promptroom() {
    return (
        <PromptroomContainer>
            <InterviewChat />
        </PromptroomContainer>
    );
}
  
export default Promptroom;