import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import QuestionNumber from '../../components/shape/QuestionNumber';
import ArrowBlue from '../../assets/icons/arrow_blue.png';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')}; 
    margin: 10px;
    gap: 8px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
`

const MessageBubble = styled.div`
    display: flex;
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

const AIDialogBox = ({ text, isUser, number, index }) => (
    <Container isUser={isUser}>
        {!isUser && index > 0 && text !== "인터뷰가 종료되었습니다. 수고하셨습니다." && (
            <QuestionNumber number={number} />
        )}
        <MessageBubble isUser={isUser}>
            {text}
        </MessageBubble>
    </Container>
);

export default AIDialogBox;
