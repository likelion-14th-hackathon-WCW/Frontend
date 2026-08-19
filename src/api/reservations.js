import { apiClient } from './client.js'

export const getStores = async () => {
  try {
    const response = await apiClient.get('/api/reservations/stores/')
    return { success: true, data: response.data }
  } catch {
    return { success: false, message: '매장 목록을 불러오지 못했습니다.' }
  }
}

export const getBookedTimes = async (storeId, date) => {
  try {
    const response = await apiClient.get('/api/reservations/booked/', { params: { store: storeId, date } })
    return { success: true, data: response.data.booked_times }
  } catch {
    return { success: false, message: '예약 가능 시간을 불러오지 못했습니다.' }
  }
}

export const createReservation = async ({ store, reservedAt, guestId, guestPassword }) => {
  try {
    const payload = { store, reserved_at: reservedAt }
    if (guestId) {
      payload.guest_id = guestId
      payload.guest_password = guestPassword
    }
    const response = await apiClient.post('/api/reservations/', payload)
    return { success: true, data: response.data }
  } catch (error) {
    if (error.response?.status === 409) {
      return { success: false, message: error.response.data.detail }
    }
    return { success: false, message: '예약 중 오류가 발생했습니다.' }
  }
}
