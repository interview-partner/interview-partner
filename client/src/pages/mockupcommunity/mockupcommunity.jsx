import React, { useState } from 'react';
import { Marginer } from '../../components/common/marginer/marginer.jsx';
import { rooms } from '../../testdata/testroom.js';
import styled from 'styled-components';
import { COLORS } from '../../styles/colors.jsx';
import ModalComponent from './ModalComponent.jsx';
import { Link } from 'react-router-dom';

const flexCenter = `
  display: flex;
  justify-content: center;
  align-items: center;
`;

const buttonStyle = `
  color: white;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: background 240ms ease-in-out;
`;

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Header = styled.header`
  width: 100%;
  height: 140px;
  background-color: rgba(211, 211, 211, 0.17);
  display: flex;
  justify-content: center;
`;

const HeaderContainer = styled.div`
  width: 62.5%;
  justify-content: space-between;
  align-items: center;
  display: flex;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainTitle = styled.h1`
  margin: 0;
`;

const SubTitle = styled.div`
  font-size: 15px;
  color: ${COLORS.gray};
`;

const CreateRoomButton = styled.button`
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

const CardContainer = styled.div`
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

const Card = styled.div`
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const CardTitle = styled.h2`
  margin: 0;
`;

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
  font-size: 12px;
`;

const CardBody = styled.div``;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
`;

const EnterButton = styled.button`
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

const PaginationContainer = styled.div`
  ${flexCenter}
  height: 120px;
`;

const PaginationButton = styled.button`
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

const PageNumberButton = styled.button`
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

function Mockupcommunity() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [counter, setCounter] = useState(0);
  const roomsPerPage = 6;
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const currentRooms = rooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddTag = (e) => {
    const selectedTag = e.target.value;
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleCounterChange = (e, amount) => {
    e.preventDefault();
    e.stopPropagation();
    setCounter((prev) => Math.min(4, Math.max(0, prev + amount)));
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContainer>
          <HeaderTitle>
            <MainTitle>모의 면접</MainTitle>
            <SubTitle>실시간 화상면접</SubTitle>
          </HeaderTitle>
          <CreateRoomButton style={{ marginTop: '77px' }} onClick={openModal}>
            방 만들기
          </CreateRoomButton>
        </HeaderContainer>
      </Header>
      <CardContainer>
        {currentRooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>{room.title}</CardTitle>
              <div>{room.members}</div>
            </CardHeader>
            <TagContainer>
              {room.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagContainer>
            <CardBody>
              <p>{room.description}</p>
            </CardBody>
            <CardFooter>
              <div>입장하기</div>
              <Marginer direction="horizontal" margin={10} />
              <Link to="/mockuproom">
                <EnterButton>-&gt;</EnterButton>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </CardContainer>
      <PaginationContainer>
        <PaginationButton onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </PaginationButton>
        {Array.from({ length: totalPages }, (_, index) => (
          <PageNumberButton
            key={index + 1}
            active={currentPage === index + 1}
            onClick={() => handleChangePage(index + 1)}
          >
            {index + 1}
          </PageNumberButton>
        ))}
        <PaginationButton onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </PaginationButton>
      </PaginationContainer>
      <ModalComponent
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        tags={tags}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        counter={counter}
        handleCounterChange={handleCounterChange}
      />
    </PageContainer>
  );
}

export default Mockupcommunity;
