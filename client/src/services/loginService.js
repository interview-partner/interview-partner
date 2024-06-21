import api from './axiosConfig';
import { config } from '../config';
import googleLogin from './googleLoginService';

/**
 * 이메일과 비밀번호를 사용하여 로그인하는 함수
 * 
 * @param {string} email - 사용자의 이메일
 * @param {string} password - 사용자의 비밀번호
 * @returns {Promise<Object>} 로그인 성공 시 사용자 데이터와 토큰 반환
 * @throws {Error} 로그인 실패 시 오류 메시지 반환
 */
export const login = async (email, password) => {
    /**
     * 요청 본문에 이메일과 비밀번호를 포함
     */
    const requestBody = {
        email,
        password,
    };

    try {
        /**
         * 로그인 API 요청
         */
        const response = await api.post('/auth/login', requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });

        /**
         * 응답 헤더에서 액세스 토큰과 리프레시 토큰 추출
         */
        const accessToken = response.headers['authorization'];
        const refreshToken = response.headers['set-cookie'];

        /**
         * 액세스 토큰이 'Bearer '로 시작하는지 확인하고, 로컬 스토리지에 저장
         */
        if (accessToken && accessToken.startsWith('Bearer ')) {
            const tokenOnly = accessToken.replace('Bearer ', '');
            localStorage.setItem('accessToken', tokenOnly);
        }

        /**
         * 로그인 성공 시 데이터와 토큰 반환
         */
        return {
            data: response.data,
            accessToken: localStorage.getItem('accessToken'),
            refreshToken: refreshToken,
        };
    } catch (error) {
        /**
         * 오류 메시지 기본값 설정
         */
        let errorMessage = "Unknown error occurred";

        /**
         * 오류 응답에 따라 오류 메시지 설정
         */
        if (error.response && error.response.status === 400) {
            errorMessage = "유효하지 않은 형식입니다.";
        } else if (error.response && error.response.status === 401) {
            errorMessage = "로그인 실패";
        }

        /**
         * 오류 메시지 포함된 에러 던지기
         */
        throw new Error(errorMessage);
    }
};

/**
 * 토큰 재발행 함수
 * 
 * @returns {Promise<void>}
 * @throws {Error} - 토큰 재발행 실패 시 오류 메시지 반환
 */
export const reissueToken = async () => {
    try {
        const response = await api.post(`${config.apiUrl}/api/v1/auth/token/reissue`, {}, {
            withCredentials: true
        });

        // 카카오, 네이버는 액세스 토큰이 없어서 리프레쉬 토큰을 통해 재발행
        const newAccessToken = response.headers['authorization'].replace('Bearer ', '');
        localStorage.setItem('accessToken', newAccessToken); // 새로운 액세스 토큰을 로컬 스토리지에 저장
        console.log(newAccessToken);

    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
};

/**
 * 카카오 로그인 함수
 */
export const onKakaoLogin = () => {
    window.location.href = `${config.apiUrl}/api/v1/auth/login/oauth2/kakao`;
};

/**
 * 네이버 로그인 함수
 */
export const onNaverLogin = () => {
    window.location.href = `${config.apiUrl}/api/v1/auth/login/oauth2/naver`;
};

/**
 * 구글 로그인 함수
 * 
 * @param {object} auth - firebase auth 객체
 * @param {function} setLoginError - 로그인 오류 상태 설정 함수
 * @param {function} setShowNotification - 알림 표시 상태 설정 함수
 */
export const onGoogleLogin = (auth, setLoginError, setShowNotification) => {
    googleLogin(auth, setLoginError, setShowNotification);
};