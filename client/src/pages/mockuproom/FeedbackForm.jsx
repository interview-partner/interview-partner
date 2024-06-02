import React from 'react';
import styled, { keyframes, css } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
`;

const FeedbackContainer = styled.div`
animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background: #3a3a3a;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
`;

const FeedbackTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
  border-bottom: 2px solid #444;
  padding-bottom: 10px;
`;

const FeedbackInput = styled.textarea`
  background: #444;
  font-size: 25px;
  line-height: 30px;
  border: none;
  border-radius: 10px;
  outline: none;
  color: #fff;
  padding: 10px;
  width: 100%;
  height: 95%;
  resize: none;
  overflow: auto;
  margin-top: 10px;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FeedbackButton = styled.button`
  background-color: rgba(98, 174, 213, 0.47);
  border: none;
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-size: 18px;
  color: #fff;

  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(98, 174, 213, 0.6);
  }
`;

const FeedbackForm = ({ nickname, feedbackContent, setFeedbackContent, onSendFeedback, isVisible }) => {

    return (
        <FeedbackContainer isVisible={isVisible}>
            <FeedbackTitle>{nickname}님에게 피드백 남기기</FeedbackTitle>
            <FeedbackInput
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                placeholder="동일한 참가자에게 피드백은 한번만 보낼 수 있습니다!"
            />
            <FeedbackButton onClick={onSendFeedback}>
                피드백 전송
            </FeedbackButton>
        </FeedbackContainer>
    );
};

export default FeedbackForm;
