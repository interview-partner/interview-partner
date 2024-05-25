import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"
import ActivePoint from "../../components/shape/ActivePoint.jsx";
import UnActivePoint from "../../components/shape/UnActivePoint.jsx";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 270px;
    width: 100%;
`;

const ProgressBar = styled.div`
    display: flex;
    position: relative;
    width: 80%;
    height: 12px;
    margin: 0 24px;
    z-index: 1;
    background-color: rgba(98, 174, 213, 0.25);
`;

const PointContainer = styled.div`
    position: absolute;
    top: -30px; 
    left: ${({ left }) => left};
`;

const Label = styled.div`
    margin-bottom: 8px;  
    font-size: 14px;
    color: ${COLORS.font_black};  
    white-space: nowrap;
`;


function SelectInterviewInfo() {
    return (
        <Container>
            <ProgressBar>
                <PointContainer left="-2%">
                    <Label>면접 설정</Label>
                    <UnActivePoint />
                </PointContainer>
                <PointContainer left="30%">
                    <Label>개인 맞춤 설정</Label>
                    <UnActivePoint />
                </PointContainer>
                <PointContainer left="64%">
                    <Label>이력서 제출</Label>
                    <UnActivePoint />
                </PointContainer>
                <PointContainer left="97%">
                    <Label>면접 준비</Label>
                    <UnActivePoint />
                </PointContainer>
            </ProgressBar>
        </Container>
    );
}
  
export default SelectInterviewInfo;