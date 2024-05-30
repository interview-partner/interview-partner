import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import SmallsquareButton from '../../components/button/smallsquareButton';
import CounterButton from '../../components/button/counterButton'; 
import CounterOne from "../../assets/icons/counter_1.png";
import CounterTwo from "../../assets/icons/counter_2.png";
import CounterThree from "../../assets/icons/counter_3.png";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const Title = styled.div`
  display: flex;
  color: ${COLORS.font_black};
  font-size: 20px;
`;

const SettingContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
`;

const SemiTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: ${COLORS.font_black};
  font-size: 14px;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px; 
`;

function InputInterviewSetting() {
  const [activeButton, setActiveButton] = useState(''); // 'voice' or 'text'

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  return (
    <Container>
      <Title>
        면접 설정
      </Title>
      <SettingContainer>
        <SemiTitle>
          <Icon src={CounterOne} alt="Counter One" />
          면접 이름 설정
        </SemiTitle>
        <Input />
      </SettingContainer>
      <SettingContainer>
        <SemiTitle>
          <Icon src={CounterTwo} alt="Counter Two" />
          면접 종류 설정
        </SemiTitle>
        <ButtonContainer>
          <SmallsquareButton
            active={activeButton === 'voice'}
            onClick={() => handleButtonClick('voice')}
          >
            음성
          </SmallsquareButton>
          <SmallsquareButton
            active={activeButton === 'text'}
            onClick={() => handleButtonClick('text')}
          >
            텍스트
          </SmallsquareButton>
        </ButtonContainer>
      </SettingContainer>
      <SettingContainer>
        <SemiTitle>
          <Icon src={CounterThree} alt="Counter Three" />
          질문 개수 설정
        </SemiTitle>
        <CounterButton /> 
      </SettingContainer>
    </Container>
  );
}

export default InputInterviewSetting;
