import axios from 'axios';
import { config } from '../config';

/**
 * Axios 인스턴스를 생성하여 API 요청에 사용할 기본 설정을 정의
 * 모든 요청에 대한 기본 URL과 자격 증명을 포함
 */
const api = axios.create({
    baseURL: `${config.apiUrl}/api/v1`,
    withCredentials: true,
});

/**
 * 요청 인터셉터를 설정
 * 요청이 전송되기 전에 액세스 토큰을 헤더에 추가
 */
api.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken');
        console.log("요청 인터셉터: ", accessToken);

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

/**
 * 응답 인터셉터를 설정
 * 응답 오류가 발생했을 때 특정 조건에 따라 토큰 재발행을 시도
 */
api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        console.log("응답 인터셉터");

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            const errorMessage = error.response.data.message;
            const status = error.response.data.status;
            if (status === "error" && errorMessage === "인증이 필요합니다.") {
                alert("로그인이 필요합니다")
                window.location.href = '/login';
            }
            if (status === "error" && errorMessage === "엑세스 토큰이 만료되었습니다.") {
                originalRequest._retry = true;
                try {
                    const response = await axios.post(`${config.apiUrl}/api/v1/auth/token/reissue`, {}, { withCredentials: true });
                    const accessToken = response.headers['authorization'].replace('Bearer ', '');
                    localStorage.setItem('accessToken', accessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    if (refreshError.response && refreshError.response.status === 401) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        console.log("리프레쉬 토큰이 만료되어 로그인 화면으로 이동");
                        alert("로그인이 필요합니다")
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
