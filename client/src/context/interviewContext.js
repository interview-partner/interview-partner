import React, { createContext, useState } from 'react';

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [interviewId, setInterviewId] = useState(null);

  return (
    <InterviewContext.Provider value={{ interviewId, setInterviewId }}>
      {children}
    </InterviewContext.Provider>
  );
};
