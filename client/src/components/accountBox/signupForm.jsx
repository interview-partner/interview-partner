import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { signupEmailChangeHandler, signupPasswordChangeHandler, signupNicknameChangeHandler } from "../../utils/validators";
import {
  BoldLink,
  Input,
  MutedLink,
  SubmitButton,
} from "../common/common";
import { Marginer } from "../common/marginer/marginer";
import { AccountContext } from "./accountContext";
import { signup } from "../../services/signupService";

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

  // 비밀번호와 확인 비밀번호 일치 여부 확인
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError(prev => ({ ...prev, confirmPassword: "비밀번호가 일치하지 않습니다." }));
    } else {
      setError(prev => ({ ...prev, confirmPassword: "" }));
    }
  }, [password, confirmPassword]); // password 또는 confirmPassword가 변경될 때마다 실행

  //닉네임 중복검사
  useEffect(() => {
    if (nickname !== confirmNickname) {
      setError(prev => ({ ...prev, confirmNickname: "닉네임이 일치하지 않습니다." }));
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
      const data = await signup(email, password, nickname);
      console.log('SignUp Successful:', data);
      alert('회원가입 성공!');

      // API 호출 성공 후 입력 필드 초기화
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setNickname("");
      setConfirmNickname("");

      // 회원가입 성공 후 로그인 폼으로 전환
      switchToSignin();

    } catch (error) {
      if (error.message === 'Invalid request format') {
        console.error('Invalid request format');
        alert('유효하지 않은 형식입니다.');
      } else if (error.message === 'Email or nickname already exists') {
        console.error('Email or nickname already exists');
        alert('이메일 또는 닉네임이 이미 존재합니다.');
      } else {
        console.error('Unknown error occurred');
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <BoxContainer>
      <FormContainer onSubmit={handleSubmit} noValidate>
        <FormField type="email" placeholder="이메일" value={email} onChange={signupEmailChangeHandler(setEmail, setError)} error={error.email} />
        <FormField type="password" placeholder="비밀번호" value={password} onChange={signupPasswordChangeHandler(setPassword, setError)} error={error.password} />
        <FormField type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={error.confirmPassword} />
        <FormField type="text" placeholder="닉네임" value={nickname} onChange={signupNicknameChangeHandler(setNickname, setError)} error={error.nickname} />
        <FormField type="text" placeholder="닉네임 확인" value={confirmNickname} onChange={(e) => setConfirmNickname(e.target.value)} error={error.confirmNickname} />
        <Marginer direction="vertical" margin="35px" />
        <SubmitButton type="submit">회원가입</SubmitButton>
      </FormContainer>
      <Marginer direction="vertical" margin="14px" />
      <MutedLink href="#">
        계정이 이미 있으신가요?
        <BoldLink href="#" onClick={switchToSignin}>
          로그인 하기
        </BoldLink>
      </MutedLink>
      <Marginer direction="vertical" margin="70px" />
    </BoxContainer>
  );
}
