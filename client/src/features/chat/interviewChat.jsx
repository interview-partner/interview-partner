import React, { useState } from 'react';
import { COLORS } from "../../styles/colors"
import AIDialogBox from '../../components/textbox/aidialogBox.jsx';
import styled from 'styled-components';

const ChatContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 100%;
    width: 62.5%;
    background-color: white;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 80%;
    overflow: hidden;
    background-color: white;
`

const MessagesContainer = styled.div`
    flex: 1;
    justify-content: center; 
    align-items: center; 
    justify-content: flex-end;
    padding: 10px;
    overflow-y: auto;
`;

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

const InterviewChat = () => {
    const [messages, setMessages] = useState([
        { text: "안녕하세요, 어떻게 도와드릴까요?", isUser: false }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, isUser: true }]);
            setInput('');
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "다음 질문입니다. ...", isUser: false }
                ]);
            }, 1000);
        }
    };

    return (
        <ChatContainer>
            <InnerContainer>
            <MessagesContainer>
                {messages.map((message, index) => (
                    <AIDialogBox key={index} text={message.text} isUser={message.isUser} />
                ))}
            </MessagesContainer>
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
                    <span class="material-symbols-outlined">
                        send
                    </span>
                </Button>
            </InputContainer>
            </InnerContainer>
        </ChatContainer>
    );
};

export default InterviewChat;