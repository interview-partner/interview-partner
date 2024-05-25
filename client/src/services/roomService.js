import api from './axiosConfig';

/**
 * 방을 생성하는 함수
 * 
 * @param {Object} roomData - 방 생성에 필요한 데이터 (제목, 설명, 최대 인원, 태그 ID 등)
 * @returns {Promise<Object>} 방 생성 성공 시 응답 데이터 반환
 * @throws {Error} 방 생성 실패 시 오류 메시지 반환
 */
export const createRoom = async (roomData) => {
    try {
        const response = await api.post('/rooms', roomData);
        return response.data;
    } catch (error) {
        let errorMessage = '방 생성 중 오류가 발생했습니다.';
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
