import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../styles/colors';
import { transcribeAudio } from '../../services/transcribeAudioService';
import { saveAnswer } from '../../services/saveAnswerService'; // 추가된 부분

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

const VoiceInput = ({ handleSend, questionID }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('This browser does not support audio recording');
      setErrorMessage('This browser does not support audio recording');
    }
  }, []);

  const startRecording = async () => {
    console.log('Starting recording...');
    setErrorMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
        console.log('Audio chunk received:', event.data);
      };

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped.');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = await convertToWav(audioBlob, 16000);
        console.log('Audio file created:', audioFile);
        
        try {
          const transcript = await transcribeAudio(questionID, audioFile);
          console.log('Transcription response:', transcript);

          const audioPath = `audio/${transcript.replace(/\s+/g, '_').toLowerCase()}.mp3`;

          // 변환된 텍스트와 오디오 파일 경로를 saveAnswer를 통해 저장
          await saveAnswer(questionID, {
            content: transcript,
            audioPath: audioPath,
          });

          // 변환된 텍스트를 handleSend로 전달
          handleSend(transcript);
        } catch (error) {
          console.error('Error during STT or saving answer:', error.message);
          setErrorMessage('Error during STT or saving answer: ' + error.message);
        }
      };

      mediaRecorder.start();
      console.log('MediaRecorder started.');
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing media devices.', error);
      setErrorMessage('Error accessing media devices: ' + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log('MediaRecorder stopped.');
      setIsRecording(false);
    }
  };

  const convertToWav = async (blob, sampleRate) => {
    console.log('Converting to WAV...');
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log('Decoded audio data:', audioBuffer);

      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.duration * sampleRate,
        sampleRate
      );

      const cloneBuffer = offlineContext.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        cloneBuffer.copyToChannel(audioBuffer.getChannelData(channel), channel);
      }

      const source = offlineContext.createBufferSource();
      source.buffer = cloneBuffer;
      source.connect(offlineContext.destination);
      source.start(0);

      const renderedBuffer = await offlineContext.startRendering();
      console.log('Rendered buffer:', renderedBuffer);
      const wavBuffer = encodeWav(renderedBuffer, sampleRate);

      return new File([wavBuffer], 'recording.wav', { type: 'audio/wav' });
    } catch (error) {
      console.error('Error converting to WAV:', error);
      setErrorMessage('Error converting to WAV: ' + error.message);
    }
  };

  const encodeWav = (audioBuffer, sampleRate) => {
    const numOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChannels * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioBuffer.length * numOfChannels * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, numOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, audioBuffer.length * numOfChannels * 2, true);

    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, intSample < 0 ? intSample * 0x8000 : intSample * 0x7FFF, true);
        offset += 2;
      }
    }

    console.log('Encoded WAV buffer:', buffer);
    return buffer;
  };

  return (
    <VoiceInputContainer>
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </VoiceInputContainer>
  );
};

export default VoiceInput;
