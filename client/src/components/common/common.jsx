import styled from "styled-components";
import { COLORS } from "../../styles/colors";

export const MutedLink = styled.a`
  font-size: 11px;
  color: ${COLORS.gray};
  font-weight: 500;
  text-decoration: none;
  text-align: center;
`;

export const BoldLink = styled.a`
  font-size: 11px;
  color: ${COLORS.sky_blue};
  font-weight: 500;
  text-decoration: none;
  margin: 0 4px;
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  outline: none;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 8px;
  padding: 0px 10px;
  border-bottom: 1.4px solid ${COLORS.light_gray};
  transition: all 200ms ease-in-out;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0px 0px 2.5px rgba(15, 15, 15, 0.19);

  &::placeholder {
    color: ${COLORS.gray};
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid ${COLORS.sky_blue};
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 11px 30%;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 100px 100px 100px 100px;
  cursor: pointer;
  transition: all, 240ms ease-in-out;
  background: ${COLORS.sky_blue};
  background: linear-gradient(
    58deg,
    ${COLORS.sky_blue} 20%,
    ${COLORS.sky_blue} 100%
  );

  &:hover {
    filter: brightness(1.03);
  }
`;

export const RoundButton = styled.button`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 1px solid ${COLORS.light_gray}; /* 테두리 색상 설정 */
  background-color: transparent; /* 배경색 제거 */
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background-size: cover; /* 이미지를 버튼 크기에 맞게 설정 */
  background-position: center;
  
  &:hover {
    background-color: #555;
  }
`;