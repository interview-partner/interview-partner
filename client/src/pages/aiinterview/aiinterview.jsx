import React, { useState } from 'react';
import styled from 'styled-components';
import SelectInterviewInfo from "../../features/show-progress/SelectInterviewInfo.jsx";
import InputInterviewInfo from '../../features/input/InputInterviewInfo.jsx';
import MyModal from "../../"

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 1200px;
    margin: auto;
`;

function AIinterview() {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <PageContainer>
            <SelectInterviewInfo currentIndex={currentIndex} />
            <InputInterviewInfo currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        </PageContainer>
    );
}

export default AIinterview;
