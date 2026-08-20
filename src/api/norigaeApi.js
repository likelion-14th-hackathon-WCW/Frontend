import { apiClient } from './client.js';

// 1. AI 추천 요청
export const getAiRecommendation = async (keyword, excludeCombinations = []) => {
  try {
    const response = await apiClient.post('/api/recommend/', {
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

// 2. 노리개/아이템 디자인 저장
export const saveNorigaeDesign = async (designData) => {
  try {
    const response = await apiClient.post('/api/items/', designData);
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

// 3. 내 노리개 목록 조회
export const getMyNorigaes = async () => {
  try {
    const response = await apiClient.get('/api/norigaes/');
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { success: false, status: 401, message: '로그인이 필요합니다.' };
    }
    return { success: false, message: '저장된 노리개 목록을 불러오지 못했습니다.' };
  }
};

// 4. 노리개 상세 조회
export const getNorigaeDetail = async (id) => {
  try {
    const response = await apiClient.get(`/api/norigaes/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { success: false, status: 404, message: '해당 노리개 정보를 찾을 수 없습니다.' };
    }
    return { success: false, message: '노리개 상세 정보를 가져오는데 실패했습니다.' };
  }
};

// 5. 추천 상품 목록 조회
export const getRecommendProducts = async (itemId) => {
  try {
    const response = await apiClient.get(`/api/items/${itemId}/recommend-products/`);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 503) {
      return { success: false, status: 503, message: error.response.data.detail };
    }
    return { success: false, message: '추천 상품 목록을 불러오지 못했습니다.' };
  }
};

// 6. 상품 상세 조회
export const getProductDetail = async (productId) => {
  try {
    const response = await apiClient.get(`/api/products/${productId}/`);
    return { success: true, data: response.data };
  } catch {
    return { success: false, message: '상품 정보를 가져오는 데 실패했습니다.' };
  }
};