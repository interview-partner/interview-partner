import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterRoom } from '../../services/roomService';
import { fetchResumes } from '../../services/resumeService';
import {
    ModalBackdrop, ModalContainer, ModalContent, ModalCloseButton, DropdownWrapper,
    DropdownMenu, DropdownItem, ErrorMessage, IconImage, UploadButton, CreateRoomButton, FileInput, UploadForm, SelectedResumeContainer, SelectedResumeItem, FormContainer, Message
} from './ResumeSelectModalStyles';
import closeIcon from '../../assets/icons/close_Icon.png';
import { Marginer } from '../../components/common/marginer/marginer';

/**
 * 이력서 선택 모달 컴포넌트
 * 
 * @param {object} props - 모달 컴포넌트에 대한 속성
 * @param {boolean} isModalOpen - 모달 열림 상태
 * @param {function} closeModal - 모달 닫기 함수
 * @param {function} onSelectResume - 이력서 선택 시 호출되는 함수
 * @param {number} roomId - 방 ID
 */
const ResumeSelectModal = ({ isModalOpen, closeModal, onSelectResume, roomId }) => {
    const [resumes, setResumes] = useState([]);
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const navigate = useNavigate();

    /**
     * 이력서 목록을 불러오는 함수
     */
    useEffect(() => {
        const loadResumes = async () => {
            try {
                const resumesData = await fetchResumes();
                setResumes(resumesData);
            } catch (err) {
                setError(err.message);
            }
        };

        if (isModalOpen) {
            loadResumes();
        } else {
            // 모달이 닫힐 때 상태 초기화
            setResumes([]);
            setError('');
            setDropdownOpen(false);
            setSelectedFile(null);
            setSelectedResume(null);
        }
    }, [isModalOpen]);

    /**
     * 이력서 선택 핸들러
     * 
     * @param {object} resume - 선택한 이력서 객체
     */
    const handleResumeSelect = (resume) => {
        setSelectedResume(resume);
        onSelectResume(resume.filePath);
        setDropdownOpen(false);
    };

    /**
     * 업로드 버튼 클릭 핸들러
     * 
     * @param {object} e - 이벤트 객체
     */
    const handleUploadButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    // const handleFileChange = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     setSelectedFile(e.target.files[0]);
    // };

    // const handleFileUpload = async (e) => {
    //     e.preventDefault();
    //     if (!selectedFile) {
    //         setError('파일을 선택하세요');
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('file', selectedFile);

    //     try {
    //         await api.post('/members/me/resumes', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         setSelectedFile(null);
    //         setError('');
    //         const fetchResumes = async () => {
    //             try {
    //                 const response = await api.get('/members/me/resumes');
    //                 setResumes(response.data.data);
    //             } catch (err) {
    //                 setError(err.message);
    //             }
    //         };
    //         fetchResumes();
    //     } catch (err) {
    //         setError(err.message);
    //     }
    // };

    /**
     * 모달 외부 클릭 시 모달 닫기 핸들러
     * 
     * @param {object} e - 이벤트 객체
     */
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    /**
     * 폼 제출 핸들러
     */
    const handleSubmit = async () => {
        if (!selectedResume) {
            setError('이력서를 선택하세요.');
            return;
        }

        try {
            const token = await enterRoom(roomId, selectedResume.id);

            console.log('방 입장 토큰:', token);
            navigate('/mockuproom', { state: { token } });

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        isModalOpen && (
            <ModalBackdrop onClick={handleBackdropClick}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalContent>

                        <ModalCloseButton onClick={closeModal}>
                            <IconImage src={closeIcon} alt="Close Icon" />
                        </ModalCloseButton>

                        <Marginer direction="vertical" margin={20} />
                        <header style={{ textAlign: 'left', width: '500px' }}>
                            <h1>이력서 선택</h1>
                        </header>
                        <Marginer direction="vertical" margin={20} />

                        <FormContainer onSubmit={(e) => e.preventDefault()}>

                            {selectedResume && (
                                <SelectedResumeContainer>
                                    <SelectedResumeItem>
                                        {selectedResume.originalFileName}
                                    </SelectedResumeItem>
                                    <Message>이력서가 선택되었습니다. 이력서를 변경하시려면 이력서를 다시 선택해주세요.</Message>
                                </SelectedResumeContainer>
                            )}
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            <Marginer direction="vertical" margin={20} />
                            <DropdownWrapper>
                                <UploadButton type="button" onClick={handleUploadButtonClick}>
                                    {selectedResume ? '이력서 변경하기' : '이력서를 선택해주세요'}
                                </UploadButton>
                                {dropdownOpen && (
                                    <DropdownMenu>
                                        {resumes.map((resume) => (
                                            <DropdownItem key={resume.id} onMouseDown={() => handleResumeSelect(resume)}>
                                                {resume.originalFileName}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                )}
                            </DropdownWrapper>
                            <Marginer direction="vertical" margin={100} />
                            <CreateRoomButton type="button" onClick={handleSubmit} style={{ position: 'absolute', bottom: '25px', right: '40px' }}>
                                입장하기
                            </CreateRoomButton>
                        </FormContainer>
                    </ModalContent>
                </ModalContainer>
            </ModalBackdrop>
        )
    );
};

export default ResumeSelectModal;
