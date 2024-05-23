import React, { useState, useContext } from "react";
import styled from "styled-components";
import { LoginForm } from "./loginForm";
import { motion } from "framer-motion";
import { AccountContext } from "../../../context/accountContext";
import { SignupForm } from "./signupForm";
import { COLORS } from "../../../styles/colors";
import { Marginer } from "../../../components/common/marginer/marginer";

/**
 * 스타일드 컴포넌트
 */
const BoxContainer = styled.div`
  width: 360px;
  min-height: 674px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 96px 1.8em 5em 56px; /* 위쪽, 오른쪽, 아래쪽, 왼쪽 */
`;

const BackDrop = styled(motion.div)`
  width: 160%;
  height: 650px;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  transform: rotate(60deg);
  top: -290px;
  left: -70px;
  background: ${COLORS.sky_blue};
  background: linear-gradient(
    58deg,
    ${COLORS.sky_blue} 20%,
    ${COLORS.sky_blue} 100%
  );
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.h2`
  font-size: 32px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
  margin: 0;
`;

const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

const backdropVariants = {
  expanded: {
    width: "233%",
    height: "1100px",
    borderRadius: "20%",
    transform: "rotate(60deg)",
  },
  collapsed: {
    width: "130%",
    height: "600px",
    borderRadius: "50%",
    transform: "rotate(60deg)",
  },
};

const expandingTransition = {
  type: "spring",
  duration: 1.5,
  stiffness: 30,
};

/**
 * AccountBox 컴포넌트
 * 로그인 및 회원가입 폼을 전환하는 애니메이션을 포함
 */
export function AccountBox() {
  const { active, isExpanded } = useContext(AccountContext);

  return (
    <BoxContainer>
      <TopContainer>
        <BackDrop
          initial={false}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={backdropVariants}
          transition={expandingTransition}
        />
        {active === "signin" && (
          <HeaderContainer>
            <HeaderText>로그인</HeaderText>
            <Marginer direction="vertical" margin="12px" />
            <SmallText>환영합니다!</SmallText>
          </HeaderContainer>
        )}
        {active === "signup" && (
          <HeaderContainer>
            <HeaderText>회원가입</HeaderText>
            <Marginer direction="vertical" margin="12px" />
          </HeaderContainer>
        )}
      </TopContainer>
      <Marginer direction="vertical" margin="60px" />
      <InnerContainer>
        {active === "signin" && <LoginForm />}
        {active === "signup" && <SignupForm />}
      </InnerContainer>
    </BoxContainer>
  );
}
