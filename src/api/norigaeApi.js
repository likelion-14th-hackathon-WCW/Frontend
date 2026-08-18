import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAiRecommendation = async (keyword, excludeCombinations = []) => {
  try {
    const response = await api.post('/api/recommendations/', {
      keyword,
      exclude_combinations: excludeCombinations,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 429) {
        return { success: false, status: 429, message: error.response.data.detail };
      }
      if (error.response.status === 503) {
        return { success: false, status: 503, message: error.response.data.detail };
      }
    }
    return { success: false, message: '추천 요청 중 오류가 발생했습니다.' };
  }
};

export const getProductDetail = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: '상품 정보를 가져오는 데 실패했습니다.' };
  }
};

export const getRecommendProducts = async (itemId) => {
  try {
    const response = await api.get(`/api/items/${itemId}/recommend-products/`);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 503) {
      return { success: false, status: 503, message: error.response.data.detail };
    }
    return { success: false, message: '추천 상품 목록을 불러오지 못했습니다.' };
  }
};

export const saveNorigaeDesign = async (designData) => {
  
  try {
    const response = await api.post('/api/norigaes/', designData);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        return { success: false, status: 401, message: '로그인이 필요합니다.' };
      }
      if (status === 400) {
        return { success: false, status: 400, errors: data };
      }
    }
    return { success: false, message: '디자인 저장 중 오류가 발생했습니다.' };
  }
};