import React, { useState } from 'react';
import styled from 'styled-components';
import AccountBanner from "../../features/banner/accountInfo";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
`;

function MyPage() {
    return (
        <PageContainer>
            <AccountBanner />
        </PageContainer>
    );
}

export default MyPage;
