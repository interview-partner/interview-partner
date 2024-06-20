import React, { useState, useEffect } from 'react';
import { Marginer } from '../../components/common/marginer/marginer.jsx';
import CreateRoomModal from './CreateRoomModal.jsx';
import ResumeSelectModal from './ResumeSelectModal.jsx';
import {
  PageContainer, Header, HeaderContainer, HeaderTitle, MainTitle, SubTitle, RoomOptionButton, RoomOptionButtonContainer,
  CardContainer, Card, CardHeader, CardTitle, TagContainer, Tag, CardBody, CardFooter, HeaderIconImage,
  EnterButton, Overlay
} from './MockupCommunityStyles';
import { fetchRooms } from '../../services/roomService.js';
import Pagination from './Pagination.jsx';
import { formatTimeAgoInSeconds } from '../../utils/dateUtils.jsx';
import diversity_3_Icon from '../../assets/icons/diversity_3_Icon.png'

function Mockupcommunity() {
  const [rooms, setRooms] = useState([]);
  const [openPage, setOpenPage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('open');
  const [openTotalPages, setOpenTotalPages] = useState(1);
  const [closedTotalPages, setClosedTotalPages] = useState(1);
  const roomsPerPage = 6;

  const currentPage = status === 'open' ? openPage : closedPage;
  const totalPages = status === 'open' ? openTotalPages : closedTotalPages;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //이력서 모달 여닫기 함수
  const openResumeModal = (room) => {
    setSelectedRoom(room);
    setIsResumeModalOpen(true);
  };
  const closeResumeModal = () => {
    setIsResumeModalOpen(false);
    setSelectedRoom(null);
  };

  // 열린 방 또는 닫힌 방 보기 전환 함수
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

  const handleSelectResume = (filePath) => {
    console.log(`Selected resume: ${filePath}`);
    // Resume selection logic here
    //closeResumeModal();
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContainer>
          <HeaderTitle>
            <HeaderIconImage src={diversity_3_Icon} alt="Diversity Icon" />
            <div>
              <MainTitle>모의 면접</MainTitle>
              <SubTitle>실시간 화상면접</SubTitle>
            </div>
          </HeaderTitle>
          <RoomOptionButtonContainer>
            {status === 'open' ? (
              <RoomOptionButton style={{ marginTop: '77px' }} onClick={() => { setStatus('closed'); setClosedPage(1); }}>
                닫힌 방 보기
              </RoomOptionButton>
            ) : (
              <RoomOptionButton style={{ marginTop: '77px' }} onClick={() => { setStatus('open'); setOpenPage(1); }}>
                열린 방 보기
              </RoomOptionButton>
            )}
            <RoomOptionButton style={{ marginTop: '77px' }} onClick={openModal}>
              방 만들기
            </RoomOptionButton>
          </RoomOptionButtonContainer>
        </HeaderContainer>
      </Header>
      {error && <div>{error}</div>}
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
              <EnterButton onClick={() => openResumeModal(room)}>-&gt;</EnterButton>
            </CardFooter>
            <Marginer direction="vertical" margin={30} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', color: 'gray' }}>
              {formatTimeAgoInSeconds(room.createdTime)}
            </div>
            {status === 'closed' && <Overlay>방이 종료되었습니다!</Overlay>}
          </Card>
        ))}
      </CardContainer>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={handleChangePage}
      />

      <CreateRoomModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
      <ResumeSelectModal
        isModalOpen={isResumeModalOpen}
        closeModal={closeResumeModal}
        onSelectResume={handleSelectResume}
        roomId={selectedRoom ? selectedRoom.id : null} // Pass selectedRoom.id to the modal
      />
    </PageContainer>
  );
}

export default Mockupcommunity;
