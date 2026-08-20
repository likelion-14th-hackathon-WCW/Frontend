import { apiClient } from './client.js';

export async function getMyWishlist() {
  const response = await apiClient.get('/auth/me/wishlist/');
  return response.data;
}

export async function addToWishlist(parts) {
  // parts: { knot, tassel, decoration }
  const response = await apiClient.post('/auth/me/wishlist/', parts);
  return response.data;
}

export async function deleteWishlist(id) {
  const response = await apiClient.delete(`/auth/me/wishlist/${id}/`);
  return response.data;
}