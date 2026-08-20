import { apiClient } from './client.js';

export const getMe = async () => {
  const response = await apiClient.get('/auth/me/');
  return { success: true, data: response.data };
};

export const updateProfile = async (formData) => {
  const response = await apiClient.patch('/auth/me/nickname/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return { success: true, data: response.data };
};

export const getMyReservations = async () => {
  const response = await apiClient.get('/auth/me/reservations/');
  return { success: true, data: response.data };
};

export const cancelReservation = async (id) => {
  const response = await apiClient.delete(`/auth/me/reservations/${id}/`);
  return { success: true, data: response.data };
};

export const getMyItems = async () => {
  try {
    const response = await apiClient.get('/auth/me/items/');
    const raw = response.data;
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.results) ? raw.results : Array.isArray(raw?.data) ? raw.data : [];
    if (list.length > 0) {
      return { success: true, data: list };
    }
    // 서버가 빈 배열을 반환했을 때 /api/items/ 경로도 확인
    try {
      const fb = await apiClient.get('/api/items/');
      const fbRaw = fb.data;
      const fbList = Array.isArray(fbRaw) ? fbRaw : Array.isArray(fbRaw?.results) ? fbRaw.results : Array.isArray(fbRaw?.data) ? fbRaw.data : [];
      if (fbList.length > 0) {
        return { success: true, data: fbList };
      }
    } catch {
      // fallback 무시
    }
    // 로컬 백업 확인
    try {
      const cached = JSON.parse(localStorage.getItem('wcw_saved_items') || '[]');
      if (Array.isArray(cached) && cached.length > 0) {
        return { success: true, data: cached };
      }
    } catch {
      // ignore
    }
    return { success: true, data: list };
  } catch {
    try {
      const fb = await apiClient.get('/api/items/');
      const fbRaw = fb.data;
      const fbList = Array.isArray(fbRaw) ? fbRaw : Array.isArray(fbRaw?.results) ? fbRaw.results : Array.isArray(fbRaw?.data) ? fbRaw.data : [];
      if (fbList.length > 0) {
        return { success: true, data: fbList };
      }
    } catch {
      // fallback 무시
    }
    try {
      const cached = JSON.parse(localStorage.getItem('wcw_saved_items') || '[]');
      if (Array.isArray(cached) && cached.length > 0) {
        return { success: true, data: cached };
      }
    } catch {
      // ignore
    }
    return { success: false, data: [] };
  }
};

export const getMyOwnerships = async () => {
  const response = await apiClient.get('/auth/me/ownerships/');
  return { success: true, data: response.data };
};

export const registerOwnership = async (data) => {
  const response = await apiClient.post('/auth/me/ownerships/', data);
  return { success: true, data: response.data };
};

export const getMyWishlist = async () => {
  const response = await apiClient.get('/auth/me/wishlist/');
  return { success: true, data: response.data };
};

export const deleteWishlistItem = async (id) => {
  const response = await apiClient.delete(`/auth/me/wishlist/${id}/`);
  return { success: true, data: response.data };
};