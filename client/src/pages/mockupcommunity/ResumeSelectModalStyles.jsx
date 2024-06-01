import styled, { keyframes } from 'styled-components';
import { COLORS } from '../../styles/colors.jsx';

export const IconImage = styled.img`
  width: 100%;
`;

// 페이드 인 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// 슬라이드 인 애니메이션 정의
const slideIn = keyframes`
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.29);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;  // 페이드 인 애니메이션 적용
`;

export const ModalContainer = styled.div`
  background-color: #fff;
  width: 630px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: ${slideIn} 0.3s ease-out;  // 슬라이드 인 애니메이션 적용
`;

export const ModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ModalCloseButton = styled.button`
  align-self: flex-end;
  height: 40px;
  width: 40px;
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: ${COLORS.gray};
`;

export const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

export const UploadForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

export const FileInput = styled.input`
  margin-bottom: 10px;
`;

export const UploadButton = styled.button`
  width: 100%;
  outline: none;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 8px;
  padding: 10px;
  border-bottom: 1.4px solid ${COLORS.light_gray};
  background-color: ${COLORS.light_gray};
  color: black;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0px 0px 2.5px rgba(15, 15, 15, 0.19);

  &:hover {
    background-color: rgba(160, 160, 160, 1); /* 더 어두운 그레이 색상 */
  }
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: 50px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 8px;
  box-shadow: 0px 0px 5px rgba(15, 15, 15, 0.2);
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const DropdownItem = styled.li`
  width: 100%;
  padding: 10px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.light_gray};
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 50%;
`;

export const CreateRoomButton = styled.button`
  width: 100px;
  height: 40px;
  padding: 8px 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: background 240ms ease-in-out;
  background: #254366;

  &:hover {
    background: linear-gradient(
      #3b6aa0 20%,
      #3b6aa0 100%
    );
  }
`;

export const SelectedResumeContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SelectedResumeItem = styled.div`
  padding: 10px;
  width: 100%;
  background-color: ${COLORS.light_gray};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

export const Message = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: ${COLORS.gray};
`;

export const FormContainer = styled.form`
  width: 500px;
  display: flex;
  flex-direction: column;
`;
