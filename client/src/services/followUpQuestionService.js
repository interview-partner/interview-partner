import api from './axiosConfig';

/**
 * 꼬리질문을 생성하는 함수
 * 
 * @param {number|string} questionId - 꼬리질문을 생성할 질문의 ID
 * @returns {Promise<Object>} - 꼬리질문 생성 성공 시 응답 데이터 반환 (status, data, message)
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const generateFollowUpQuestion = async (questionId) => {
    try {
        console.log('Requesting URL:', `/questions/${questionId}/tails`); // 호출 URL 확인
        const response = await api.post(`/questions/${questionId}/tails`, null, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // 반환된 데이터가 status, data, message 형식인지 확인
        if (response.data && response.data.status) {
            return response.data;
        } else {
            throw new Error('응답 형식이 올바르지 않습니다.');
        }
    } catch (error) {
        let errorMessage = '꼬리질문을 생성하는 중 오류가 발생했습니다.';
        if (error.response) {
            const { status } = error.response;
            if (status === 400) {
                errorMessage = '요청 형식이 잘못되었습니다.';
            } else if (status === 401) {
                errorMessage = '인증 실패';
            } else if (status === 404) {
                errorMessage = '질문을 찾을 수 없습니다.';
            } else if (status === 500) {
                errorMessage = '서버에 문제가 발생했습니다.';
            }
        }
        throw new Error(errorMessage);
    }
};

export default generateFollowUpQuestion;
