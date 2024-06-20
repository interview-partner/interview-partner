// QuestionIDContext.js
import React, { createContext, useState, useContext } from 'react';

// Context 생성
const QuestionIDContext = createContext();

// Context Provider 생성
export const QuestionIDProvider = ({ children }) => {
  const [questionID, setQuestionID] = useState(null);

  return (
    <QuestionIDContext.Provider value={{ questionID, setQuestionID }}>
      {children}
    </QuestionIDContext.Provider>
  );
};

// Custom hook
export const useQuestionID = () => useContext(QuestionIDContext);
