import React, { createContext, useState, useEffect } from 'react';
import { logout as authLogout } from '../services/logoutService';

const AuthContext = createContext();

/**
 * 인증 컨텍스트 제공자 컴포넌트
 * 
 */
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logoutError, setLogoutError] = useState(null);

    /**
     * 로그인 상태를 true로 설정
     */
    const login = () => setIsLoggedIn(true);

    /**
     * 로그인 상태 초기화
     * localStorage에서 accessToken을 확인하여
     * 토큰이 있으면 로그인 상태를 유지
     */
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        //const refreshToken = getCookie('refreshToken')
        if (accessToken) {
            setIsLoggedIn(true);
        }
    }, []);

    /**
     * 로그아웃 요청을 보내고 로그아웃 상태로 전환
     * 로그아웃 성공 시 로컬 스토리지에서 토큰을 제거
     */
    const logout = async () => {
        try {
            const response = await authLogout();
            if (response.status === 200) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setIsLoggedIn(false);
                setLogoutError(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('유효하지 않은 요청입니다.');
            } else {
                console.log('알 수 없는 오류가 발생했습니다.');
            }
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, logoutError }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
