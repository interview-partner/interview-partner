import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import SendIcon from '../../assets/icons/send_Icon.png'; 

const InputContainer = styled.div`
  display: flex;
  margin-right: 80px;
  margin-left: 80px;
  gap: 4px;
  padding: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 2px solid #D9D9D9;
  border-radius: 10px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${COLORS.blue_black};
  color: white;
  cursor: pointer;
  opacity: ${props => (props.disabled ? 0.5 : 1)}; // 비활성화 시 투명도 조정
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')}; // 비활성화 시 클릭 이벤트 차단

  img {
    width: 20px; // 아이콘 크기 설정
    height: 20px;
  }
`;

const TextInput = ({ input, setInput, handleSend, disabled }) => {
  return (
    <InputContainer>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !disabled) handleSend();
        }}
        disabled={disabled} 
      />
      <Button
        onClick={() => {
          if (!disabled) { 
            console.log('Button clicked');
            handleSend();
          }
        }}
        disabled={disabled} 
      >
        <img src={SendIcon} alt="Send" /> 
      </Button>
    </InputContainer>
  );
};

export default TextInput;
