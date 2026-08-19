import { apiClient } from './client.js'

export const getMe = async () => {
  try {
    const response = await apiClient.get('/auth/me/')
    return { success: true, data: response.data }
  } catch {
    return { success: false, message: '프로필 정보를 불러오지 못했습니다.' }
  }
}

export const getMyReservations = async () => {
  try {
    const response = await apiClient.get('/auth/me/reservations/')
    return { success: true, data: response.data }
  } catch {
    return { success: false, message: '예약 내역을 불러오지 못했습니다.' }
  }
}

export const getMyItems = async () => {
  try {
    const response = await apiClient.get('/auth/me/items/')
    return { success: true, data: response.data }
  } catch {
    return { success: false, message: '저장된 노리개 디자인을 불러오지 못했습니다.' }
  }
}

export const getMyOwnerships = async () => {
  try {
    const response = await apiClient.get('/auth/me/ownerships/')
    return { success: true, data: response.data }
  } catch {
    return { success: false, message: '소유권 정보를 불러오지 못했습니다.' }
  }
}
