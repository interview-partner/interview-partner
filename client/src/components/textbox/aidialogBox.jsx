import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import QuestionNumber from '../../components/shape/QuestionNumber';

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
    margin: 10px;
    gap: 8px;
`;

const MessageBubble = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 60%;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 30px;
    padding-left: 30px;
    border-radius: 0px 10px 10px 10px;
    border-radius: ${(props) => (props.isUser ? '30px 30px 0px 30px' : '0px 30px 30px 30px')};
    background-color: ${(props) => (props.isUser ? 'rgba(98, 174, 213, 0.25)' : '#f1f0f0')};
    color: ${(props) => (props.isUser ? '#096AC3' : '#262627')};
    word-wrap: break-word;
`;

const AIDialogBox = ({ text, isUser }) => (
    <MessageContainer isUser={isUser}>
        <QuestionNumber number={1} />
        <MessageBubble isUser={isUser}>{text}</MessageBubble>
    </MessageContainer>
);

export default AIDialogBox;

