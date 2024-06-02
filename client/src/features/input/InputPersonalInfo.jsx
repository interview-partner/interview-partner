import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";

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

const Info = styled.div`
  display: flex;
  color: ${COLORS.light_gray};
  font-size: 12px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 300px; 
  padding: 12px;
  font-size: 14px;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 4px;
  margin-top: 20px;
  resize: none; 
`;

function InputPersonalInfo({ interviewData, setInterviewData }) {
  const [jobAdvertisement, setJobAdvertisement] = useState(interviewData.jobAdvertisement);

  useEffect(() => {
    setInterviewData({ ...interviewData, jobAdvertisement });
  }, [jobAdvertisement]);

  return (
    <Container>
      <Title>
        개인 맞춤 설정
        <Info>
          (선택)
        </Info>
      </Title>
      <Textarea 
        placeholder="채용 공고를 복사 후 텍스트로 붙여넣어 주세요" 
        value={jobAdvertisement}
        onChange={(e) => setJobAdvertisement(e.target.value)}
      />
    </Container>
  );
}

export default InputPersonalInfo;
