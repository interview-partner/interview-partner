import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getResumeInfo } from '../../services/getResumeInfoService';
import { saveAnswer } from '../../services/saveAnswerService';
import generateFollowUpQuestion from '../../services/followUpQuestionService';
import { getInterviewInfo } from '../../services/getInterviewInfoService';
import TextInput from '../chat/TextInput';
import VoiceInput from '../chat/VoiceInput';
import AIDialogBox from '../../components/textbox/aidialogBox.jsx';
import { useQuestionID } from '../../context/questionIDContext.js';

const ChatContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: white;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 80%;
  max-width: 900px;
  overflow: hidden;
  background-color: white;
`;

const MessagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const InterviewChat = ({ interviewId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [startMessageIndex, setStartMessageIndex] = useState(-1);
  const [messagesWithButtons, setMessagesWithButtons] = useState(new Set());
  const [followUpCreated, setFollowUpCreated] = useState({});
  const [interviewType, setInterviewType] = useState('');
  const { questionID, setQuestionID } = useQuestionID();
  const messagesEndRef = useRef(null);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false); 


  const messageRefs = useRef([]);

  useEffect(() => {
    console.log("Interview ID: ", interviewId);
    if (interviewId) {
      const fetchInterviewData = async () => {
        try {
          const interviewInfo = await getInterviewInfo(interviewId);
          setInterviewType(interviewInfo.data.interviewType);
          console.log("Interview Type:", interviewInfo.data.interviewType);

          const response = await getResumeInfo(interviewId);
          console.log("Fetched questions:", response.data);
          if (response && response.data) {
            setQuestions(response.data);

            if (interviewInfo.data.interviewType !== 'text') {
              setHasStarted(true);
              setStartMessageIndex(0);
              sendNextQuestion(response.data, 0);
            } else {
              setMessages([
                { text: "안녕하세요, AI 면접을 시작합니다.\n준비가 되셨다면 채팅창에 '시작'을 보내주세요 :)", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
              ]);
            }
          } else {
            throw new Error("No data received");
          }
        } catch (error) {
          console.error('질문을 가져오는 중 오류 발생:', error.message);
          setMessages(prevMessages => [
            ...prevMessages,
            { text: "질문 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
          ]);
        }
      };
      fetchInterviewData();
    } else {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "인터뷰 ID가 제공되지 않았습니다.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
      ]);
    }
  }, [interviewId]);

  useEffect(() => {
    
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

   
    const timeoutId = setTimeout(scrollToBottom, 100); 

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSend = async (transcript = null) => {
    const userInput = transcript || input.trim();

    if (typeof userInput !== 'string') {
      console.error('Invalid input: Expected a string but got', userInput);
      return;
    }

    if (userInput) {
      const userMessage = { text: userInput, isUser: true, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false };

      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.isFollowUp) {
        userMessage.isFollowUpNext = true;
      }

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');

      if (interviewType !== 'text' || hasStarted) {
       
        setInputDisabled(true);
      } else if (userInput.toLowerCase() === '시작') {
        
        setInputDisabled(true);
        setHasStarted(true);
        setStartMessageIndex(newMessages.length - 1);
        sendNextQuestion(questions, currentQuestionIndex);
      }

      if (hasStarted) {
        if (!transcript) {
          const currentQuestion = questions[currentQuestionIndex - 1];
          console.log('Current question ID:', currentQuestion.id);

          const audioPath = `audio/${userInput.replace(/\s+/g, '_').toLowerCase()}.mp3`;

          try {
            const response = await saveAnswer(currentQuestion.id, { content: userInput, audioPath: audioPath });
            console.log('Response from saveAnswer:', response);

            setMessagesWithButtons(prevState => new Set([...prevState, newMessages.length - 1]));
          } catch (error) {
            console.error('답변 저장 중 오류 발생:', error.message);
            setMessages(prevMessages => [
              ...prevMessages,
              { text: "답변을 저장하는 중 오류가 발생했습니다. 다시 시도해 주세요.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
            ]);
          }
        } else {
          setMessagesWithButtons(prevState => new Set([...prevState, newMessages.length - 1]));
        }
      }
    }
  };

  const sendNextQuestion = (questionsList = questions, index = currentQuestionIndex) => {
    if (index < questionsList.length) {
      const newMessage = { text: questionsList[index].content, isUser: false, number: index + 1, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessagesWithButtons(prevState => new Set([...prevState, messages.length]));
      setCurrentQuestionIndex(index + 1);

      setQuestionID(questionsList[index].id);
      setInputDisabled(false); 
    } else if (hasStarted) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "인터뷰가 종료되었습니다. 수고하셨습니다.", isUser: false, isFollowUp: false, isFollowUpResponse: false, isFollowUpNext: false }
      ]);
      setHasStarted(false);
      setInterviewEnded(true); 
      setInputDisabled(true); 
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
        setInputDisabled(false); 
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
            <div ref={(el) => (messageRefs.current[index] = el)} key={index}>
              <AIDialogBox
                text={typeof message.text === 'string' ? message.text : "Invalid content"}
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
                interviewType={interviewType}
              />
            </div>
          ))}
          <div ref={messagesEndRef} style={{ height: '100px' }} /> {/* 스크롤을 참조하고 여유 높이를 추가 */}
        </MessagesContainer>
        {interviewType === 'text' ? (
          <TextInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            disabled={interviewEnded || (inputDisabled && input.toLowerCase() !== "시작")} // "시작"을 보내기 전까지는 여러 메시지 허용
          />
        ) : (
          <VoiceInput
            handleSend={handleSend}
            questionID={questionID}
            disabled={interviewEnded || inputDisabled} // 인터뷰 종료 또는 질문 응답 후 비활성화
          />
        )}
      </InnerContainer>
    </ChatContainer>
  );
};

export default InterviewChat;
