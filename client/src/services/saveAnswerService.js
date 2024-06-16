import api from './axiosConfig';

/**
 * 질문에 대한 답변을 저장하는 함수
 * 
 * @param {number|string} questionId - 답변을 저장할 질문의 ID
 * @param {Object} answerData - 저장할 답변 데이터 (내용 및 오디오 경로)
 * @param {string} answerData.content - 답변 내용
 * @param {string} answerData.audioPath - 답변의 오디오 파일 경로
 * @returns {Promise<Object>} - 답변 저장 성공 시 응답 데이터 반환 (status, data, message)
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const saveAnswer = async (questionId, answerData) => {
    try {
        console.log('Requesting URL:', `/questions/${questionId}/answers`); // 호출 URL 확인
        const response = await api.post(`/questions/${questionId}/answers`, answerData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // 반환된 데이터가 status, data, message 형식인지 확인
        // data나 message가 null일 수 있음을 고려하여 검증 로직 수정
        if (response.data && response.data.status) {
            return response.data;
        } else {
            throw new Error('응답 형식이 올바르지 않습니다.');
        }
    } catch (error) {
        let errorMessage = '답변을 저장하는 중 오류가 발생했습니다.';
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

export default saveAnswer;
