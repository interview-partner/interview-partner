import React, { useState } from 'react';
import { Marginer } from '../../components/common/marginer/marginer.jsx';
import { rooms } from '../../testdata/testroom.js';
import ModalComponent from './ModalComponent.jsx';
import { Link } from 'react-router-dom';
import { addTag, removeTag } from '../../utils/tagUtils.jsx';
import {
  PageContainer, Header, HeaderContainer, HeaderTitle, MainTitle, SubTitle, CreateRoomButton,
  CardContainer, Card, CardHeader, CardTitle, TagContainer, Tag, CardBody, CardFooter,
  EnterButton, PaginationContainer, PaginationButton, PageNumberButton
} from './MockupCommunityStyles';

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
    addTag(tags, setTags, selectedTag, 3);
  };

  const handleRemoveTag = (tag) => {
    removeTag(tags, setTags, tag);
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
        setTags={setTags}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        counter={counter}
        setCounter={setCounter}
        handleCounterChange={handleCounterChange}
      />
    </PageContainer>
  );
}

export default Mockupcommunity;
