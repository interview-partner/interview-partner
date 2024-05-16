import React, { useState, useContext, useEffect } from "react";
import { Input, SubmitButton, BoldLink, MutedLink, RoundButton } from '../common/common';
import { Marginer } from "../common/marginer/marginer";
import { AccountContext } from "./accountContext";
import styled from "styled-components";
import { loginEmailChangeHandler, loginPasswordChangeHandler } from "../../utils/validators";
import { login } from "../../services/loginService";
// 이미지 경로
import kakaoLogo from '../../images/kakao_logo_round.png';
import naverLogo from '../../images/naver_logo_round.png';
import googleLogo from '../../images/google_logo_round.png';

const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 50%;
`;

const Notification = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 204, 0, 0.9); 
  color: black; 
  padding: 5px 80px; 
  border-radius: 100px 100px 100px 100px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  font-weight: bold; 
  font-size: 0.875rem; 
`;

const FormField = ({ type, placeholder, value, onChange, error }) => (
  <>
    <Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {!error && <Marginer direction="vertical" margin={10} />}
  </>
);

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
`;

const KakaoButton = styled(RoundButton)`
  background-image: url(${kakaoLogo});
`;

const NaverButton = styled(RoundButton)`
  background-image: url(${naverLogo});
`;

const GoogleButton = styled(RoundButton)`
  background-image: url(${googleLogo});
`;

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // 로그인 시도 중 서버 오류 상태
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(validationErrors).some(e => e !== "")) {
      return;
    }

    if (!email || !password) {
      setValidationErrors((prev) => ({
        ...prev,
        email: !email ? "이메일을 입력해주세요." : prev.email,
        password: !password ? "비밀번호를 입력해주세요." : prev.password,
      }));
      return;
    }

    try {
      const { data, accessToken, refreshToken } = await login(email, password);
      console.log('로그인 성공:', data);
      console.log('Stored Access Token:', accessToken);

      setEmail("");
      setPassword("");
      setLoginError("");

    } catch (error) {
      setLoginError(error.message);
    }

    setShowNotification(true);
  };

  return (
    <>
      <BoxContainer>
        <FormContainer onSubmit={handleSubmit} noValidate>
          <FormField type="email" placeholder="이메일을 입력해주세요" value={email} onChange={loginEmailChangeHandler(setEmail, setValidationErrors)} error={validationErrors.email} />
          <FormField type="password" placeholder="비밀번호를 입력해주세요" value={password} onChange={loginPasswordChangeHandler(setPassword, setValidationErrors)} error={validationErrors.password} />
          <Marginer direction="vertical" margin="32px" />
          <SubmitButton type="submit">로그인</SubmitButton>
        </FormContainer>
        <Marginer direction="vertical" margin="17px" />
        <MutedLink href="#">
          계정이 없으신가요?{" "}
          <BoldLink href="#" onClick={switchToSignup}>
            회원 가입 하기
          </BoldLink>
        </MutedLink>
        <Marginer direction="vertical" margin={32} />
        <ButtonsContainer>
          <KakaoButton />
          <Marginer direction="horizontal" margin="34px" />
          <NaverButton />
          <Marginer direction="horizontal" margin="34px" />
          <GoogleButton />
        </ButtonsContainer>
        <Marginer direction="vertical" margin={52} />
      </BoxContainer>
      <Notification show={showNotification}>
        {loginError !== "" ? loginError : "로그인 성공"}
      </Notification>
    </>
  );
}
