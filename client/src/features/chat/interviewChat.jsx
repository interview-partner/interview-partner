import React, { useState, useEffect } from 'react';
import { COLORS } from "../../styles/colors";
import AIDialogBox from '../../components/textbox/aidialogBox.jsx';
import styled from 'styled-components';
import { getResumeInfo } from '../../services/getResumeInfoService';

const ChatContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 62.5%;
  background-color: white;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 80%;
  overflow: hidden;
  background-color: white;
`;

const MessagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  display: flex;
  margin-right: 80px;
  margin-left: 80px;
  gap: 4px;
  padding: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 2px solid #D9D9D9;
  border-radius: 10px;
`;

const Button = styled.button`
  display: flex;
  margin-left: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${COLORS.blue_black};
  color: white;
  cursor: pointer;
`;

const InterviewChat = ({ interviewId }) => {
  const [messages, setMessages] = useState([
    { text: "안녕하세요, AI 면접을 시작합니다.\n준비가 되셨다면 채팅창에 '시작' 을 보내주세요 :)", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [aiMessageCount, setAiMessageCount] = useState(1); 

  useEffect(() => {
    console.log("Interview ID: ", interviewId); 
    if (interviewId) {
      const fetchQuestions = async () => {
        try {
          const response = await getResumeInfo(interviewId);
          if (response && response.data) {
            setQuestions(response.data);
          } else {
            throw new Error("No data received");
          }
        } catch (error) {
          console.error('질문을 가져오는 중 오류 발생:', error.message);
          setMessages(prevMessages => [
            ...prevMessages,
            { text: "질문 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요.", isUser: false }
          ]);
        }
      };
      fetchQuestions();
    } else {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "인터뷰 ID가 제공되지 않았습니다.", isUser: false }
      ]);
    }
  }, [interviewId]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, isUser: true }];
      setMessages(newMessages);
      setInput('');

      setTimeout(() => {
        if (input.trim() === "시작" && !hasStarted) {
          setHasStarted(true);
          sendNextQuestion();
        } else if (hasStarted) {
          sendNextQuestion();
        }
      }, 1000);
    }
  };

  const sendNextQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: questions[currentQuestionIndex].content, isUser: false, number: aiMessageCount } 
      ]);
      setAiMessageCount(aiMessageCount + 1); 
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (hasStarted) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "인터뷰가 종료되었습니다. 수고하셨습니다.", isUser: false }
      ]);
      setHasStarted(false); 
    }
  };

  return (
    <ChatContainer>
      <InnerContainer>
        <MessagesContainer>
          {messages.map((message, index) => (
            <AIDialogBox 
              key={index} 
              text={message.text} 
              isUser={message.isUser} 
              number={message.isUser ? null : message.number} 
              index={index} 
            />
          ))}
        </MessagesContainer>
        <InputContainer>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <Button onClick={handleSend}>
            <span className="material-symbols-outlined">
              send
            </span>
          </Button>
        </InputContainer>
      </InnerContainer>
    </ChatContainer>
  );
};

export default InterviewChat;
