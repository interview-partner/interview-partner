import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from "../src/components/layout/navBar";
import Main from "../src/pages/main/main.jsx";
import AIinterview from "../src/pages/aiinterview/aiinterview.jsx";
import Promptroom from "../src/pages/promptroom/promptroom.jsx";
import Login from "../src/pages/login/login.jsx";
import Mockupcommunity from "../src/pages/mockupcommunity/mockupcommunity.jsx";
import Mockuproom from "../src/pages/mockuproom/mockuproom.jsx";
import Mypage from "../src/pages/mypage/mypage.jsx";
import Signup from "../src/pages/signup/signup.jsx";
import Voiceroom from "../src/pages/voiceroom/voiceroom.jsx";
import { AuthProvider } from './context/AuthContext.js';
import { AccountProvider } from './context/accountContext';
import { InterviewProvider } from './context/interviewContext';
import { QuestionIDProvider } from './context/questionIDContext'; // QuestionIDProvider import

/**
 * 메인 애플리케이션 컴포넌트
 */
function App() {
  return (
    <>
      <AuthProvider>
        <AccountProvider>
          <InterviewProvider> {/* InterviewProvider 추가 */}
            <QuestionIDProvider> {/* QuestionIDProvider 추가 */}
              {/* 네비게이션 바 컴포넌트 */}
              <Navbar />
              {/* 라우트 설정 */}
              <Routes>
                {/* 메인 페이지 */}
                <Route path="/" element={<Main />} />
                {/* AI 면접 페이지 */}
                <Route path="/aiinterview" element={<AIinterview />} />
                {/* 프롬프트면접방 페이지 */}
                <Route path="/promptroom/:id" element={<Promptroom />} />
                {/* 음성면접방 페이지 */}
                <Route path="/voiceroom" element={<Voiceroom />} />
                {/* 로그인 페이지 */}
                <Route path="/login" element={<Login />} />
                {/* 목업 커뮤니티 페이지 */}
                <Route path="/mockupcommunity" element={<Mockupcommunity />} />
                {/* 목업방 페이지 */}
                <Route path="/mockuproom" element={<Mockuproom />} />
                {/* 마이페이지 */}
                <Route path="/mypage" element={<Mypage />} />
                {/* 회원가입 페이지 */}
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </QuestionIDProvider> {/* QuestionIDProvider 닫기 */}
          </InterviewProvider> {/* InterviewProvider 닫기 */}
        </AccountProvider>
      </AuthProvider>
    </>
  );
}

export default App;
