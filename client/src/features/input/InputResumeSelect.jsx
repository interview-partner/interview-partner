import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import Circle from "../../assets/icons/circle.png";
import ResumeListButton from  "../../components/button/resumeListButton.jsx";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 40px;
`;

const Title = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 8px;
    color: ${COLORS.font_black};
    font-size: 20px;
    margin-bottom: 40px;
`;


function InputResumeSelect() {
  return (
    <Container>
      <Title>
        이력서 제출
      </Title>
      <ResumeListButton>
        cat
      </ResumeListButton>
    </Container>
  );
}

export default InputResumeSelect;
