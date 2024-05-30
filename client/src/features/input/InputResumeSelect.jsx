import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import ResumeList from "../../features/show-list/resumeList.jsx";

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

const data = [
  'Resume 1',
  'Resume 2',
  'Resume 3',
  'Resume 4',
  'Resume 5',
  'Resume 6',
  'Resume 7',
  'Resume 8',
  'Resume 9',
  'Resume 10',
  // 더 많은 데이터 추가
];

function InputResumeSelect() {
  return (
    <Container>
      <Title>
        이력서 제출
      </Title>
      <ResumeList data={data} itemsPerPage={8} />
    </Container>
  );
}

export default InputResumeSelect;
