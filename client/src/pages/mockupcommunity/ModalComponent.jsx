import React, { useState, useEffect } from 'react';
import {
  ModalBackdrop, ModalContainer, ModalContent, ModalCloseButton, FormContainer,
  FormText, DropdownWrapper, DropdownInput, DropdownMenu, DropdownItem, TagList,
  Tag, RemoveTagButton, CounterContainer, CounterButton, CounterInput,
  CreateRoomButton, Input, ErrorMessage
} from './ModalStyles';
import { Marginer } from '../../components/common/marginer/marginer.jsx';
import { fetchTags, createTag } from '../../../src/services/tagService';
import { validateTagLength } from '../../utils/validators.jsx';

const FormField = ({ type, placeholder, value, onChange, error }) => (
  <>
    <Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
    <Marginer direction="vertical" margin={10} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </>
);

const ModalComponent = ({
  isModalOpen,
  closeModal,
  tags,
  setTags,
  handleAddTag,
  handleRemoveTag,
  counter,
  setCounter,
  handleCounterChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      // 모달이 열릴 때 태그와 인원 초기화
      setTags([]);
      setCounter(0);
      setTagInput('');
      setSuggestions([]);
    }
  }, [isModalOpen, setTags, setCounter]);

  useEffect(() => {
    if (tagInput.trim()) {
      const fetchTagSuggestions = async () => {
        try {
          console.log("Fetching tags for:", tagInput.trim());
          const data = await fetchTags(tagInput.trim());
          console.log("Response:", data);
          if (data && data.status === 'success') {
            setSuggestions(data.data);
          }
        } catch (err) {
          console.error("Error:", err);
        }
      };

      fetchTagSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [tagInput]);

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    const errorMessage = validateTagLength(value);
    if (!errorMessage) {
      setTagInput(value);
      if (value.trim()) {
        setDropdownOpen(true);
      } else {
        setDropdownOpen(false);
      }
    } else {
      alert(errorMessage); // 유효하지 않은 경우 경고 메시지 설정
    }
  };

  const handleTagSelect = async (tag) => {
    if (typeof tag === 'string') {
      // 새로운 태그 추가 로직
      try {
        const data = await createTag(tag);
        if (data.status === 'success') {
          handleAddTag({ target: { value: data.data.name } });
        }
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      // 기존 태그 선택 로직
      handleAddTag({ target: { value: tag.name } });
    }
    setTagInput('');
    setDropdownOpen(false);
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
                <DropdownInput
                  type="text"
                  placeholder="태그를 입력하세요"
                  value={tagInput}
                  onChange={handleTagInputChange}
                />
                {dropdownOpen && (
                  <DropdownMenu>
                    {suggestions
                      .filter((tag) => tag.name.includes(tagInput))
                      .map((tag, index) => (
                        <DropdownItem key={index} onMouseDown={() => handleTagSelect(tag)}>
                          {tag.name}
                        </DropdownItem>
                      ))}
                    {!suggestions.some(tag => tag.name === tagInput) && tagInput.trim() && (
                      <DropdownItem onMouseDown={() => handleTagSelect(tagInput)}>
                        "{tagInput}" 추가
                      </DropdownItem>
                    )}
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
