import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"
import SelectInterviewInfo from "../../features/show-progress/SelectInterviewInfo.jsx";

const PageContainer = styled.div`
    display: flex;
    width: 1200px;
    margin: auto;
`;

function AIinterview() {
    return (
        <PageContainer>
            <SelectInterviewInfo />
        </PageContainer>
    );
}
  
export default AIinterview;