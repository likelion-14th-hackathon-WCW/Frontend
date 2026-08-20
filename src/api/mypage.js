import { apiClient } from './client.js';

export const getMe = async () => {
  const response = await apiClient.get('/auth/me/');
  return { success: true, data: response.data };
};

export const updateProfile = async (formData) => {
  try {
    const response = await apiClient.patch('/auth/me/nickname/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.detail || error.response?.data?.nickname?.[0] || '프로필 수정에 실패했습니다.';
    return { success: false, message };
  }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    await apiClient.patch('/auth/me/password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.detail || '비밀번호 변경에 실패했습니다.';
    return { success: false, message };
  }
};

export const deleteAccount = async () => {
  try {
    await apiClient.post('/auth/withdraw/');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('wcw_user');
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.detail || '회원 탈퇴에 실패했습니다.';
    return { success: false, message };
  }
};

export const getMyReservations = async () => {
  const response = await apiClient.get('/auth/me/reservations/');
  return { success: true, data: response.data };
};

export const cancelReservation = async (id) => {
  const response = await apiClient.delete(`/auth/me/reservations/${id}/`);
  return { success: true, data: response.data };
};

// ponytail: 백엔드가 /auth/me/items/ 응답에 symbol_reason(AI 추천 문구) 등 일부
// 필드를 안 내려줄 때가 있어, 저장 시점에 로컬에 캐싱해둔 값(wcw_saved_items)으로
// 빠진 필드만 보완한다. id가 일치하는 항목만 병합하고 백엔드 값은 덮어쓰지 않는다.
function mergeLocalNorigaeCache(list) {
  let cached;
  try {
    cached = JSON.parse(localStorage.getItem('wcw_saved_items') || '[]');
  } catch {
    return list;
  }
  if (!Array.isArray(cached) || cached.length === 0) return list;

  const cacheById = new Map(cached.map((entry) => [String(entry.id ?? entry.item_id), entry]));

  return list.map((item) => {
    const cachedItem = cacheById.get(String(item.id ?? item.item_id));
    if (!cachedItem) return item;
    const merged = { ...item };
    for (const key of ['symbol_reason', 'wish_keyword', 'knot', 'decoration', 'tassel', 'color']) {
      if (!merged[key] && cachedItem[key]) merged[key] = cachedItem[key];
    }
    return merged;
  });
}

export const getMyItems = async () => {
  try {
    const response = await apiClient.get('/auth/me/items/');
    const raw = response.data;
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.results) ? raw.results : Array.isArray(raw?.data) ? raw.data : [];
    if (list.length > 0) {
      return { success: true, data: mergeLocalNorigaeCache(list) };
    }
    // 서버가 빈 배열을 반환했을 때 /api/items/ 경로도 확인
    try {
      const fb = await apiClient.get('/api/items/');
      const fbRaw = fb.data;
      const fbList = Array.isArray(fbRaw) ? fbRaw : Array.isArray(fbRaw?.results) ? fbRaw.results : Array.isArray(fbRaw?.data) ? fbRaw.data : [];
      if (fbList.length > 0) {
        return { success: true, data: mergeLocalNorigaeCache(fbList) };
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
        return { success: true, data: mergeLocalNorigaeCache(fbList) };
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