import React from 'react';
import styled from 'styled-components';
import SendBlueIcon from '../../assets/icons/send_blue.png'; // send_blue 아이콘 경로
import VoiceBlueIcon from '../../assets/icons/voice_blue.png'; // voice_blue 아이콘 경로

// 그림자 효과가 있는 원형 버튼 스타일
const ShadowButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  background-color: ${props => props.backgroundColor || '#62AED5'};
  border: none;
  border-radius: 50%;
  color: ${props => props.color || 'white'};
  font-size: ${props => props.fontSize || '16px'};
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
  }
`;

// 아이콘 스타일
const Icon = styled.img`
  width: ${props => props.size || '50%'};
  height: ${props => props.size || '50%'};
`;

const VoiceroomButton = ({ onClick, isVoice }) => {
  return (
    <ShadowButton
      size="70px"
      backgroundColor="#62AED5"
      color="#fff"
      onClick={onClick} // onClick 핸들러를 전달합니다.
    >
      <Icon src={isVoice ? VoiceBlueIcon : SendBlueIcon} alt="icon" />
    </ShadowButton>
  );
};

export default VoiceroomButton;
