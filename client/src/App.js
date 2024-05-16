import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import {Routes, Route, Link} from 'react-router-dom';
import Navbar from "../src/components/layout/navBar";
import Main from "../src/pages/main/main.jsx";
import AIinterview from "../src/pages/aiinterview/aiinterview.jsx";
import Interviewroom from "../src/pages/interviewroom/interviewroom.jsx";
import Login from "../src/pages/login/login.jsx";
import Mockupcommunity from "../src/pages/mockupcommunity/mockupcommunity.jsx";
import Mockuproom from "../src/pages/mockuproom/mockuproom.jsx";
import Mypage from "../src/pages/mypage/mypage.jsx";
import Signup from "../src/pages/signup/signup.jsx";

function App() {
  return (
    <>
        <Navbar />
        <Main />

        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/aiinterview" element={<AIinterview />}/>
          <Route path="/interviewroom" element={<Interviewroom />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/mockupcommunity" element={<Mockupcommunity />}/>
          <Route path="/mockuproom" element={<Mockuproom />}/>
          <Route path="/mypage" element={<Mypage />}/>
          <Route path="/signup" element={<Signup />}/>
        </Routes>
    </>
  );
}

export default App;
