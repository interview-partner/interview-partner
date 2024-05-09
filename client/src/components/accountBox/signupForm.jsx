import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { emailChangeHandler, passwordChangeHandler, nicknameChangeHandler } from "../../utils/validators";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { config } from "../../config";

const ErrorMessage = styled.p`
  color: red;
  font-size: 50%;
`;

const FormField = ({ type, placeholder, value, onChange, error }) => (
  <>
    <Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {!error && <Marginer direction="vertical" margin={10} />}
  </>
);

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);

  // 상태 정의
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [confirmNickname, setConfirmNickname] = useState("");
  const [error, setError] = useState({});

  const handleEmailChange = emailChangeHandler(setEmail, setError);
  const handlePasswordChange = passwordChangeHandler(setPassword, setError);
  const handleNicknameChange = nicknameChangeHandler(setNickname, setError);

  // 비밀번호와 확인 비밀번호 일치 여부 확인
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setError(prev => ({ ...prev, confirmPassword: "" }));
    }
  }, [password, confirmPassword]); // password 또는 confirmPassword가 변경될 때마다 실행

  //닉네임 중복검사
  useEffect(() => {
    if (nickname !== confirmNickname) {
      setError(prev => ({ ...prev, confirmNickname: "Nickname do not match" }));
    } else {
      setError(prev => ({ ...prev, confirmNickname: "" }));
    }
  }, [nickname, confirmNickname]); // nickname 또는 confirmNickname 변경될 때마다 실행


  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(error).some(e => e !== "")) {
      return; // 에러가 있으면 제출 중단
    }
    try {
      // API 호출을 위한 요청 바디 생성
      const requestBody = {
        email: email,
        password: password,
        nickname: nickname
      };

      const response = await fetch(`${config.apiUrl}/api/v1/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('SignUp Successful:', data);
      alert(data);

      // API 호출 성공 후 입력 필드 초기화
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setNickname("");
      setConfirmNickname("");

      // 회원가입 성공 후 로그인 폼으로 전환
      switchToSignin();

    } catch (error) {
      console.error('SignUp Failed:', error);
      alert('SignUp Failed');
    }
  };

  return (
    <BoxContainer>

      <FormContainer onSubmit={handleSubmit} noValidate>
        <FormField type="email" placeholder="Email" value={email} onChange={handleEmailChange} error={error.email} />
        <FormField type="password" placeholder="Password" value={password} onChange={handlePasswordChange} error={error.password} />
        <FormField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={error.confirmPassword} />
        <FormField type="text" placeholder="Nickname" value={nickname} onChange={handleNicknameChange} error={error.nickname} />
        <FormField type="text" placeholder="Confirm Nickname" value={confirmNickname} onChange={(e) => setConfirmNickname(e.target.value)} error={error.confirmNickname} />
        <SubmitButton type="submit">Signup</SubmitButton>
      </FormContainer>
      <Marginer direction="vertical" margin="1.6em" />
      <MutedLink href="#">
        Already have an account?
        <BoldLink href="#" onClick={switchToSignin}>
          Signin
        </BoldLink>
      </MutedLink>
      <Marginer direction="vertical" margin="2.0em" />
    </BoxContainer>
  );
}
