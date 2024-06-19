import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import QuestionNumber from '../../components/shape/QuestionNumber';
import RoundButton from "../button/RoundButton";
import ArrowBlue from '../../assets/icons/arrow_blue.png';
import FollowUpQuestion from '../../components/shape/FollowUpQuestion';

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
`;

const MessageBubble = styled.div`
    display: flex;
    max-width: 60%;
    padding: 10px 30px;
    border-radius: ${(props) => (props.isUser ? '30px 30px 0px 30px' : '0px 30px 30px 30px')};
    background-color: ${(props) => (props.isUser ? 'rgba(98, 174, 213, 0.25)' : '#f1f0f0')};
    color: ${(props) => (props.isUser ? '#096AC3' : '#262627')};
    word-wrap: break-word;
`;

const AIDialogBox = ({ 
    text, 
    isUser, 
    number, 
    index, 
    started, 
    renderButtons, 
    onFollowUpQuestionClick, 
    onNextQuestionClick, 
    followUpCreated, 
    isFollowUp, 
    isFollowUpResponse, 
    isFollowUpNext,
    interviewType // interviewType을 받음
}) => {
    return (
        <Container isUser={isUser}>
            {!isUser && text !== "인터뷰가 종료되었습니다. 수고하셨습니다." && (
                // interviewType에 따라 조건 적용
                interviewType === 'text' ? (
                    index > 0 && (isFollowUp ? <FollowUpQuestion /> : <QuestionNumber number={number} />)
                ) : (
                    index >= 0 && (isFollowUp ? <FollowUpQuestion /> : <QuestionNumber number={number} />)
                )
            )}
            <MessageBubble isUser={isUser}>
                {text}
            </MessageBubble>
            {isUser && started && renderButtons && (
                <ButtonContainer>
                    {!isFollowUp && !isFollowUpNext && ( 
                      <RoundButton
                        color={COLORS.font_black}
                        bgColor="white"
                        borderColor={COLORS.light_gray}
                        padding="6px 12px"
                        onClick={onFollowUpQuestionClick}
                      >
                        꼬리 질문
                      </RoundButton>
                    )}
                    <RoundButton
                        iconSrc={ArrowBlue}
                        color={COLORS.font_black}
                        bgColor="white"
                        borderColor={COLORS.light_gray}
                        padding="6px 12px"
                        onClick={onNextQuestionClick}
                    >
                        다음 질문
                    </RoundButton>
                </ButtonContainer>
            )}
        </Container>
    );
};

export default AIDialogBox;
