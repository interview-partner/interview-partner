import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

const MessageContainer = styled.div`
    display: flex;
    justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
    margin: 10px;
`;

const MessageBubble = styled.div`
    max-width: 60%;
    padding: 10px;
    border-radius: 20px;
    background-color: ${(props) => (props.isUser ? COLORS.sky_blue : '#f1f0f0')};
    color: ${(props) => (props.isUser ? COLORS.user_message : COLORS.ai_message)};
    word-wrap: break-word;
`;

const AIDialogBox = ({ text, isUser }) => (
    <MessageContainer isUser={isUser}>
        <MessageBubble isUser={isUser}>{text}</MessageBubble>
    </MessageContainer>
);

export default AIDialogBox;

