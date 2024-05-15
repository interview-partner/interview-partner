import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import letterLogo from '../../assets/letterLogo.png';
import './navBar.css';

function Navbar() {
    return (
        <nav className = 'navbar'>
            <div className = 'navcontainer'>
                <div className = 'navcontent'>
                    <Link to="/">
                        <img src={letterLogo} className="logo-img"></img>
                    </Link>
                    <div style = {{width: '80px'}}></div>
                    <Link to="/AIinterview">AI면접</Link>
                    <div style = {{width: '56px'}}></div>
                    <Link to="/Mockupcommunity">모의 면접</Link>
                </div>
                <div className = 'navcontent'>
                    <Link to="/Login">로그인</Link>
                    <div>&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                    <Link to="/Signup">회원가입</Link>
                </div>
            </div>
        </nav>
    );
}
  
export default Navbar;