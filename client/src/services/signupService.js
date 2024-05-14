import { config } from "../config";

export const signup = async (email, password, nickname) => {
    const requestBody = {
        email,
        password,
        nickname,
    };

    const response = await fetch(`${config.apiUrl}/api/v1/members`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(requestBody)
    });

    // 응답 상태에 따른 처리
    if (response.status === 201) {
        // 회원가입 성공
        return response.json();
    } else if (response.status === 400) {
        // 유효한 형식이 아님
        const error = await response.json();
        throw new Error(error.message);
    } else if (response.status === 409) {
        // 이메일 및 닉네임 중복 에러
        const error = await response.json();
        throw new Error(error.message);
    } else {
        // 기타 오류
        const error = await response.json();
        throw new Error(error.message);
    }
};