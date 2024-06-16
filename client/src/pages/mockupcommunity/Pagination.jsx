// Pagination.jsx
import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../styles/colors.jsx';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

const Pagination = ({ currentPage, totalPages, onChangePage }) => {
  const maxPagesToShow = 5;
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    // 총 페이지 수가 5개 이하인 경우 모든 페이지를 표시
    startPage = 1;
    endPage = totalPages;
  } else {
    // 총 페이지 수가 5개를 초과하는 경우
    const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;

    if (currentPage <= maxPagesBeforeCurrentPage) {
      // 현재 페이지가 3 이하인 경우
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // 현재 페이지가 마지막에서 2번째 이후인 경우
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      // 현재 페이지가 중간 어딘가에 위치한 경우
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  const pages = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);

  return (
    <PaginationContainer>
      <PaginationButton onClick={() => onChangePage(currentPage - 1)} disabled={currentPage === 1}>
        &lt;
      </PaginationButton>
      {pages.map(page => (
        <PageNumberButton
          key={page}
          active={currentPage === page}
          onClick={() => onChangePage(page)}
        >
          {page}
        </PageNumberButton>
      ))}
      <PaginationButton onClick={() => onChangePage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
        &gt;
      </PaginationButton>
    </PaginationContainer>
  );
};

export default Pagination;
