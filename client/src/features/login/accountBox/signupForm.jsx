import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { signupEmailChangeHandler, signupPasswordChangeHandler, signupNicknameChangeHandler, validatePassword, validateNickname, validateFields } from "../../../utils/validators";
import {
  BoldLink,
  Input,
  MutedLink,
  SubmitButton,
} from "../../../components/common/common";
import { Marginer } from "../../../components/common/marginer/marginer";
import { AccountContext } from "../../../context/accountContext";
import { signup } from "../../../services/signupService";

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

/**
 * 폼 필드 컴포넌트 정의
 */
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

  // 회원가입 시 비밀번호와 확인 비밀번호 일치 여부 확인
  useEffect(() => {
    validatePassword(password, confirmPassword, setError);
  }, [password, confirmPassword]);

  // 회원가입 시 닉네임과 확인 닉네임 일치 여부 확인
  useEffect(() => {
    validateNickname(nickname, confirmNickname, setError);
  }, [nickname, confirmNickname]);

  /**
   * 폼 제출 핸들러
   * 
   * @param {object} e - 이벤트 객체
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = { email, password, confirmPassword, nickname, confirmNickname };
    const validationErrors = validateFields(fields);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
    }

    if (Object.values(validationErrors).some(error => error !== "")) {
      return;
    }

    try {
      const data = await signup(email, password, nickname);
      console.log('SignUp Successful:', data);
      alert('회원가입이 완료되었습니다.');

      // API 호출 성공 후 입력 필드 초기화
      resetFields();

      // 회원가입 성공 후 로그인 폼으로 전환
      switchToSignin();

    } catch (error) {
      handleSignupError(error);
    }
  };

  /**
   * 입력 필드를 초기화
   */
  const resetFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNickname("");
    setConfirmNickname("");
  };

  /**
   * 회원가입 실패 시 처리 함수
   */
  const handleSignupError = (error) => {
    if (error.message === 'Invalid request format') {
      console.error('Invalid request format');
      alert('유효하지 않은 형식입니다.');
    } else if (error.message === 'Email is already in use.') {
      console.error('Email or nickname already exists');
      alert('이미 존재하는 이메일 입니다.');
    } else {
      console.error('Unknown error occurred');
      alert('알 수 없는 오류가 발생했습니다.');
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
