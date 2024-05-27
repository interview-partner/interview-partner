import React, { useState, useEffect } from 'react';
import { Marginer } from '../../components/common/marginer/marginer.jsx';
import ModalComponent from './ModalComponent.jsx';
import { Link } from 'react-router-dom';
import {
  PageContainer, Header, HeaderContainer, HeaderTitle, MainTitle, SubTitle, CreateRoomButton,
  CardContainer, Card, CardHeader, CardTitle, TagContainer, Tag, CardBody, CardFooter,
  EnterButton, PaginationContainer, PaginationButton, PageNumberButton
} from './MockupCommunityStyles';
import styled from 'styled-components';
import { fetchRooms } from '../../services/roomService.js';

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Tab = styled.button`
  background-color: ${props => (props.active ? '#007bff' : '#e9ecef')};
  color: ${props => (props.active ? 'white' : '#495057')};
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  outline: none;
  &:not(:last-child) {
    border-right: none;
  }
`;

function Mockupcommunity() {
  const [rooms, setRooms] = useState([]);
  const [openPage, setOpenPage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('open');
  const [openTotalPages, setOpenTotalPages] = useState(1);
  const [closedTotalPages, setClosedTotalPages] = useState(1);
  const roomsPerPage = 6;

  const currentPage = status === 'open' ? openPage : closedPage;
  const totalPages = status === 'open' ? openTotalPages : closedTotalPages;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 페이지네이션
  const handleChangePage = (page) => {
    if (status === 'open') {
      setOpenPage(page);
    } else {
      setClosedPage(page);
    }
  };

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms(status, currentPage - 1);
        const { content, pageInfo } = response.data;
        const totalPages = Math.ceil(pageInfo.totalElements / roomsPerPage);

        setRooms(content);
        if (status === 'open') {
          setOpenTotalPages(totalPages);
        } else {
          setClosedTotalPages(totalPages);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadRooms();
  }, [status, currentPage]);

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
      {error && <div>{error}</div>}

      <TabsContainer>
        <Tab active={status === 'open'} onClick={() => { setStatus('open'); setOpenPage(1); }}>열린 방</Tab>
        <Tab active={status === 'closed'} onClick={() => { setStatus('closed'); setClosedPage(1); }}>닫힌 방</Tab>
      </TabsContainer>

      <CardContainer>
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>{room.title}</CardTitle>
              <div>{`${room.currentParticipants} / ${room.maxParticipants}`}</div>
            </CardHeader>
            <TagContainer>
              {room.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagContainer>
            <CardBody>
              <p>{room.details}</p>
            </CardBody>
            <CardFooter>
              <div>입장하기</div>
              <Marginer direction="horizontal" margin={10} />
              <Link to="/mockuproom">
                <EnterButton>-&gt;</EnterButton>
              </Link>
            </CardFooter>
            <Marginer direction="vertical" margin={30} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              방 생성 시간: {room.createdTime}
            </div>
          </Card>
        ))}
      </CardContainer>

      <PaginationContainer>
        <PaginationButton onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1 || currentPage === ''}>
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
        <PaginationButton onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages || currentPage === 1}>
          &gt;
        </PaginationButton>
      </PaginationContainer>
      <ModalComponent
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
    </PageContainer>
  );
}

export default Mockupcommunity;
