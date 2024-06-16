import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AccountBanner from "../../features/banner/accountInfo";
import ResumeManageSection from './ResumeManageSection';
import chevronRightIconSkyBlue from '../../assets/icons/chevron_right_Icon_skyblue.png';
import InterviewManageSection from './InterviewManageSection';
import psychologyIcon from '../../assets/icons/psychology_Icon_skyblue.png';
import videoCameraFrontIcon from '../../assets/icons/video_camera_front_Icon_skyblue.png';
import getAIInterviews from '../../services/getAIInterviewsService';
import { getParticipationHistory } from '../../services/roomService';
import Modal from './Modal';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    align-items: center;
`;

const MyInterviewManagerContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
    margin-top: 2rem;
`;

const SectionTitle = styled.h2`
    text-align: start;
`;

const InterviewListContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    margin-bottom: 2.5rem;
`;

const InterviewItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2rem;
    margin-top: 0.5rem;
    border-bottom: 1px solid #ccc;
    padding: 0 10px;
`;

const InterviewTitle = styled.div`
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const InterviewType = styled.span`
    font-weight: bold;
    margin-right: 8px;
`;

const InterviewDate = styled.div`
    flex-shrink: 0;
    margin-left: 10px;
    color: #666;
    font-size: 0.9rem;
`;

function MyPage() {
    const [isAIModalOpen, setAIModalOpen] = useState(false);
    const [isMockModalOpen, setMockModalOpen] = useState(false);
    const [aiInterviews, setAiInterviews] = useState([]);
    const [participationHistory, setParticipationHistory] = useState([]);

    const openAIModal = () => setAIModalOpen(true);
    const closeAIModal = () => setAIModalOpen(false);

    const openMockModal = () => setMockModalOpen(true);
    const closeMockModal = () => setMockModalOpen(false);

    useEffect(() => {
        const fetchAIInterviews = async () => {
            try {
                const data = await getAIInterviews();
                setAiInterviews(data.data.content);
            } catch (error) {
                console.error(error.message);
                alert('AI 면접 이력을 불러오는 데 실패했습니다.');
            }
        };

        const fetchParticipationHistory = async () => {
            try {
                const data = await getParticipationHistory();
                setParticipationHistory(data.data.content);
            } catch (error) {
                console.error(error.message);
                alert('방 참가 이력을 불러오는 데 실패했습니다.');
            }
        };

        fetchAIInterviews();
        fetchParticipationHistory();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    return (
        <PageContainer>
            <AccountBanner />
            <ResumeManageSection />
            <MyInterviewManagerContainer>
                <SectionTitle>내 면접 관리</SectionTitle>
                <InterviewListContainer>
                    <InterviewManageSection
                        title="AI 면접"
                        titleIconSrc={psychologyIcon}
                        onClick={openAIModal}
                        iconSrc={chevronRightIconSkyBlue}
                        altText="slideLeftIcon"
                        iconHeight="35px"
                    >
                        {aiInterviews.map(interview => (
                            <InterviewItem key={interview.interviewId}>
                                <InterviewTitle>
                                    <InterviewType>({interview.interviewType})</InterviewType>
                                    {interview.title}
                                </InterviewTitle>
                                <InterviewDate>{formatDate(interview.createDate)}</InterviewDate>
                            </InterviewItem>
                        ))}
                    </InterviewManageSection>

                    <InterviewManageSection
                        title="모의 면접"
                        titleIconSrc={videoCameraFrontIcon}
                        onClick={openMockModal}
                        iconSrc={chevronRightIconSkyBlue}
                        altText="slideLeftIcon"
                        iconHeight="35px"
                    >
                        {participationHistory.map(participation => (
                            <InterviewItem key={participation.participantId}>
                                <InterviewTitle>
                                    {participation.roomTitle}
                                </InterviewTitle>
                                <InterviewDate>{formatDate(participation.joinDate)}</InterviewDate>
                            </InterviewItem>
                        ))}
                    </InterviewManageSection>
                </InterviewListContainer>
            </MyInterviewManagerContainer>

            <Modal isOpen={isAIModalOpen} onClose={closeAIModal} title="AI 면접">
                <p>AI 면접에 대한 상세 내용</p>
            </Modal>

            <Modal isOpen={isMockModalOpen} onClose={closeMockModal} title="모의 면접">
                <p>모의 면접에 대한 상세 내용</p>
            </Modal>
        </PageContainer>
    );
}


export default MyPage;
