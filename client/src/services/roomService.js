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

/**
 * 방 목록을 조회하는 함수
 *
 * @param {string} status - 조회할 방의 상태 ('open' 또는 'closed')
 * @param {number} page - 조회할 페이지 번호 (0부터 시작)
 * @returns {Promise<Object>} 방 목록 조회 성공 시 응답 데이터 반환
 * @throws {Error} 방 목록 조회 실패 시 오류 메시지 반환
 */
export const fetchRooms = async (status = 'open', page = 0) => {
    try {
        const response = await api.get('/rooms', {
            params: {
                status,
                page
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });

        return response.data;
    } catch (error) {
        let errorMessage = "Unknown error occurred";

        if (error.response && error.response.status === 400) {
            errorMessage = "유효하지 않은 형식입니다.";
        } else if (error.response && error.response.status === 500) {
            errorMessage = "서버 오류가 발생했습니다.";
        }

        throw new Error(errorMessage);
    }
};
