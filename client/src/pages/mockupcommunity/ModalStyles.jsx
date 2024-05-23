import styled from 'styled-components';
import { COLORS } from '../../styles/colors.jsx';

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
`;

export const ModalContainer = styled.div`
  background-color: #fff;
  width: 630px;
  height: 650px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const ModalContent = styled.div`
  width: 100%;
  height: 100%;
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

export const FormContainer = styled.form`
  width: 500px;
  display: flex;
  flex-direction: column;
`;

export const FormText = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;

export const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownInput = styled.input`
  width: 100%;
  height: 45px;
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
  padding: 10px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.light_gray};
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const Tag = styled.span`
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
  font-size: 12px;
`;

export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  color: ${COLORS.gray};
  margin-left: 5px;
`;

export const CounterContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CounterButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid ${COLORS.light_gray};
  background-color: white;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;

  &:hover {
    background-color: ${COLORS.light_gray};
  }
`;

export const CounterInput = styled.input`
  width: 50px;
  text-align: center;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 5px;
  height: 30px;
  margin: 0 10px;
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

export const Input = styled.input`
  width: 100%;
  height: 45px;
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

export const ErrorMessage = styled.p`
  color: red;
  font-size: 50%;
`;

