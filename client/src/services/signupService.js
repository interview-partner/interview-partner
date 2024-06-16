import api from "./axiosConfig";

export const signup = async (email, password, nickname) => {
    const requestBody = {
        email,
        password,
        nickname,
    };

    try {
        const response = await api.post('/members', requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });

        if (response.status === 201) {
            // 회원가입 성공
            return response.data;
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                // 유효한 형식이 아님
                throw new Error(error.response.data.message);
            } else if (error.response.status === 409) {
                // 이메일 및 닉네임 중복 에러
                throw new Error(error.response.data.message);
            } else {
                // 기타 오류
                throw new Error(error.response.data.message);
            }
        } else {
            throw new Error('Network error');
        }
    }
};
