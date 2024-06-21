import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 가져옴
import roundlogoWhite from '../../assets/images/roundlogoWhite.png';
import BigsquareButton from "../../components/button/bigsquareButton.jsx";
import './main.css';

function Main() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className='container'>
      <div className='overlayContainer'>
        <img src={roundlogoWhite} style={{ width: '90px', height: '90px' }} alt="Logo" />
        <div className='title'>INTERVIEW PARTNER</div>
        <div style={{ height: '48px' }}></div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <BigsquareButton onClick={() => handleNavigation('/aiinterview')}>AI 면접</BigsquareButton>
          <BigsquareButton onClick={() => handleNavigation('/mockupcommunity')}>모의 면접</BigsquareButton>
        </div>
      </div>
    </div>
  );
}

export default Main;
