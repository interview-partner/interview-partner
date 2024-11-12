import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterRoom } from '../../services/roomService';
import { fetchResumes } from '../../services/resumeService';
import {
    ModalBackdrop, ModalContainer, ModalContent, ModalCloseButton, DropdownWrapper,
    DropdownMenu, DropdownItem, ErrorMessage, IconImage, UploadButton, CreateRoomButton, FileInput, UploadForm, SelectedResumeContainer, SelectedResumeItem, FormContainer, Message
} from './ResumeSelectModalStyles';
import closeIcon from '../../assets/icons/close_Icon.png';
import plustIcon from '../../assets/icons/plusCircle.png';
import { Marginer } from '../../components/common/marginer/marginer';

const ResumeSelectModal = ({ isModalOpen, closeModal, onSelectResume, roomId }) => {
    const [resumes, setResumes] = useState([]);
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);
    const navigate = useNavigate();

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
            setResumes([]);
            setError('');
            setDropdownOpen(false);
            setSelectedResume(null);
        }
    }, [isModalOpen]);

    const handleResumeSelect = (resume) => {
        setSelectedResume(resume);
        onSelectResume(resume.filePath);
        setDropdownOpen(false);
    };

    const handleUploadButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const handleSubmit = async () => {
        if (!selectedResume) {
            setError('이력서를 선택하세요.');
            return;
        }

        try {
            const token = await enterRoom(roomId, selectedResume.id);
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
                        {/* 여기에 plustIcon 을 이용해서 이력서 업로드 할 수 있게   */}
                        <FormContainer onSubmit={(e) => e.preventDefault()}>
                            {resumes.length > 0 ? (
                                <>
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
                                </>
                            ) : (
                                <Message style={{ color: 'gray', textAlign: 'center' }}>
                                    등록된 이력서가 없습니다. 먼저 마이페이지에서 이력서를 업로드해주세요.
                                </Message>
                            )}
                            <Marginer direction="vertical" margin={100} />
                            <CreateRoomButton type="button" onClick={handleSubmit} disabled={!selectedResume} style={{ position: 'absolute', bottom: '25px', right: '40px' }}>
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