import api from './axiosConfig';

/**
 * 로그인된 사용자의 AI 면접 이력을 조회하는 함수
 * 
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지 크기 (기본값: 10)
 * @param {string} sort - 정렬 기준 (기본값: 'createDate')
 * @param {string} direction - 정렬 방향 (기본값: 'DESC')
 * @returns {Promise<Object>} - 면접 이력 조회 결과 반환
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const getAIInterviews = async (page = 0, size = 10, sort = 'createDate', direction = 'DESC') => {
    try {
        const response = await api.get('members/me/interviews', {
            params: {
                page,
                size,
                sort: `${sort},${direction}`
            }
        });

        return response.data;
    } catch (error) {
        let errorMessage = 'AI 면접 이력 조회 중 오류가 발생했습니다.';
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

export default getAIInterviews;
