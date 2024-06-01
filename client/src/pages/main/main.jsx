import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"
import roundlogoWhite from '../../assets/images/roundlogoWhite.png';
import BigsquareButton from "../../components/button/bigsquareButton.jsx";
import './main.css';

function Main() {
    return (
        <div className = 'container'>
                <div className = 'overlayContainer'>
                    <img src={roundlogoWhite} style={{width : '90px', height : '90px'}}></img>
                    <div className = 'title'>INTERVIEW PARTNER</div>
                    <div style={{height: '48px'}}></div>
                    <div style={{display: 'flex', gap: '20px'}}>
                    <BigsquareButton to="/AIinterview">AI 면접</BigsquareButton>
                    <BigsquareButton to="/Mockupcommunity">모의 면접</BigsquareButton>
                </div>
            </div>
        </div>
    );
}
  
export default Main;
