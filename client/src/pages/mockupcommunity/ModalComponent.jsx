import React, { useState } from 'react';
import styled from 'styled-components';
import { Marginer } from '../../components/common/marginer/marginer.jsx';
import { COLORS } from '../../styles/colors.jsx';

// 스타일 컴포넌트 정의
const ModalBackdrop = styled.div`
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

const ModalContainer = styled.div`
  background-color: #fff;
  width: 630px;
  height: 650px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalCloseButton = styled.button`
  align-self: flex-end;
  height: 40px;
  width: 40px;
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: ${COLORS.gray};
`;

const FormContainer = styled.form`
  width: 500px;
  display: flex;
  flex-direction: column;
`;

const FormText = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
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
  background: white url('data:image/svg+xml;utf8,<svg fill="%236e6e6e" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
  cursor: pointer;
  text-align: left;

  &:focus {
    outline: none;
    border-bottom: 2px solid ${COLORS.sky_blue};
  }
`;

const DropdownMenu = styled.ul`
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

const DropdownItem = styled.li`
  padding: 10px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.light_gray};
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
  font-size: 12px;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  color: ${COLORS.gray};
  margin-left: 5px;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CounterButton = styled.button`
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

const CounterInput = styled.input`
  width: 50px;
  text-align: center;
  border: 1px solid ${COLORS.light_gray};
  border-radius: 5px;
  height: 30px;
  margin: 0 10px;
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

const Input = styled.input`
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 50%;
`;

const FormField = ({ type, placeholder, value, onChange, error }) => (
  <>
    <Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {!error && <Marginer direction="vertical" margin={10} />}
  </>
);

const ModalComponent = ({
  isModalOpen,
  closeModal,
  tags,
  handleAddTag,
  handleRemoveTag,
  counter,
  handleCounterChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setDropdownOpen(false);
    handleAddTag({ target: { value: tag } });
  };

  return (
    isModalOpen && (
      <ModalBackdrop onClick={closeModal}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalContent>
            <ModalCloseButton onClick={closeModal}>X</ModalCloseButton>
            <Marginer direction="vertical" margin={20} />
            <header style={{ textAlign: 'left', width: '500px' }}>
              <h1>방 만들기</h1>
            </header>
            <Marginer direction="vertical" margin={20} />
            <FormContainer onSubmit={(e) => e.preventDefault()}>
              <FormText>방 이름</FormText>
              <FormField type="text" placeholder="방 이름을 입력하세요" />

              <Marginer direction="vertical" margin={20} />
              <FormText>한줄 설명</FormText>
              <FormField type="text" placeholder="한줄 설명을 입력하세요" />

              <Marginer direction="vertical" margin={20} />
              <FormText>태그</FormText>
              <DropdownWrapper>
                <DropdownButton type="button" onClick={toggleDropdown}>
                  {selectedTag || '태그를 선택하세요'}
                </DropdownButton>
                {dropdownOpen && (
                  <DropdownMenu>
                    <DropdownItem type="button" onClick={() => handleTagSelect('태그1')}>태그1</DropdownItem>
                    <DropdownItem type="button" onClick={() => handleTagSelect('태그2')}>태그2</DropdownItem>
                    <DropdownItem type="button" onClick={() => handleTagSelect('태그3')}>태그3</DropdownItem>
                  </DropdownMenu>
                )}
              </DropdownWrapper>
              <TagList>
                {tags.map((tag, index) => (
                  <Tag key={index}>
                    {tag}
                    <RemoveTagButton type="button" onClick={() => handleRemoveTag(tag)}>x</RemoveTagButton>
                  </Tag>
                ))}
              </TagList>

              <Marginer direction="vertical" margin={20} />
              <FormText>인원 설정</FormText>
              <CounterContainer>
                <CounterButton type="button" onClick={(e) => handleCounterChange(e, -1)}>-</CounterButton>
                <CounterInput type="text" value={counter} readOnly />
                <CounterButton type="button" onClick={(e) => handleCounterChange(e, 1)}>+</CounterButton>
              </CounterContainer>

              <Marginer direction="vertical" margin={25} />
              <CreateRoomButton type="button" style={{ alignSelf: 'flex-end' }}>방 만들기</CreateRoomButton>
            </FormContainer>
          </ModalContent>
        </ModalContainer>
      </ModalBackdrop>
    )
  );
};

export default ModalComponent;
