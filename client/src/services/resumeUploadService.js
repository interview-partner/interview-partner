import api from './axiosConfig';

/**
 * 이력서를 업로드하는 함수
 * 
 * @param {File} file - 업로드할 이력서 파일
 * @returns {Promise<Object>} 업로드 성공 시 응답 데이터 반환
 * @throws {Error} 업로드 실패 시 오류 메시지 반환
 */
export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/members/me/resumes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    } catch (error) {
        let errorMessage = '이력서 업로드 중 오류가 발생했습니다.';
        if (error.response) {
            const { status } = error.response;
            if (status === 400) {
                errorMessage = '요청 형식에 맞지 않습니다.';
            } else if (status === 404) {
                errorMessage = '해당 리소스가 존재하지 않습니다.';
            } else if (status === 500) {
                errorMessage = '서버에 문제가 생겼습니다.';
            }
        }
        throw new Error(errorMessage);
    }
};

export default uploadResume;
