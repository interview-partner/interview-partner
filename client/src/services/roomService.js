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

/**
 * 방에 입장하기 위한 API 호출
 * 
 * @param {number} roomId - 방 ID
 * @param {number} resumeId - 선택된 이력서 ID
 * @returns {Promise<string>} - 방 입장 토큰
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const enterRoom = async (roomId, resumeId) => {
    const requestBody = { resumeId };

    try {
        const response = await api.post(`/rooms/${roomId}/connections`, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });

        if (response.data && response.data.data && response.data.data.token) {
            return response.data.data.token;
        } else {
            throw new Error("Token not received");
        }
    } catch (error) {
        let errorMessage = "Unknown error occurred";

        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = "유효하지 않은 형식입니다.";
                    break;
                case 404:
                    errorMessage = "해당 리소스가 존재하지 않습니다.";
                    break;
                case 409:
                    errorMessage = "방이 꽉 찼습니다.";
                    break;
                case 410:
                    errorMessage = "방이 종료되었습니다.";
                    break;
                case 500:
                    errorMessage = "서버 에러가 발생했습니다.";
                    break;
                default:
                    errorMessage = "알 수 없는 오류가 발생했습니다.";
            }
        }

        throw new Error(errorMessage);
    }
};

/**
 * 로그인된 사용자의 모의면접 방 참가 이력을 조회하는 함수
 * 
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지 크기 (기본값: 10)
 * @param {string} sort - 정렬 기준 (기본값: 'joinDate')
 * @param {string} direction - 정렬 방향 (기본값: 'DESC')
 * @returns {Promise<Object>} - 방 참가 이력 조회 결과 반환
 * @throws {Error} - 오류 발생 시 오류 메시지 반환
 */
export const getParticipationHistory = async (page = 0, size = 10, sort = 'joinDate', direction = 'DESC') => {
    try {
        const response = await api.get('members/me/rooms', {
            params: {
                page,
                size,
                sort: `${sort},${direction}`
            }
        });

        return response.data;
    } catch (error) {
        let errorMessage = '방 참가 이력 조회 중 오류가 발생했습니다.';
        if (error.response) {
            const { status } = error.response;
            if (status === 400) {
                errorMessage = '요청 형식이 잘못되었습니다.';
            } else if (status === 401) {
                errorMessage = '인증 실패';
            } else if (status === 404) {
                errorMessage = '이력을 찾을 수 없습니다.';
            } else if (status === 500) {
                errorMessage = '서버에 문제가 발생했습니다.';
            }
        }
        throw new Error(errorMessage);
    }
};