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
  const response = await apiClient.get('/auth/me/items/');
  return { success: true, data: response.data };
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