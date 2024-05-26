import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"
import ActivePoint from "../../components/shape/ActivePoint.jsx";
import UnActivePoint from "../../components/shape/UnActivePoint.jsx";

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 100px;
    height: 80px;
    width: 100%;
`;

const ProgressBar = styled.div`
    position: relative;
    width: 80%;
    height: 12px;
    margin: 0 24px;
`;

const FilledBar = styled.div`
    position: absolute;
    height: 100%;
    background-color: rgba(98, 174, 213, 0.25);
    width: ${({ currentIndex }) => `${currentIndex * 33.5}%`};
    transition: width 0.5s ease-in-out;
`;

const PointContainer = styled.div`
    position: absolute;
    top: -30px;
    left: ${({ left }) => left};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Label = styled.div`
    margin-bottom: 8px;
    font-size: 14px;
    color: ${COLORS.font_black};
    white-space: nowrap;
`;

function SelectInterviewInfo({ currentIndex }) {
    return (
        <Container>
            <ProgressBar>
                <FilledBar currentIndex={currentIndex} />
                <PointContainer left="-2%">
                    <Label>면접 설정</Label>
                    {currentIndex === 0 ? <ActivePoint /> : <UnActivePoint />}
                </PointContainer>
                <PointContainer left="30%">
                    <Label>개인 맞춤 설정</Label>
                    {currentIndex === 1 ? <ActivePoint /> : <UnActivePoint />}
                </PointContainer>
                <PointContainer left="64%">
                    <Label>이력서 제출</Label>
                    {currentIndex === 2 ? <ActivePoint /> : <UnActivePoint />}
                </PointContainer>
                <PointContainer left="97%">
                    <Label>면접 준비</Label>
                    {currentIndex === 3 ? <ActivePoint /> : <UnActivePoint />}
                </PointContainer>
            </ProgressBar>
        </Container>
    );
}

export default SelectInterviewInfo;

