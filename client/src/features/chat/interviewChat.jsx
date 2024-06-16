import React, { useState, useEffect } from 'react';
import { COLORS } from "../../styles/colors";
import AIDialogBox from '../../components/textbox/aidialogBox.jsx';
import styled from 'styled-components';
import { getInterviewInfo } from '../../services/getInterviewInfoService'; // getInterviewInfo 사용
import { saveAnswer } from '../../services/saveAnswerService';
import generateFollowUpQuestion from '../../services/followUpQuestionService';
import TextInput from '../chat/TextInput.jsx';
import VoiceInput from '../chat/VoiceInput.jsx'; 

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

const InterviewChat = ({ interviewId }) => {
  const [messages, setMessages] = useState([
    { text: "안녕하세요, AI 면접을 시작합니다.\n준비가 되셨다면 채팅창에 '시작' 을 보내주세요 :)", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
  ]);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [interviewType, setInterviewType] = useState(''); // interviewType 초기화
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [startMessageIndex, setStartMessageIndex] = useState(-1);
  const [messagesWithButtons, setMessagesWithButtons] = useState(new Set());
  const [followUpCreated, setFollowUpCreated] = useState({});

  useEffect(() => {
    console.log("Interview ID: ", interviewId);
    if (interviewId) {
      const fetchInterviewInfo = async () => {
        try {
          const response = await getInterviewInfo(interviewId);
          console.log("Fetched interview info:", response.data);
          if (response && response.data) {
            setInterviewType(response.data.interviewType || ''); // interviewType 설정
            setQuestions(response.data.questions || []); // 질문을 설정합니다.
          } else {
            throw new Error("No data received");
          }
        } catch (error) {
          console.error('인터뷰 정보를 가져오는 중 오류 발생:', error.message);
          setMessages(prevMessages => [
            ...prevMessages,
            { text: "인터뷰 정보를 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
          ]);
        }
      };
      fetchInterviewInfo();
    } else {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "인터뷰 ID가 제공되지 않았습니다.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
      ]);
    }
  }, [interviewId]);

  const handleSend = async (text) => {
    const message = text || input; // VoiceInput에서 텍스트를 전달받을 수 있도록 수정
    if (message.trim()) {
      const userMessage = { text: message, isUser: true, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false };

      // 체크 후 꼬리질문 이후의 메시지인지 설정
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.isFollowUp) {
        userMessage.isFollowUpNext = true;
      }

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');

      if (hasStarted) {
        const currentQuestion = questions[currentQuestionIndex - 1];
        console.log('Current question ID:', currentQuestion?.id);

        try {
          const response = await saveAnswer(currentQuestion.id, { content: message });
          console.log('Response from saveAnswer:', response);

          setMessagesWithButtons(prevState => new Set([...prevState, newMessages.length - 1]));
        } catch (error) {
          console.error('답변 저장 중 오류 발생:', error.message);
          setMessages(prevMessages => [
            ...prevMessages,
            { text: "답변을 저장하는 중 오류가 발생했습니다. 다시 시도해 주세요.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
          ]);
        }
      } else if (message.trim() === "시작" && !hasStarted) {
        setHasStarted(true);
        setStartMessageIndex(newMessages.length - 1);
        sendNextQuestion();
      }
    }
  };

  const sendNextQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      const newMessage = { text: questions[currentQuestionIndex].content, isUser: false, number: currentQuestionIndex + 1, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessagesWithButtons(prevState => new Set([...prevState, messages.length]));
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (hasStarted) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "인터뷰가 종료되었습니다. 수고하셨습니다.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
      ]);
      setHasStarted(false);
    }
  };

  const handleButtonClick = (index) => {
    setFollowUpCreated(prevState => ({ ...prevState, [index]: true })); 
  };

  const handleFollowUpQuestionClick = async (index) => {
    try {
      const currentQuestion = questions[currentQuestionIndex - 1];
      const followUpResponse = await generateFollowUpQuestion(currentQuestion.id);
      console.log('Generated follow-up question:', followUpResponse);

      if (followUpResponse.data && followUpResponse.data.content) {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: followUpResponse.data.content, isUser: false, number: currentQuestionIndex + 1, isFollowUp: true, isFollowUpResponse: false, isFollowUpNext: false }
        ]);
      }
      handleButtonClick(index);

    } catch (error) {
      console.error('꼬리질문 생성 중 오류 발생:', error.message);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "꼬리질문을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
      ]);
    }
  };

  const handleFollowUpResponse = (index) => {
    setMessages(prevMessages =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, isFollowUpResponse: true } : msg
      )
    );

    sendNextQuestion();
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
              started={hasStarted} 
              renderButtons={hasStarted && messagesWithButtons.has(index) && index > startMessageIndex && !followUpCreated[index]}
              onFollowUpQuestionClick={() => handleFollowUpQuestionClick(index)} 
              onNextQuestionClick={() => {
                if (messages[index].isFollowUp) {
                  handleFollowUpResponse(index); 
                } else {
                  sendNextQuestion();
                  handleButtonClick(index); 
                }
              }} 
              followUpCreated={followUpCreated[index]} 
              isFollowUp={message.isFollowUp} 
              isFollowUpResponse={message.isFollowUpResponse} 
              isFollowUpNext={message.isFollowUpNext} 
            />
          ))}
        </MessagesContainer>
        {interviewType.toLowerCase() === 'text' ? ( // interviewType을 소문자로 변환하여 비교
          <TextInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
          />
        ) : (
          <VoiceInput
            handleSend={handleSend}
          />
        )}
      </InnerContainer>
    </ChatContainer>
  );
};

export default InterviewChat;
