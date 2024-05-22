import React from 'react';
import styled from 'styled-components';
import InterviewChat from "../../features/chat/interviewChat.jsx";

const PromptroomContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #F9F9F9;
`;

function Promptroom() {
    return (
        <PromptroomContainer>
            <InterviewChat />
        </PromptroomContainer>
    );
}
  
export default Promptroom;