import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import ModalPortal from '../../ModalPortal';
import VoiceBlueIcon from '../../assets/icons/voice_blue.png';
import CloseIcon from '../../assets/icons/close_Icon.png';
import RoundButton from '../../components/button/RoundButton';
import { COLORS } from "../../styles/colors";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 32px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const CloseButton = styled.img`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const VoiceIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const waveEffect = (level) => keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(98, 174, 213, 0.7), 0 0 0 ${level * 0.3}px rgba(98, 174, 213, 0.5), 0 0 0 ${level * 0.6}px rgba(98, 174, 213, 0.3);
  }
  50% {
    box-shadow: 0 0 0 ${level * 0.3}px rgba(98, 174, 213, 0), 0 0 0 ${level * 0.6}px rgba(98, 174, 213, 0.3), 0 0 0 ${level * 0.9}px rgba(98, 174, 213, 0.1);
  }
  100% {
    box-shadow: 0 0 0 ${level * 0.6}px rgba(98, 174, 213, 0), 0 0 0 ${level * 0.9}px rgba(98, 174, 213, 0.1), 0 0 0 ${level * 1.2}px rgba(98, 174, 213, 0);
  }
`;

const AudioLevelIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 60px auto;
  ${({ level }) => level > 10 && css`
    animation: ${waveEffect(level)} 2s infinite;
  `}
`;

const VoiceCheckModal = ({ isOpen, onClose, onProceed }) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMicWorking, setIsMicWorking] = useState(false);

  useEffect(() => {
    let audioContext;
    let analyser;
    let microphone;
    let javascriptNode;

    if (isOpen) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);

          javascriptNode = audioContext.createScriptProcessor(256, 1, 1);
          javascriptNode.onaudioprocess = () => {
            analyser.getByteFrequencyData(dataArray);
            const maxLevel = Math.max(...dataArray);
            const normalizedLevel = (maxLevel / 255) * 100;
            setAudioLevel(normalizedLevel);

            if (normalizedLevel > 10) {
              setIsMicWorking(true);
            } else {
              setIsMicWorking(false);
            }
          };

          microphone.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);
        })
        .catch((error) => {
          console.error("마이크 접근 에러:", error);
        });

      return () => {
        if (javascriptNode) javascriptNode.disconnect();
        if (microphone) microphone.disconnect();
        if (analyser) analyser.disconnect();
        if (audioContext) audioContext.close();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <ModalOverlay>
        <ModalContent>
          <CloseButton src={CloseIcon} alt="Close" onClick={onClose} />
          <h2>음성 테스트</h2>
          <p>마이크가 작동하는지 확인하세요.</p>
          <AudioLevelIndicator level={audioLevel}>
            <VoiceIcon src={VoiceBlueIcon} alt="Voice Icon" />
          </AudioLevelIndicator>
          <RoundButton
            onClick={onProceed}
            color="#FFFFFF" // 흰색 글씨
            bgColor={COLORS.blue_black} // 배경색
            disabled={!isMicWorking}
          >
            인터뷰 시작
          </RoundButton>
        </ModalContent>
      </ModalOverlay>
    </ModalPortal>
  );
};

export default VoiceCheckModal;
