import api from './axiosConfig';
import { config } from '../config';

export const logout = async () => {
    const response = await api.post(`${config.apiUrl}/api/v1/auth/logout`, {}, { withCredentials: true });
    return response;
};