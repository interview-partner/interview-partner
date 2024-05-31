import React, { useState } from 'react';
import styled from 'styled-components';
import ResumeListButton from '../../components/button/resumeListButton.jsx';
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
  color: ${({ active }) => (active ? '#62AED5' : '#17171B')}; // Active page is blue, others are gray
  cursor: pointer;

  &:hover {
    color: ${COLORS.sky_blue}; 
  }
`;

const ResumeList = ({ data, itemsPerPage = 8, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(null); // State to manage active button

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const handleButtonClick = (index) => {
    setActiveIndex(index);
    onSelect(index + (currentPage - 1) * itemsPerPage); // Adjust index based on pagination
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

  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <ListContainer>
      <GridContainer>
        {currentData.map((item, index) => (
          <ResumeListButton
            key={index}
            isActive={activeIndex === index}
            onClick={() => handleButtonClick(index)}
          >
            {item}
          </ResumeListButton>
        ))}
      </GridContainer>
      <PaginationContainer>
        {renderPageButtons()}
      </PaginationContainer>
    </ListContainer>
  );
};

export default ResumeList;
