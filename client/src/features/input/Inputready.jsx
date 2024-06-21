import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import Circle from "../../assets/icons/circle.png";
import CheckMethod from "../../assets/images/checkMethodType.png";
import BigSquareButton from "../../components/button/bigsquareButton";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
  color: ${COLORS.font_black};
  font-size: 20px;
  margin-bottom: 5px;
`;

const GuideText = styled.div`
  display: flex;
  color: ${COLORS.gray};
  font-size: 16px;
  margin-bottom: 40px;
`;

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${COLORS.font_black};
  margin-bottom: 12px;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

const Img = styled.img`
  width: 228px;
  height: 133px;
`;

function InputReady({ onStartInterview, currentIndex }) {
  const handleStartClick = async () => {
    if (onStartInterview) {
      await onStartInterview(); // Pass setIsOpen to handleCreateInterview
    }
  };

  return (
    <Container>
      <Title>면접 준비</Title>
      <TextContainer>
        <Img src={CheckMethod} alt="CheckMethod" />
        <GuideText>면접 방식을 한번 더 확인해 주세요</GuideText>
        <GuideContainer>
          <GuideList>
            <Icon src={Circle} alt="Circle" />
            선택한 면접 방식에 따라 주어진 질문에 음성/텍스트로 답변합니다
          </GuideList>
          <GuideList>
            <Icon src={Circle} alt="Circle" />
            각 질문에 대한 답변이 이루어진 후, 다음질문/꼬리질문을 설정할 수 있습니다
          </GuideList>
          <GuideList>
            <Icon src={Circle} alt="Circle" />
            각 면접 기록은 마이페이지에서 확인할 수 있습니다
          </GuideList>
        </GuideContainer>
        <BigSquareButton 
          onClick={handleStartClick} 
          disabled={currentIndex !== 3}
        >
          면접 시작하기
        </BigSquareButton>
      </TextContainer>
    </Container>
  );
}

export default InputReady;
