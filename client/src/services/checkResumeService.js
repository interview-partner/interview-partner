import api from './axiosConfig';

/**
 * 사용자의 이력서를 조회하는 함수
 * 
 * @returns {Promise<Object>} - 이력서 조회 결과 반환
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const checkResume = async () => {
    try {
        const response = await api.get('/members/me/resumes');
        return response.data;
    } catch (error) {
        let errorMessage = '이력서 조회 중 오류가 발생했습니다.';
        if (error.response) {
            const { status } = error.response;
            if (status === 400) {
                errorMessage = '요청 형식이 잘못되었습니다.';
            } else if (status === 401) {
                errorMessage = '인증 실패';
            } else if (status === 404) {
                errorMessage = '이력서를 찾을 수 없습니다.';
            } else if (status === 500) {
                errorMessage = '서버에 문제가 발생했습니다.';
            }
        }
        throw new Error(errorMessage);
    }
};
