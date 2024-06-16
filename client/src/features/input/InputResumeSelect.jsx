import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import ResumeList from "../../features/show-list/resumeList";
import { checkResume } from '../../services/checkResumeService';

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

function InputResumeSelect({ interviewData = {}, setInterviewData }) {
  const [resumeId, setResumeId] = useState(interviewData.resumeId || null);
  const [resumes, setResumes] = useState([]);

  const fetchResumes = async () => {
    try {
      const resumeData = await checkResume();
      setResumes(resumeData.data);
    } catch (error) {
      console.error('이력서 조회 오류:', error.message);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    setInterviewData({ ...interviewData, resumeId });
  }, [resumeId]);

  return (
    <Container>
      <Title>
        이력서 제출
      </Title>
      <ResumeList 
        data={resumes} 
        itemsPerPage={8} 
        onSelect={(id) => setResumeId(id)} 
        onUploadComplete={fetchResumes} // Add this line to pass fetchResumes to ResumeList
      />
    </Container>
  );
}

export default InputResumeSelect;
