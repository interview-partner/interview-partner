import React, { useState } from 'react';
import styled from 'styled-components';
import ResumeListButton from '../../components/button/resumeListButton.jsx';
import ResumeUploadButton from '../../components/button/resumeUploadButton.jsx';
import ModalPortal from "../../ModalPortal.js";
import Modal from "../modal/ResumeUploadModal.jsx";
import { COLORS } from "../../styles/colors";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px; 
  row-gap: 8px;
  width: 100%;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: 16px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  color: ${({ active }) => (active ? '#62AED5' : '#17171B')};
  cursor: pointer;

  &:hover {
    color: ${COLORS.sky_blue}; 
  }
`;

const ResumeList = ({ data, itemsPerPage = 8, onSelect, onUploadComplete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(null); 
  const [modalOn, setModalOn] = useState(false);

  const handleModal = () => {
    setModalOn(!modalOn);
  };

  const totalPages = Math.ceil((data.length + 1) / itemsPerPage); // Adjust total pages to account for the ResumeUploadButton

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const handleButtonClick = (index, id) => {
    setActiveIndex(index);
    onSelect(id);
  };

  const renderPageButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <PageButton
          key={i}
          onClick={() => handleClick(i)}
          active={i === currentPage}
        >
          {i}
        </PageButton>
      );
    }
    return pageNumbers;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + (currentPage === 1 ? 7 : 8); // Show 7 items on the first page, 8 items on subsequent pages
  const currentData = data.slice(startIndex, endIndex);

  return (
    <ListContainer>
      <GridContainer>
        {currentPage === 1 && <ResumeUploadButton onClick={handleModal} />}
        {currentData.map((item, index) => (
          <ResumeListButton
            key={item.id}
            isActive={activeIndex === index}
            onClick={() => handleButtonClick(index, item.id)}
          >
            {item.originalFileName}
          </ResumeListButton>
        ))}
      </GridContainer>
      <PaginationContainer>
        {renderPageButtons()}
      </PaginationContainer>
      {modalOn && (
        <ModalPortal>
          <Modal isOpen={modalOn} onClose={handleModal} onUploadComplete={onUploadComplete}>
            <h2>이력서 업로드</h2>
          </Modal>
        </ModalPortal>
      )}
    </ListContainer>
  );
};

export default ResumeList;
