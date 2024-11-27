import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, SubmitButton, BoldLink, MutedLink, RoundButton } from '../../../components/common/common';
import { Marginer } from "../../../components/common/marginer/marginer";
import { AccountContext } from "../../../context/accountContext";
import styled from "styled-components";
import { loginEmailChangeHandler, loginPasswordChangeHandler } from "../../../utils/validators";
import { login, reissueToken, onKakaoLogin, onNaverLogin, onGoogleLogin } from "../../../services/loginService";
import AuthContext from "../../../context/AuthContext";
// 이미지 경로
import kakaoLogo from '../../../assets/images/kakao_logo_round.png';
import naverLogo from '../../../assets/images/naver_logo_round.png';
import googleLogo from '../../../assets/images/google_logo_round.png';

/**
 * 스타일드 컴포넌트 정의
 */
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

/**
 * 폼 필드 컴포넌트 정의
 * 
 * @param {object} props - 폼 필드에 대한 속성
 */
const FormField = ({ type, placeholder, value, onChange, error }) => (
  <>
    <Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {!error && <Marginer direction="vertical" margin={10} />}
  </>
);

/**
 * 로그인 폼 컴포넌트
 */
export function LoginForm() {
  const { switchToSignup } = useContext(AccountContext);
  const { login: authLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validationErrors, setValidationErrors] = useState({}); // 유효성 검사 에러 상태
  const [loginError, setLoginError] = useState(""); // 로그인 시도 중 서버 오류 상태

  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /**
  * URL 파라미터를 확인하고 상태를 업데이트
  */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const error = params.get('error');

    if (status === 'success') {
      handleLoginSuccess();
    } else if (status === 'failure') {
      handleLoginFailure(error);
    }
  }, [location.search]);

  /**
   * 로그인 성공 시 처리 함수
   */
  const handleLoginSuccess = async () => {
    try {
      await reissueToken(); // 토큰 재발행 호출
      setLoginError("");
      authLogin();
      navigate('/');
    } catch (error) {
      console.error('토큰 재발행 실패:', error);
    }
  };

  /**
   * 로그인 실패 시 처리 함수
   * 
   * @param {string} error - 오류 메시지
   */
  const handleLoginFailure = (error) => {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    if (error === 'login-failed') {
      errorMessage = "로그인 실패";
    } else if (error === 'duplicate-email') {
      errorMessage = "동일한 소셜 계정으로 가입된 회원이 이미 존재합니다.";
    }
    setLoginError(errorMessage);
    setShowNotification(false); // 트리거를 위해 false로 설정
    setTimeout(() => setShowNotification(true), 0); // 바로 true로 설정
    navigate('/login');
  };

  /**
   * 알림 표시를 위한 타이머 설정
   */
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  /**
   * 로그인 폼 제출 핸들러
   * 
   * @param {object} e - 이벤트 객체
   */
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

      // 로그인 성공 시 onLoginSuccess 호출
      handleLoginSuccess();
      navigate('/');

    } catch (error) {
      setLoginError(error.message);
      setShowNotification(false); // 트리거를 위해 false로 설정
      setTimeout(() => setShowNotification(true), 0); // 바로 true로 설정
    }
  };

  // /**
  //  * 인증 테스트 함수
  //  */
  // const testAuth = async () => {
  //   try {
  //     const response = await api.get('/auth/test');
  //     console.log('요청 성공:', response.data);
  //   } catch (error) {
  //     if (error.response) {
  //       console.log('요청 실패:', error.message);
  //     }
  //   }
  // };

  return (
    <>
      <BoxContainer>
        {/* <button onClick={testAuth}> 인증테스트 버튼</button> */}
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
            회원가입
          </BoldLink>
        </MutedLink>
        <Marginer direction="vertical" margin={32} />
        <ButtonsContainer>
          <KakaoButton onClick={onKakaoLogin} />
          <Marginer direction="horizontal" margin="34px" />
          <NaverButton onClick={onNaverLogin} />
          <Marginer direction="horizontal" margin="34px" />
          <GoogleButton onClick={onGoogleLogin} />
        </ButtonsContainer>
        <Marginer direction="vertical" margin={52} />
      </BoxContainer>
      <Notification show={showNotification}>
        {loginError !== "" ? loginError : "로그인 성공"}
      </Notification>
    </>
  );
}