import api from './axiosConfig';

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
