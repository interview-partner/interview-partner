import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

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
  margin-left: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${COLORS.blue_black};
  color: white;
  cursor: pointer;
`;

const TextInput = ({ input, setInput, handleSend }) => {
  return (
    <InputContainer>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <Button onClick={handleSend}>
        <span className="material-symbols-outlined">
          send
        </span>
      </Button>
    </InputContainer>
  );
};

export default TextInput;
