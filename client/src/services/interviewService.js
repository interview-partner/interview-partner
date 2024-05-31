import api from './axiosConfig';

/**
 * 인터뷰 방을 생성하는 함수
 * 
 * @param {Object} interviewData - 인터뷰 방 생성에 필요한 데이터
 * @param {string} interviewData.title - 인터뷰 제목
 * @param {string} interviewData.interviewType - 인터뷰 유형 (예: 텍스트)
 * @param {number} interviewData.questionNumber - 질문 수
 * @param {string} interviewData.jobAdvertisement - 직무 광고
 * @param {number} interviewData.resumeId - 이력서 ID
 * @returns {Promise<Object>} - 생성된 인터뷰 방 데이터 반환
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const createInterviewRoom = async (interviewData) => {
    try {
        /**
         * 인터뷰 방 생성 API 요청
         */
        const response = await api.post('/interviews', interviewData, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });

        /**
         * 생성된 인터뷰 방 데이터 반환
         */
        return response.data;
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
            errorMessage = "인증 실패";
        }

        /**
         * 오류 메시지 포함된 에러 던지기
         */
        throw new Error(errorMessage);
    }
};