import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { config } from '../../config';

/**
 * 스타일드 컴포넌트 정의
 */
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const Message = styled.h1`
  color: #343a40;
  font-size: 24px;
`;

/**
 * 토큰 재발행 컴포넌트
 */
const TokenReissue = () => {
    /**
     * 토큰 재발행 성공 시 호출되는 함수
     */
    const onRefreshed = () => {
        console.log('Token refreshed successfully.');
        window.location.href = '/'; // 메인 페이지로 이동
    };

    /**
     * 토큰 재발행 실패 시 호출되는 함수
     */
    const onError = () => {
        console.error('Failed to refresh token.');
        // 오류 처리 로직 실행 예: 로그인 페이지로 리다이렉트
    };

    /**
     * 컴포넌트 마운트 시 토큰 재발행 요청
     */
    useEffect(() => {
        axios.post(`${config.apiUrl}/api/v1/auth/token/reissue`, {}, { withCredentials: true })
            .then(response => {
                // 카카오, 네이버는 액세스 토큰이 없어서 리프레쉬 토큰을 통해 재발행
                const accessToken = response.headers['authorization'].replace('Bearer ', '');
                localStorage.setItem('accessToken', accessToken); // 새로운 액세스 토큰을 로컬 스토리지에 저장
                onRefreshed(); // 토큰 재발행 성공 처리
            })
            .catch(error => {
                console.error('Token refresh error:', error);
                onError(); // 토큰 재발행 실패 처리
            });
    }, []);

    return (
        <Container>
            <Message>토큰 재발행 중...</Message>
        </Container>
    );
};

export default TokenReissue;
