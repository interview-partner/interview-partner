import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import {Routes, Route, Link} from 'react-router-dom';
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

function App() {
  return (
    <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/aiinterview" element={<AIinterview />}/>
          <Route path="/promptroom" element={<Promptroom />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/mockupcommunity" element={<Mockupcommunity />}/>
          <Route path="/mockuproom" element={<Mockuproom />}/>
          <Route path="/mypage" element={<Mypage />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/voiceroom" element={<Voiceroom />}/>
        </Routes>
    </>
  );
}

export default App;
