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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Unknown error occurred');
    }

    return response.json();
};