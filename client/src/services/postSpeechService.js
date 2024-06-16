import api from './axiosConfig';

/**
 * Google STT 서비스를 호출하여 음성 파일을 텍스트로 변환하는 함수
 * 
 * @param {File} audioFile - 변환할 음성 파일
 * @returns {Promise<string>} - 변환된 텍스트 반환
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const transcribeAudio = async (audioFile) => {
    try {
        // FormData를 사용하여 파일 데이터를 준비
        const formData = new FormData();
        formData.append('file', audioFile);

        // STT 서비스 호출
        const response = await api.post('/speech/transcribe', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // 응답에서 변환된 텍스트를 반환
        return response.data.transcript;
    } catch (error) {
        let errorMessage = '음성 파일 변환 중 오류가 발생했습니다.';
        if (error.response) {
            const { status } = error.response;
            if (status === 400) {
                errorMessage = '요청 형식이 잘못되었습니다.';
            } else if (status === 401) {
                errorMessage = '인증 실패';
            } else if (status === 404) {
                errorMessage = 'STT 서비스를 찾을 수 없습니다.';
            } else if (status === 500) {
                errorMessage = '서버에 문제가 발생했습니다.';
            }
        }
        throw new Error(errorMessage);
    }
};
