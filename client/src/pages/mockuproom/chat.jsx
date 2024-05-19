import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import userImage1 from '../../assets/images/userImage/userImage1.png';
import userImage2 from '../../assets/images/userImage/userImage2.png';
import userImage3 from '../../assets/images/userImage/userImage3.png';
import send_Icon from '../../assets/icons/send_Icon.png';
import article_Icon from '../../assets/icons/article_Icon.png';
import keyboard_arrow_down_Icon from '../../assets/icons/keyboard_arrow_down_Icon.png';

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

const ChatContainer = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  height: 95%;
  background-color: #2c2c2c;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  right: 0;
  bottom: 0;
  width: 28%;
  z-index: 1000;
  animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.3s ease;
`;

const UserList = styled.div`
  background-color: #3a3a3a;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #454545;
  border-radius: 10px;
  justify-content: space-between;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const UserName = styled.span`
  color: #fff;
  font-size: 16px;
`;

const UserResumeButton = styled.button`
  background-color: rgba(255, 255, 255, 0.13);
  border: none;
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
  }

  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const ChatBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #2c2c2c;
  border-radius: 10px;
  margin-top: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChatCloseButton = styled.button`
  align-self: flex-start;
  height: 40px;
  width: 40px;
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: white;

  img {
    height: 30px;
    width: 30px;
  }
`;

const MessageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: #444;
  border-radius: 20px;
`;

const MessageList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: #444;
  border-radius: 20px;
  overflow: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(245, 245, 245, 0.23);
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  color: #fff;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background: #333;
  border-radius: 20px;
`;

const Input = styled.textarea`
  background: #333;
  font-size: 20px;
  line-height: 20px;
  border: none;
  outline: none;
  color: #fff;
  padding: 10px;
  width: 100%;
  height: 30px;
  resize: none;
  overflow: auto;
  min-height: 30px;
  max-height: 150px;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SendButton = styled.button`
  background-color: rgba(98, 174, 213, 0.47);
  border: none;
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  margin-right: 5px;
  margin-bottom: 5px;
  justify-content: center;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
  }

  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(98, 174, 213, 0.6);
  }
`;

const Chat = ({ isOpen, messages, inputValue, setInputValue, handleSendMessage, handleClose }) => {
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ChatContainer isOpen={isOpen}>
      <ChatCloseButton onClick={handleClose}>
        <img src={keyboard_arrow_down_Icon} alt="Close Chat" />
      </ChatCloseButton>
      <UserList>
        <User>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar src={userImage2} alt="User Avatar" />
            <UserName>호랑이</UserName>
          </div>
          <UserResumeButton>
            <img src={article_Icon} alt="User Resume" />
          </UserResumeButton>
        </User>
        <User>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar src={userImage3} alt="User Avatar" />
            <UserName>흰둥이</UserName>
          </div>
          <UserResumeButton>
            <img src={article_Icon} alt="User Resume" />
          </UserResumeButton>
        </User>
        <User>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar src={userImage1} alt="User Avatar" />
            <UserName>햄스터</UserName>
          </div>
          <UserResumeButton>
            <img src={article_Icon} alt="User Resume" />
          </UserResumeButton>
        </User>
      </UserList>
      <ChatBox>
        <MessageContainer>
          <MessageList ref={messageListRef}>
            {messages.map((message, index) => (
              <Message key={index} isUser={message.isUser}>
                {message.text}
              </Message>
            ))}
          </MessageList>
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
        </MessageContainer>
      </ChatBox>
    </ChatContainer>
  );
};

export default Chat;
