import { config } from "../config";

export const login = async (email, password) => {
    const requestBody = {
        email,
        password,
    };

    const response = await fetch(`${config.apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        let errorMessage = "Unknown error occurred";
        if (response.status === 400) {
            errorMessage = "유효하지 않은 형식입니다.";
        } else if (response.status === 401) {
            errorMessage = "로그인 실패";
        }
        throw new Error(errorMessage);
    }

    const responseData = await response.json();
    const accessToken = response.headers.get('Authorization');
    const refreshToken = response.headers.get('Set-Cookie');

    if (accessToken && accessToken.startsWith('Bearer ')) {
        const tokenOnly = accessToken.replace('Bearer ', '');
        localStorage.setItem('accessToken', tokenOnly);
    }

    return {
        data: responseData,
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: refreshToken,
    };
};
