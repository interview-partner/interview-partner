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
  flex-direction: row;
`;

export const HeaderIconImage = styled.img`
  width: 40px;  // 너비 설정
  height: 40px;  // 높이 설정
  margin-right: 15px;
`;


export const MainTitle = styled.h1`
  margin: 0;
`;

export const SubTitle = styled.div`
  font-size: 15px;
  color: ${COLORS.gray};
`;

export const RoomOptionButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;  // 버튼 간 간격 설정
`;


export const RoomOptionButton = styled.button`
  width: 108px;
  height: 40px;
  padding: 8px 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  background: #254366;

  &:hover {
    background: linear-gradient(
      58deg,
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
  position: relative;
  background-color: #fff;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: opacity 0.3s;
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

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3); // 반투명한 회색
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 25px;
  font-weight: 700;
  z-index: 10;
`;