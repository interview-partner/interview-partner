import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"
import QuestionLine from "../../assets/icons/question_line.png"

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 10%;
    padding-right: 9px;
    padding-left: 4px;
    padding-top: 4px;
    padding-bottom: 4px;
    border: 1px solid ${COLORS.light_gray};
    border-radius: 30px 30px 30px 00px;
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
`;

function QuestionNumber({ number }) {

    return (
        <Container>
            <Icon src={QuestionLine} alt="QuestionLine" />
            <Content>
                {`질문 ${number}`}
            </Content>
        </Container>
    );
}

export default QuestionNumber;
