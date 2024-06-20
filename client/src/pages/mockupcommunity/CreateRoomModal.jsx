import React, { useState, useEffect } from 'react';
import {
  ModalBackdrop, ModalContainer, ModalContent, ModalCloseButton, FormContainer,
  FormText, DropdownWrapper, DropdownInput, DropdownMenu, DropdownItem, TagList,
  Tag, RemoveTagButton, CounterContainer, CounterButton, CounterInput,
  CreateRoomButton, ErrorMessage, IconImage, FormField
} from './CreateRoomModalStyles.jsx';
import { Marginer } from '../../components/common/marginer/marginer.jsx';
import { fetchTags, createTag } from '../../services/tagService.js';
import { createRoom } from '../../services/roomService.js';
import { validateTagLength, validateTitle, validateDescription, validateMaxParticipants, validateTagNumber } from '../../utils/validators.jsx';
import { addTag, removeTag } from '../../utils/tagUtils.jsx';
import closeIcon from '../../assets/icons/close_Icon.png'

/**
 * 모달 컴포넌트
 * 
 * @param {object} props - 모달 컴포넌트에 대한 속성
 * @param {boolean} isModalOpen - 모달 열림 상태
 * @param {function} closeModal - 모달 닫기 함수
 */
const ModalComponent = ({
  isModalOpen,
  closeModal,
}) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [counter, setCounter] = useState(2);
  const [counterError, setCounterError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  /**
   * 인원 수 변경 핸들러
   * 
   * @param {object} e - 이벤트 객체
   * @param {number} amount - 변경할 수량
   */
  const handleCounterChange = (e, amount) => {
    e.preventDefault();
    e.stopPropagation();
    const newCounterValue = Math.min(5, Math.max(1, counter + amount));
    const validationError = validateMaxParticipants(newCounterValue);
    if (!validationError) {
      setCounter(newCounterValue);
      setCounterError('');
    } else {
      setCounterError(validationError);
    }
  };

  /**
   * 태그 제거 핸들러
   * 
   * @param {object} tag - 제거할 태그 객체
   */
  const handleRemoveTag = (tag) => {
    removeTag(tags, setTags, tag);
  };

  /**
   * 모달이 열릴 때 초기화
   */
  useEffect(() => {
    if (isModalOpen) {
      setTags([]);
      setCounter(2);
      setCounterError('');
      setTagInput('');
      setTagError('');
      setSuggestions([]);
      setTitle('');
      setTitleError('');
      setDescription('');
      setDescriptionError('');
    }
  }, [isModalOpen]);

  /**
   * 태그 입력 변경 시 태그 제안 목록 가져오기
   */
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

  /**
   * 태그 입력 변경 핸들러
   * 
   * @param {object} e - 이벤트 객체
   */
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    const errorMessage = validateTagLength(value);
    if (!errorMessage) {
      setTagInput(value);
      setTagError('');
      if (value.trim()) {
        setDropdownOpen(true);
      } else {
        setDropdownOpen(false);
      }
    } else {
      setTagError(errorMessage);
    }
  };

  /**
   * 태그 선택 핸들러
   * 
   * @param {object|string} tag - 선택한 태그 객체 또는 태그 이름 문자열
   */
  const handleTagSelect = async (tag) => {

    if (typeof tag === 'string') {
      try {
        const data = await createTag(tag);
        if (data.status === 'success') {
          addTag(tags, setTags, { id: data.data.id, name: data.data.name });
        }
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      addTag(tags, setTags, { id: tag.id, name: tag.name });
    }
    setTagInput('');
    setDropdownOpen(false);
    setTagError('');
  };

  /**
   * 방 이름 변경 핸들러
   * 
   * @param {object} e - 이벤트 객체
   */
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setTitleError(validateTitle(value));
  };

  /**
   * 방 설명 변경 핸들러
   * 
   * @param {object} e - 이벤트 객체
   */
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    setDescriptionError(validateDescription(value));
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = async () => {
    const titleValidationError = validateTitle(title);
    const descriptionValidationError = validateDescription(description);
    const tagsValidationError = validateTagNumber(tags)
    setTitleError(titleValidationError);
    setDescriptionError(descriptionValidationError);
    setTagError(tagsValidationError);


    if (titleValidationError || descriptionValidationError || tagsValidationError) {
      return;
    }

    const tagIds = tags.map(tag => tag.id);
    const roomData = {
      title,
      details: description,
      maxParticipants: counter,
      tagIds,
    };

    console.log("룸데이터: ", roomData);

    try {
      const response = await createRoom(roomData);
      alert('방이 성공적으로 생성되었습니다.');
      window.location.reload(); // 페이지 새로고침
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    isModalOpen && (
      <ModalBackdrop onClick={closeModal}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalContent>
            <ModalCloseButton onClick={closeModal}>
              <IconImage src={closeIcon} alt="Close Icon" />
            </ModalCloseButton>

            <Marginer direction="vertical" margin={20} />
            <header style={{ textAlign: 'left', width: '500px' }}>
              <h1>방 만들기</h1>
            </header>
            <Marginer direction="vertical" margin={20} />

            <FormContainer onSubmit={(e) => e.preventDefault()}>
              <FormText>방 이름</FormText>
              <FormField
                type="text"
                placeholder="방 이름을 입력하세요"
                value={title}
                onChange={handleTitleChange}
                error={titleError}
              />
              <FormText>한줄 설명</FormText>
              <FormField
                type="text"
                placeholder="한줄 설명을 입력하세요"
                value={description}
                onChange={handleDescriptionChange}
                error={descriptionError}
              />
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
                {tagError && <ErrorMessage>{tagError}</ErrorMessage>}
              </DropdownWrapper>
              <TagList>
                {tags.map((tag, index) => (
                  <Tag key={index}>
                    {tag.name}
                    <RemoveTagButton type="button" onClick={() => handleRemoveTag(tag)}>x</RemoveTagButton>
                  </Tag>
                ))}
              </TagList>
              <FormText>인원 설정</FormText>
              <CounterContainer>
                <CounterButton type="button" onClick={(e) => handleCounterChange(e, -1)}>-</CounterButton>
                <CounterInput type="text" value={counter} readOnly />
                <CounterButton type="button" onClick={(e) => handleCounterChange(e, 1)}>+</CounterButton>
              </CounterContainer>
              {counterError && <ErrorMessage>{counterError}</ErrorMessage>}
              <Marginer direction="vertical" margin={25} />
              <CreateRoomButton type="button" style={{ position: 'absolute', bottom: '25px', right: '40px' }} onClick={handleSubmit}>방 만들기</CreateRoomButton>
            </FormContainer>
          </ModalContent>
        </ModalContainer>
      </ModalBackdrop>
    )
  );
};

export default ModalComponent;
