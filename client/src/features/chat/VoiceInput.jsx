import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

const VoiceInputContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${COLORS.blue_black};
  color: white;
  cursor: pointer;
`;

const VoiceInput = ({ handleSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ko-KR';

      recognitionInstance.onstart = () => setIsRecording(true);
      recognitionInstance.onend = () => setIsRecording(false);
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("This browser doesn't support the Web Speech API");
    }
  }, [handleSend]);

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
    }
  };

  return (
    <VoiceInputContainer>
      <Button onClick={startRecognition}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </Button>
    </VoiceInputContainer>
  );
};

export default VoiceInput;
