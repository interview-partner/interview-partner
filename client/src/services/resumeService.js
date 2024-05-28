import api from './axiosConfig';

/**
 * 사용자 이력서 목록을 가져오는 함수
 * 
 * @returns {Promise<Array>} - 이력서 목록 반환
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const fetchResumes = async () => {
    try {
        const response = await api.get('/members/me/resumes');
        return response.data.data;
    } catch (err) {
        throw new Error(err.message);
    }
};