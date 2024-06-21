import React from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS } from "../../styles/colors";
import ModalPortal from '../../ModalPortal';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

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
  display: flex;
  flex-direction: column;
  background: white;
  padding: 56px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  justify-content: center; /* 중앙 정렬을 위해 추가 */
  align-items: center; /* 중앙 정렬을 위해 추가 */
`;

const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 50px; /* 원이 더 작아지도록 크기 조정 */
  height: 50px;
  margin-bottom: 20px;
  animation: ${spin} 1.5s linear infinite;
`;

const Circle = styled.div`
  width: 10px; /* 원의 크기를 줄임 */
  height: 10px;
  background-color: #62aed5; /* 지정된 파란색 */
  border-radius: 50%;
  position: absolute;
`;

const Circle1 = styled(Circle)`
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const Circle2 = styled(Circle)`
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

const Circle3 = styled(Circle)`
  top: 50%;
  right: 0;
  transform: translateY(-50%);
`;

const Circle4 = styled(Circle)`
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: ${COLORS.font_black};
`;

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <ModalOverlay>
        <ModalContent>
          <CircleContainer>
            <Circle1 />
            <Circle2 />
            <Circle3 />
            <Circle4 />
          </CircleContainer>
          <LoadingText>방을 생성하는 중입니다...</LoadingText>
        </ModalContent>
      </ModalOverlay>
    </ModalPortal>
  );
};

export default LoadingModal;
