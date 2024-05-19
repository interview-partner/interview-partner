import React, { useState } from 'react';
import styled from 'styled-components';
import Chat from './chat';
import { COLORS } from '../../styles/colors';
import voiceIcon from '../../assets/icons/voice_Icon.png';
import headphoneIcon from '../../assets/icons/headphone_Icon.png';
import callEndIcon from '../../assets/icons/call_end_Icon.png';
import chatIcon from '../../assets/icons/chat_Icon.png';

const Container = styled.div`
  display: flex;
  height: 95%;
  background-color: #121212;
  box-sizing: border-box;
  justify-content: center;
`;

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 45%);
  grid-template-rows: repeat(2, auto);
  gap: 10px;
  transition: all 0.3s ease;
  width: ${({ isOpen }) => (isOpen ? '80%' : '70%')};
  justify-content: center;
  align-content: center;
`;

const VideoBox = styled.div`
  width: 100%;
  background-color: #333;
  position: relative;
  padding-top: 56.25%;
  height: 0;
  border-radius: 20px;
`;

const VideoContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ChatIcon = styled.div`
  position: fixed;
  bottom: 20px;
  right: 40px;
  width: 55px;
  height: 55px;
  background-color: black;
  background-image: url(${chatIcon});
  background-size: 55%;
  background-repeat: no-repeat;
  background-position: center;
  color: #fff;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;

const RoundButton = styled.button`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: ${COLORS.sky_blue};
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  border: none;
  outline: none;

  &:hover {
    background-color: rgba(118, 194, 233, 1);
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  width: 300px;
  display: flex;
  justify-content: space-between;
  bottom: 20px;
`;

const IconButton = styled(RoundButton)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconImage = styled.img`
  width: 60%;
`;

function Mockuproom() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, isUser: true }]);
      setInputValue('');
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <Container>
      <VideoContainer isOpen={isOpen}>
        {[...Array(4)].map((_, index) => (
          <VideoBox key={index}>
            <VideoContent />
          </VideoBox>
        ))}
      </VideoContainer>
      <ButtonContainer>
        <IconButton>
          <IconImage src={voiceIcon} alt="Voice Icon" />
        </IconButton>
        <IconButton>
          <IconImage src={headphoneIcon} alt="Headphone Icon" />
        </IconButton>
        <IconButton>
          <IconImage src={callEndIcon} alt="Call End Icon" />
        </IconButton>
      </ButtonContainer>
      {!isOpen && <ChatIcon onClick={toggleChat} />}
      <Chat
        isOpen={isOpen}
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        handleClose={handleCloseChat}
      />
    </Container>
  );
}

export default Mockuproom;
