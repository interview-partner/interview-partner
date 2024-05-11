import React, { useState, useContext } from "react";
import { BoxContainer, FormContainer, Input, SubmitButton, BoldLink, MutedLink } from './common';
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import styled from "styled-components";
import { emailChangeHandler, passwordChangeHandler } from "../../utils/validators";
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


export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({})

  const handleEmailChange = emailChangeHandler(setEmail, setError);
  const handlePasswordChange = passwordChangeHandler(setPassword, setError);

  const handleSubmit = async (e) => {
    //로그인 API구현시 작성
  };

  return (
    <BoxContainer>
      <FormContainer onSubmit={handleSubmit} noValidate>
        <FormField type="email" placeholder="Email" value={email} onChange={handleEmailChange} error={error.email} />
        <FormField type="password" placeholder="Password" value={password} onChange={handlePasswordChange} error={error.password} />
      </FormContainer>
      <Marginer direction="vertical" margin="1em" />
      <SubmitButton type="submit">Signin</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Don't have an accoun?{" "}
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}
