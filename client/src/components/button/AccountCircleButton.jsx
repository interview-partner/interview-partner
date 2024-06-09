import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"
import Account from "../../assets/icons/account.png"
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const OutCircle = styled.div`
    width: 30px;
    height: 30px;
    background-color: ${COLORS.background_gray};
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    cursor: pointer; 
`

const Icon = styled.img`
    display: flex;
    width: 24px;
    height: 24px;
`;

function AccountCircleButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/mypage');
    };

    return (
        <Container>
            <OutCircle onClick={handleClick}>
                <Icon src={Account} alt="Account" />
            </OutCircle>
        </Container>
    );
}

export default AccountCircleButton;
