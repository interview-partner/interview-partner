import React, { createContext, useState } from 'react';

/**
 * AccountContext를 생성
 * 로그인 및 회원가입 상태를 관리하기 위한 컨텍스트
 */
export const AccountContext = createContext();


/**
 * 애니메이션 트랜지션 설정
 * spring 애니메이션으로 설정, duration과 stiffness를 정의
 */
const expandingTransition = {
    type: "spring",
    duration: 2.3,
    stiffness: 30,
};

/**
 * AccountProvider 컴포넌트
 * 로그인 및 회원가입 페이지 상태와 애니메이션을 관리하는 프로바이더 컴포넌트
 */
export const AccountProvider = ({ children }) => {
    const [active, setActive] = useState("signin");
    const [isExpanded, setExpanded] = useState(false);

    /**
     * 애니메이션을 재생하는 함수
     * 애니메이션이 시작된 후 일정 시간이 지나면 애니메이션을 중지
     */
    const playExpandingAnimation = () => {
        setExpanded(true);
        setTimeout(() => {
            setExpanded(false);
        }, expandingTransition.duration * 1000 - 1500);
    };

    /**
     * 회원가입 페이지로 전환하는 함수
     * 애니메이션을 재생하고, 일정 시간 후에 회원가입 페이지로 변경
     */
    const switchToSignup = () => {
        playExpandingAnimation();
        setTimeout(() => {
            setActive("signup");
        }, 400);
    };

    /**
     * 로그인 페이지로 전환하는 함수
     * 애니메이션을 재생하고, 일정 시간 후에 로그인 페이지로 변경
     */
    const switchToSignin = () => {
        playExpandingAnimation();
        setTimeout(() => {
            setActive("signin");
        }, 400);
    };

    return (
        <AccountContext.Provider value={{ active, isExpanded, switchToSignup, switchToSignin }}>
            {children}
        </AccountContext.Provider>
    );
};
