import api from './axiosConfig';

/**
 * 현재 로그인된 사용자의 회원 정보를 조회하는 함수
 * 
 * @returns {Promise<Object>} 회원 정보 조회 성공 시 응답 데이터 반환
 * @throws {Error} 회원 정보 조회 실패 시 오류 메시지 반환
 */
export const getMemberInfo = async () => {
    try {
        const response = await api.get('members/me');
        return response.data;
    } catch (error) {
        let errorMessage = '회원 정보 조회 중 오류가 발생했습니다.';
        if (error.response) {
            const { status } = error.response;
            if (status === 400) {
                errorMessage = '유효한 요청이 아닙니다.';
            } else if (status === 401) {
                errorMessage = '인증 실패';
            } else if (status === 404) {
                errorMessage = '해당 리소스가 존재하지 않습니다.';
            } else if (status === 500) {
                errorMessage = '서버에 문제가 생겼습니다.';
            }
        }
        throw new Error(errorMessage);
    }
};

export default getMemberInfo;
