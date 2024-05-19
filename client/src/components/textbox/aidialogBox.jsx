import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"

const AIDialog = styled.div`
    width: 625px;
    height: 48px;    
    max-width: 625px;
    min-height: 48px;
    background-color: rgba(98, 174, 213, 0.25);
    border: none;
    border-radius: 0px 30px 30px 30px;
    padding: 14px;

    color: #096AC3;
    font-size: 16px;
    font-weight: normal;

    overflow-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
`;

function AIDialogBox() {
    return (
        <AIDialog>
            안녕하세요 저는 고양이입니다 어떻게 오셨나요?ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ
        </AIDialog>
    );
}
  
export default AIDialogBox;
