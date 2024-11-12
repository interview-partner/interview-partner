import api from './axiosConfig';

/**
 * 이력서를 조회하는 함수
 * @returns {Promise<Array>} 이력서 목록 반환
 * @throws {Error} 조회 실패 시 오류 메시지 반환
 */
export const fetchResumes = async () => {
    try {
        const response = await api.get('/members/me/resumes');
        return response.data.data; // API 응답 형식에 따라 조정
    } catch (error) {
        let errorMessage = '이력서를 불러오는 중 오류가 발생했습니다.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};

/**
 * 이력서를 업로드하는 함수
 * @param {File} file - 업로드할 이력서 파일
 * @param {function} onUploadProgress - 업로드 진행 상태를 업데이트하는 콜백 함수
 * @returns {Promise<Object>} 업로드 성공 시 응답 데이터 반환
 * @throws {Error} 업로드 실패 시 오류 메시지 반환
 */
export const uploadResume = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/members/me/resumes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
        return response.data;
    } catch (error) {
        let errorMessage = '이력서 업로드 중 오류가 발생했습니다.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};