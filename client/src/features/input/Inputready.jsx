import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import Circle from "../../assets/icons/circle.png";

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
    margin-bottom: 8px;
`;


const GuideContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const GuideList = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: ${COLORS.font_black};
    margin-bottom: 8px;
`

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

function InputPersonalInfo() {
  return (
    <Container>
      <Title>
        면접 준비
      </Title>
      <GuideContainer>
        <GuideList>
            <Icon src={Circle} alt="Circle" />
            주어진 질문에 음성으로 답변합니다
        </GuideList>
        <GuideList>
            <Icon src={Circle} alt="Circle" />
            각 질문에 대한 답변이 이루어진 후, 다음질문/꼬리질문을 설정할 수 있습니다
        </GuideList>
        <GuideList>
            <Icon src={Circle} alt="Circle" />
            각 면접 기록은 마이페이지에서 확인할 수 있습니다
        </GuideList>
      </GuideContainer>
    </Container>
  );
}

export default InputPersonalInfo;
