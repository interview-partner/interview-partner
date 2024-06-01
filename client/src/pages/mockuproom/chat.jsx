import React, { useRef, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 고유 ID 생성을 위한 라이브러리
import send_Icon from '../../assets/icons/send_Icon.png';
import article_Icon from '../../assets/icons/article_Icon.png';
import userImageTest1 from '../../assets/images/userImage/userImage2.png';
import chevron_right_Icon from '../../assets/icons/chevron_right_Icon.png';
import rate_review_Icon from '../../assets/icons/rate_review_Icon.png';
import ResumeViewer from './ResumeViewer';
import { ChatContainer, ChatCloseButton, Input, SendButton, UserList, User, Avatar, UserName, UserOptionButton, ChatBox, MessageContainer, InputContainer, MessageList, Message, UserButtonContainer } from './chatstyle';

const Chat = ({ isOpen, handleClose, session, users = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentView, setCurrentView] = useState('chat'); // State to manage current view
  const [selectedUserResume, setSelectedUserResume] = useState(null); // State to manage selected user resume
  const [selectedUserFeedback, setSelectedUserFeedback] = useState(null); // State to manage selected user feedback
  const messageListRef = useRef(null);
  const messageIds = useRef(new Set()); // 이미 처리된 메시지 ID를 저장하는 Set
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [activeUserId, setActiveUserId] = useState(null); // 사용자(참여자)ID 관리용, roomParticipantId 예: 버튼클릭시 해당 사용의 이력서 제공

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() !== '') {
      const myUserName = "MyNickname"; // 닉네임 설정
      const messageId = uuidv4(); // 고유 ID 생성
      const messageData = {
        user: myUserName,
        text: inputValue,
        id: messageId, // 메시지에 ID 추가
      };

      // 세션을 통해 메시지 전송
      session.signal({
        data: JSON.stringify(messageData),
        to: [],
        type: 'chat',
      });

      // 로컬 상태 업데이트
      setMessages([...messages, { text: inputValue, isUser: true, user: myUserName, id: messageId }]);
      messageIds.current.add(messageId); // 전송된 메시지 ID 저장
      setInputValue('');
    }
  }, [inputValue, messages, session]);

  useEffect(() => {
    if (session) {
      session.on('signal:chat', (event) => {
        const messageData = JSON.parse(event.data);
        if (!messageIds.current.has(messageData.id)) {
          setMessages((prevMessages) => [...prevMessages, { text: messageData.text, isUser: false, user: messageData.user, id: messageData.id }]);
          messageIds.current.add(messageData.id); // 수신된 메시지 ID 저장
        }
      });
    }
  }, [session]);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      if (isAutoScroll) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }
  }, [messages, isAutoScroll]);

  const handleScroll = () => {
    const messageList = messageListRef.current;
    if (messageList) {
      const isScrolledToBottom = messageList.scrollHeight - messageList.clientHeight <= messageList.scrollTop + 1;
      setIsAutoScroll(isScrolledToBottom);
    }
  };

  const handleUserResumeClick = (parsedData) => {
    if (currentView === 'resume' && activeUserId === parsedData[1].roomParticipantId) {
      setCurrentView('chat');
      setSelectedUserResume(null);
      setActiveUserId(null);
    } else {
      setCurrentView('resume');
      setSelectedUserResume(parsedData);
      setActiveUserId(parsedData[1].roomParticipantId);
    }
  };

  const handleUserFeedbackClick = (parsedData) => {
    if (currentView === 'feedback' && activeUserId === parsedData[1].roomParticipantId) {
      setCurrentView('chat');
      setSelectedUserFeedback(null);
      setActiveUserId(null);
    } else {
      setSelectedUserFeedback(parsedData);
      setCurrentView('feedback');
      setActiveUserId(parsedData[1].roomParticipantId);
    }
  };

  useEffect(() => {
    if (currentView === 'resume' && selectedUserResume) {
      console.log("이력서가 로드되었습니다:", selectedUserResume[1]?.resumeUrl);
    }
  }, [currentView, selectedUserResume]);

  return (
    <ChatContainer isOpen={isOpen}>
      <ChatCloseButton onClick={handleClose}>
        <img src={chevron_right_Icon} alt="Close Chat" />
      </ChatCloseButton>
      <UserList>
        {users.map(user => {
          let parsedData = [{ nickname: "Unknown User" }];
          try {
            const parts = user.data.split('%/%');
            parsedData = parts.map(part => JSON.parse(part));
          } catch (error) {
            console.error("JSON parsing error for user.data:", user.data, error);
          }

          return (
            <User key={user.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar src={userImageTest1} alt="User Avatar" />
                <UserName>{parsedData[1]?.nickname || "Unknown User"}</UserName>
              </div>
              <UserButtonContainer>
                <UserOptionButton
                  onClick={() => handleUserFeedbackClick(parsedData)}
                  isActive={currentView === 'feedback' && activeUserId === parsedData[1].roomParticipantId}
                >
                  <img src={rate_review_Icon} alt="User Feedback" />
                </UserOptionButton>

                <UserOptionButton
                  onClick={() => handleUserResumeClick(parsedData)}
                  isActive={currentView === 'resume' && activeUserId === parsedData[1].roomParticipantId}
                >
                  <img src={article_Icon} alt="User Resume" />
                </UserOptionButton>
              </UserButtonContainer>
            </User>
          );
        })}
      </UserList>

      <ChatBox>
        <MessageContainer>
          {(() => {
            switch (currentView) {
              case 'chat':
                return (
                  <MessageList ref={messageListRef} onScroll={handleScroll}>
                    {messages.map((message, index) => (
                      <Message key={index} isUser={message.isUser}>
                        {message.text}
                      </Message>
                    ))}
                  </MessageList>
                );
              case 'resume':
                return <ResumeViewer resumeUrl={selectedUserResume[1]?.resumeUrl} />;
              case 'feedback':
                return (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h2>{selectedUserFeedback[1]?.nickname}'s Feedback</h2>
                      <p>Feedback about the user...</p>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </MessageContainer>
        {currentView === 'chat' && (
          <InputContainer>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <SendButton onClick={handleSendMessage}>
              <img src={send_Icon} alt="Send" />
            </SendButton>
          </InputContainer>
        )}
      </ChatBox>
    </ChatContainer >
  );
};

export default Chat;
