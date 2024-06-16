import api from './axiosConfig';

// 태그 검색 API 호출
export const fetchTags = async (query) => {
    try {
        const response = await api.get('/tags/search', {
            params: {
                query,
                size: 10
            }
        });
        return response.data;
    } catch (error) {
        handleTagError(error);
    }
};

// 태그 생성 API 호출
export const createTag = async (name) => {
    try {
        const response = await api.post('/tags', { name });
        return response.data;
    } catch (error) {
        handleTagError(error);
    }
};

// 방 생성 모달 태그 API 요청에 따른 유효성 검사
export const handleTagError = (error) => {
    if (error.response) {
        if (error.response.status === 400) {
            throw new Error('유효하지 않은 형식입니다. 태그 이름은 1자 이상 15자 이하입니다.');
        } else if (error.response.status === 409) {
            throw new Error('태그 이름이 중복되었습니다.');
        }
    }
    throw new Error('태그를 추가하는 도중 오류가 발생했습니다.');
};
