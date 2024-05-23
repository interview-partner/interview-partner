// StyledComponents.js
import styled from 'styled-components';
import { COLORS } from '../../styles/colors.jsx';

export const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const Header = styled.header`
  width: 100%;
  height: 140px;
  background-color: rgba(211, 211, 211, 0.17);
  display: flex;
  justify-content: center;
`;

export const HeaderContainer = styled.div`
  width: 62.5%;
  justify-content: space-between;
  align-items: center;
  display: flex;
`;

export const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MainTitle = styled.h1`
  margin: 0;
`;

export const SubTitle = styled.div`
  font-size: 15px;
  color: ${COLORS.gray};
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

export const CardContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 33%);
  grid-template-rows: repeat(3, auto);
  gap: 20px;
  margin-top: 20px;
  justify-content: center;

  @media (max-width: 1200px) {
    display: flex;
    flex-direction: column;
    width: 65%;
    margin: 20px auto 0;
    align-items: center;
  }
`;

export const Card = styled.div`
  background-color: #fff;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

export const CardTitle = styled.h2`
  margin: 0;
`;

export const TagContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

export const Tag = styled.span`
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
  font-size: 12px;
`;

export const CardBody = styled.div``;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
`;

export const EnterButton = styled.button`
  height: 36px;
  width: 54px;
  background-color: ${COLORS.sky_blue};
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 25px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(
      58deg,
      #7BC7EE 20%,
      #7BC7EE 100%
    );
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
`;

export const PaginationButton = styled.button`
  margin: 0 5px;
  padding: 8px 16px;
  color: ${COLORS.gray};
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;

  &:disabled {
    color: ${COLORS.light_gray};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    color: ${COLORS.sky_blue};
  }
`;

export const PageNumberButton = styled.button`
  margin: 0 5px;
  padding: 8px 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${({ active }) => (active ? COLORS.sky_blue : '#000000')};

  &:hover:not(:disabled) {
    color: ${({ active }) => (active ? COLORS.sky_blue : '#c0c0c0')};
  }
`;
