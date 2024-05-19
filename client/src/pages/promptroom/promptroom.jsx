import React from 'react';
import styled from 'styled-components';
import AIDialogBox from "../../components/textbox/aidialogBox.jsx";

const PromptroomContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

function Promptroom() {
    return (
        <PromptroomContainer>
            <AIDialogBox />
        </PromptroomContainer>
    );
}
  
export default Promptroom;