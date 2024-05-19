import React, { useState } from 'react';
import styled from 'styled-components';
import AIDialogBox from '../../components/textbox/aidialogBox.jsx';

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 80vh;
    width: 60vw;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
`;

const MessagesContainer = styled.div`
    flex: 1;
    padding: 10px;
    overflow-y: auto;
`;

const InputContainer = styled.div`
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #096AC3;
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
                <Button onClick={handleSend}>Send</Button>
            </InputContainer>
        </ChatContainer>
    );
};

export default InterviewChat;