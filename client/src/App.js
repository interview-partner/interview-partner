import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import { AccountBox } from "./components/accountBox";
import backgroundImage from '../src/assets/mainpageImage.jpg';
import roundlogoWhite from '../src/assets/roundlogoWhite.png';
import Navbar from "../src/components/layout/navBar";
import { COLORS } from "../src/styles/colors"
import BigsquareButton from "../src/components/button/bigsquareButton.jsx";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${backgroundImage});
  background-size: cover;
`;

const OverlayContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* 검정색 배경, 투명도 조절 가능 */
  z-index: 1; /* 다른 요소보다 위에 위치하도록 설정 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.div`
  font-size: 60px;
  font-weight: bold;
  color: white;
  margin-top: 20px;
`;

function App() {
  return (
    <AppContainer>
      <Navbar />
      <OverlayContainer>
        <img src={roundlogoWhite} style={{width : '90px', height : '90px'}}></img>
        <Title>INTERVIEW PARTNER</Title>
        <div style={{height: '48px'}}></div>
        <div style={{display: 'flex', gap: '20px'}}>
          <BigsquareButton to="/AIinterview">AI 면접</BigsquareButton>
          <BigsquareButton to="/Mockupcommunity">모의 면접</BigsquareButton>
        </div>
      </OverlayContainer>
    </AppContainer>
  );
}

export default App;
