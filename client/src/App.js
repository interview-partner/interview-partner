import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from "../src/components/layout/navBar";
import Main from "../src/pages/main/main.jsx";
import AIinterview from "../src/pages/aiinterview/aiinterview.jsx";
import Interviewroom from "../src/pages/interviewroom/interviewroom.jsx";
import Login from "../src/pages/login/login.jsx";
import Mockupcommunity from "../src/pages/mockupcommunity/mockupcommunity.jsx";
import Mockuproom from "../src/pages/mockuproom/mockuproom.jsx";
import Mypage from "../src/pages/mypage/mypage.jsx";
import Signup from "../src/pages/signup/signup.jsx";
import TokenReissue from "./pages/tokenreissue/tokenreissue.jsx";

/**
 * 메인 애플리케이션 컴포넌트
 */
function App() {
  return (
    <>
      {/* 네비게이션 바 컴포넌트 */}
      <Navbar />
      {/* 라우트 설정 */}
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Main />} />
        {/* AI 면접 페이지 */}
        <Route path="/aiinterview" element={<AIinterview />} />
        {/* 면접방 페이지 */}
        <Route path="/interviewroom" element={<Interviewroom />} />
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
        {/* 토큰 재발급 페이지 */}
        <Route path="/token/reissue" element={<TokenReissue />} />
      </Routes>
    </>
  );
}

export default App;
