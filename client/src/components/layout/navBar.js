import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import letterLogo from '../../assets/images/letterLogo.png';
import './navBar.css';
import AuthContext from '../../context/AuthContext';
import { AccountContext } from '../../context/accountContext';
import AccountCircleButton from '../../components/button/AccountCircleButton';

const LoginContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
`


/**
 * Navbar 컴포넌트
 * 네비게이션 바를 렌더링하고 로그인, 로그아웃, 회원가입 기능을 제공
 */
function Navbar() {
    // AuthContext에서 로그인 상태와 로그아웃 함수를 가져옴
    const { isLoggedIn, logout } = useContext(AuthContext);
    // AccountContext에서 상태 전환 함수들을 가져옴
    const { switchToSignup, switchToSignin } = useContext(AccountContext);
    // 페이지 이동을 위한 네비게이트 훅 사용
    const navigate = useNavigate();
    // 현재 경로를 확인하기 위한 로케이션 훅 사용
    const location = useLocation();

    /**
     * 로그아웃 함수
     * 로그아웃 요청을 보내고 상태를 업데이트
     */
    const handleLogout = async () => {
        await logout();
    };

    /**
     * 로그인 버튼 클릭 핸들러
     * 로그인 페이지로 이동하고 애니메이션을 재생
     */
    const handleSigninClick = () => {
        if (location.pathname !== '/login') {
            switchToSignin();
            setTimeout(() => {
                navigate('/login');
            }, 500); // 애니메이션 시간에 맞춰 조정
        }
    };

    /**
     * 회원가입 버튼 클릭 핸들러
     * 회원가입 페이지로 이동하고 애니메이션을 재생
     */
    const handleSignupClick = () => {
        if (location.pathname !== '/signup') {
            switchToSignup();
            setTimeout(() => {
                navigate('/signup');
            }, 500); // 애니메이션 시간에 맞춰 조정
        }
    };

    return (
        <nav className='navbar'>
            <div className='navcontainer'>
                <div className='navcontent'>
                    {/* 홈 링크 */}
                    <Link to="/">
                        <img src={letterLogo} className="logo-img" alt="logo" />
                    </Link>
                    <div style={{ width: '80px' }}></div>
                    {/* AI 면접 링크 */}
                    <Link to="/aiinterview">AI면접</Link>
                    <div style={{ width: '56px' }}></div>
                    {/* 모의 면접 링크 */}
                    <Link to="/mockupcommunity">모의 면접</Link>
                </div>
                <div className='navcontent' style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <LoginContainer>
                            {/* 로그아웃 링크 */}
                            <Link to="/" onClick={handleLogout}>로그아웃</Link>
                            {/* AccountCircleButton 컴포넌트 추가 */}
                            <AccountCircleButton />
                        </LoginContainer>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {/* 로그인 버튼 */}
                            <div onClick={handleSigninClick} style={{ cursor: 'pointer', display: 'inline-block' }}>로그인</div>
                            <div>&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                            {/* 회원가입 버튼 */}
                            <div onClick={handleSignupClick} style={{ cursor: 'pointer', display: 'inline-block' }}>회원가입</div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
