import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import uploadIcon from '../../assets/icons/uploadIcon.png';
import chevronRightIconGray from '../../assets/icons/chevron_right_Icon_gray.png';
import chevronLeftIconGray from '../../assets/icons/chevron_left_Icon_gray.png';
import uploadResume from '../../services/resumeUploadService';
import { checkResume } from '../../services/checkResumeService';

const MyResumeManageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 60%;
`;

const Title = styled.h2`
    text-align: start;
    margin-top: 5%;
`;

const ResumeContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 15%;
    width: 100%;
`;

const UploadContainer = styled.div`
    width: 285px;
    min-width: 150px;
    height: 339px;
    border: 4px dashed #ccc;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 20px 0;
`;

const UploadButton = styled.div`
    width: 60px;
    height: 60px;
    background-color: #62AED5;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #8dcff5;
    }
`;

const UploadIcon = styled.img`
    width: 30px;
    height: 30px;
`;

const UploadText = styled.p`
    margin-top: 10px;
    color: #999;
`;

const HiddenInput = styled.input`
    display: none;
`;

const SliderWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const SliderContainer = styled.div`
    display: flex;
    align-items: center;
    width: 660px; /* 3개 카드의 너비 (200px * 3 + 여백) */
    overflow: hidden;
    position: relative;
`;

const ResumeListContainer = styled.div`
    display: flex;
    transition: transform 0.5s ease-in-out;
`;

const ResumeCard = styled.div`
    width: 200px;
    height: 300px;
    background-color: #e0e0e0;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 0 10px;
`;

const ResumeCover = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 10px;
`;

const ResumeText = styled.div`
    word-wrap: break-word;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    color: #8391A1;
`;

const ArrowButton = styled.button`
    background: none;
    border: none;
    font-size: 2em;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3; /* z-index를 높임 */

    &:disabled {
        cursor: default;
        color: #ccc;
    }
`;

const PrevButton = styled(ArrowButton)`
    left: -40px;
`;

const NextButton = styled(ArrowButton)`
    right: -40px;
`;

const IndicatorContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
`;

const Indicator = styled.div`
    width: 10px;
    height: 10px;
    background-color: ${props => (props.active ? '#62AED5' : '#ccc')};
    border-radius: 50%;
    margin: 0 5px;
    cursor: pointer;
`;

/**
 * 내 이력서 관리 섹션 컴포넌트
 */
const ResumeManageSection = () => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [resumes, setResumes] = useState([]);

    // 컴포넌트가 마운트될 때 이력서 목록을 불러오는 함수
    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const data = await checkResume();
                setResumes(data.data);
            } catch (error) {
                console.error('이력서를 불러오는 데 실패했습니다.', error);
                alert('이력서를 불러오는 데 실패했습니다.');
            }
        };

        fetchResumes();
    }, []);

    // 업로드 버튼 클릭 시 파일 선택창을 여는 함수
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // 파일 선택 시 호출되는 함수
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file);
            setSelectedFile(file);
            try {
                const response = await uploadResume(file);
                console.log('File uploaded successfully:', response);
                alert('이력서를 업로드 하였습니다.');
                // 업로드 후 다시 이력서를 불러옵니다.
                const data = await checkResume();
                setResumes(data.data);
            } catch (error) {
                console.error('File upload failed:', error);
                alert(error.message || '이력서 업로드에 실패했습니다.');
            }
        }
    };

    const cardsPerSlide = 3;
    const cardWidth = 220; // 한 장의 카드 너비 (200px + 좌우 margin 20px)
    const totalSlides = resumes.length - cardsPerSlide >= 0 ? resumes.length - 2 : 1; // 전체 슬라이드 수 계산

    // 이전 슬라이드로 이동하는 함수
    const handlePrevClick = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };

    // 다음 슬라이드로 이동하는 함수
    const handleNextClick = () => {
        setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
    };

    // 인디케이터 클릭 시 해당 슬라이드로 이동하는 함수
    const handleIndicatorClick = (index) => {
        setCurrentSlide(index);
    };

    return (
        <MyResumeManageContainer>
            <Title>내 이력서 관리</Title>
            <ResumeContainer>
                <UploadContainer>
                    <UploadButton type="button" onClick={handleButtonClick}>
                        <UploadIcon src={uploadIcon} alt="Upload Icon" />
                    </UploadButton>
                    <UploadText>이력서 파일을 업로드 해주세요</UploadText>
                    <HiddenInput
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </UploadContainer>
                <div>
                    <SliderWrapper>
                        <PrevButton onClick={handlePrevClick} disabled={currentSlide === 0}>
                            <img src={chevronLeftIconGray} alt="slideLeftIcon" style={{ height: "50px" }} />
                        </PrevButton>
                        <SliderContainer>
                            <ResumeListContainer style={{ transform: `translateX(-${currentSlide * cardWidth}px)` }}>
                                {resumes.map((resume) => (
                                    <ResumeCard key={resume.id}>
                                        {/* <ResumeCover src={`https://interviewpartnerbucket.s3.ap-northeast-2.amazonaws.com/${resume.filePath}`} alt={resume.originalFileName} /> */}
                                        <ResumeText>{resume.originalFileName}</ResumeText>
                                    </ResumeCard>
                                ))}
                            </ResumeListContainer>
                        </SliderContainer>
                        <NextButton onClick={handleNextClick} disabled={currentSlide === totalSlides - 1}>
                            <img src={chevronRightIconGray} alt="slideRightIcon" style={{ height: "50px" }} />
                        </NextButton>
                    </SliderWrapper>
                    <IndicatorContainer>
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <Indicator
                                key={index}
                                active={currentSlide === index}
                                onClick={() => handleIndicatorClick(index)}
                            />
                        ))}
                    </IndicatorContainer>
                </div>
            </ResumeContainer>
        </MyResumeManageContainer>
    );
};

export default ResumeManageSection;
