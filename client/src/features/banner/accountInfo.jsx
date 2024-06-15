import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors";
import IDcard from "../../assets/icons/IDcard.png";
import Mail from "../../assets/icons/mail.png";
import AccountCreationDateIcon from "../../assets/icons/event_available_Icon_white.png";
import Phone from "../../assets/icons/phone.png";
import RoundButton from "../../components/button/RoundButton";
import getMemberInfo from '../../services/memberInfoService';

const Container = styled.div`
    width: 100%;
    height: 155px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.background_gray};
`;

const InnerContainer = styled.div`
    width: 1200px;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;  
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProfileImage = styled.div`
    width: 120px;
    height: 120px;
    background-color: white;
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    margin-right: 30px;
`;

const ProfileName = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center; 
    gap: 8px;
    margin-right: 88px;
`;

const NameInfo = styled.div`
    color: ${COLORS.font_black};
    font-size: 20px;
`;

const JobInfo = styled.div`
    color: ${COLORS.gray};
    font-size: 16px;
`;

const PersonalInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px; 
    margin-right: auto; 
`;

const DetailInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

const ButtonContainer = styled.div`
    position: absolute;  
    bottom: 10px; 
    right: 10px;  
`;

const OutCircle = styled.div`
    width: 30px;
    height: 30px;
    background-color: ${COLORS.light_gray};
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    margin-right: 4px;
`;

const Icon = styled.img`
    display: flex;
    width: 20px;
    height: 20px;
`;

function AccountInfo() {
    const [memberInfo, setMemberInfo] = useState(null);

    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const data = await getMemberInfo();
                setMemberInfo(data.data);
            } catch (error) {
                console.error('회원 정보를 불러오는 데 실패했습니다.', error);
                alert('회원 정보를 불러오는 데 실패했습니다.');
            }
        };

        fetchMemberInfo();
    }, []);

    if (!memberInfo) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <Container>
            <InnerContainer>
                <ProfileImage />
                <ProfileName>
                    <NameInfo>{memberInfo.nickname}</NameInfo>
                    <JobInfo>No job selected</JobInfo>
                </ProfileName>
                <PersonalInfo>
                    {/* <DetailInfo>
                        <OutCircle>
                            <Icon src={IDcard} alt="IDcard" />
                        </OutCircle>
                        {memberInfo.id}
                    </DetailInfo> */}
                    <DetailInfo>
                        <OutCircle>
                            <Icon src={Mail} alt="Mail" />
                        </OutCircle>
                        {memberInfo.email}
                    </DetailInfo>
                    {/* <DetailInfo>
                        <OutCircle>
                            <Icon src={Phone} alt="Phone" />
                        </OutCircle>
                        010-1234-5678
                    </DetailInfo> */}
                    <DetailInfo>
                        <OutCircle>
                            <Icon src={AccountCreationDateIcon} alt="AccountCreationDate" />
                        </OutCircle>
                        {formatDate(memberInfo.createdDate)}
                    </DetailInfo>
                </PersonalInfo>
                <ButtonContainer>
                    <RoundButton bgColor={COLORS.blue_black} color="white">
                        수정하기
                    </RoundButton>
                </ButtonContainer>
            </InnerContainer>
        </Container>
    );
}


export default AccountInfo;

