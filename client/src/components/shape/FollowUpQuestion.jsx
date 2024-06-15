import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"
import QuestionFill from "../../assets/icons/question_fill.png"

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 7px;
`

const Content = styled.div`
    display: flex;
    font-size: 14px;
    gap: 8px;
`

const Icon = styled.img`
  width: 21px;
  height: 21px;
  opacity: 0.25;
`;

function FollowUpQuestion() {

    return (
        <Container>
            <Icon src={QuestionLine} alt="QuestionLine" />
            <Content>
                꼬리 질문
            </Content>
        </Container>
    );
}

export default FollowUpQuestion;
