import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { transcribeAudio } from '../../services/transcribeAudioService';
import SendBlueIcon from '../../assets/icons/send_blue.png'; // send_blue 아이콘 경로
import VoiceBlueIcon from '../../assets/icons/voice_blue.png'; // voice_blue 아이콘 경로

const VoiceInputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 20px;
`;

const Button = styled.button`
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  z-index: 2;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  background-image: url(${props => props.isRecording ? SendBlueIcon : VoiceBlueIcon});
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: scale(0.95);
  }
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const VoiceInput = ({ handleSend, questionID }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('This browser does not support audio recording');
      setErrorMessage('This browser does not support audio recording');
    }
    drawStaticLine();
  }, []);

  useEffect(() => {
    if (isRecording) {
      startWaveAnimation();
    } else {
      stopWaveAnimation(); // 녹음이 멈추면 애니메이션도 멈추고 일직선으로 돌아가도록 함
    }
  }, [isRecording]);

  const startRecording = async () => {
    console.log('Starting recording...');
    setErrorMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

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
          handleSend(transcript);
        } catch (error) {
          console.error('Error during STT:', error.message);
          setErrorMessage('Error during STT: ' + error.message);
        }

        audioContext.close();
        stopWaveAnimation(); // 녹음 중지 후 애니메이션 멈춤
        setIsRecording(false); // 녹음 중지 후 아이콘 변경을 위해 상태 업데이트
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

  const drawStaticLine = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, height / 2, width, height / 2);
    gradient.addColorStop(0, 'rgba(98, 174, 213, 0)');
    gradient.addColorStop(0.5, 'rgba(98, 174, 213, 1)');
    gradient.addColorStop(1, 'rgba(98, 174, 213, 0)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  const startWaveAnimation = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const numberOfWaves = 3;
    let phase = 0;
    const speed = 0.005;

    const drawWave = () => {
      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
      }

      for (let i = 0; i < numberOfWaves; i++) {
        ctx.beginPath();

        const lineGradient = ctx.createLinearGradient(0, height / 2, width, height / 2);
        lineGradient.addColorStop(0, 'rgba(98, 174, 213, 0)');
        lineGradient.addColorStop(0.5, `rgba(98, 174, 213, ${0.8 - i * 0.3})`);
        lineGradient.addColorStop(1, 'rgba(98, 174, 213, 0)');

        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 1;
        let x = 0;
        const amplitude = 20 + i * 10;
        const frequency = 0.005;

        while (x < width) {
          let y = height / 2;

          if (isRecording && dataArrayRef.current) {
            const sampleAmplitude = (dataArrayRef.current[x % dataArrayRef.current.length] - 128) / 128;
            y += sampleAmplitude * amplitude;
          } else {
            y += Math.sin(x * frequency + phase) * amplitude;
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x++;
        }

        ctx.stroke();
      }

      phase += speed;

      animationFrameIdRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();
  };

  const stopWaveAnimation = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    drawStaticLine();
  };

  return (
    <VoiceInputContainer>
      <Button onClick={isRecording ? stopRecording : startRecording} isRecording={isRecording}>
        {/* 텍스트 제거, 아이콘으로 대체 */}
      </Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Canvas ref={canvasRef} width={500} height={100} />
    </VoiceInputContainer>
  );
};

export default VoiceInput;
