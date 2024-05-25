import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"
import ActivePoint from "../../components/shape/ActivePoint.jsx";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 270px;
`;

const ProgressBar = styled.div`
    display: flex;
    width: 100%;
    height: 16px;
    margin-right: 24px;
    margin-left: 24px;
    z-index: 1;
    background-color: rgba(98, 174, 213, 0.25);
`;

const Point = styled.div`
    width: 28px;
    height: 28px;
    background-color: white;
    border: 1px solid; 
    border-color: ${COLORS.light_gray}; 
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    z-index: 4; 
`



function SelectInterviewInfo() {
    return (
        <Container>
            <ProgressBar>
                dfsdfa
            </ProgressBar>
        </Container>
    );
}
  
export default SelectInterviewInfo;