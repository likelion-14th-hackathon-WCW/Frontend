import { apiClient } from './client.js'
import { syncNotificationSettingsOnSignup } from '../utils/notificationSettings.js'

const storeSession = ({ user, token }) => {
  localStorage.setItem('token', token.access)
  localStorage.setItem('refresh_token', token.refresh)
  localStorage.setItem('wcw_user', JSON.stringify(user))
}

const extractErrorMessage = (error, fallback) => {
  const data = error.response?.data
  if (!data) return fallback
  const firstValue = Object.values(data)[0]
  return Array.isArray(firstValue) ? firstValue[0] : data.detail || fallback
}

export const signup = async ({
  email,
  name,
  nickname,
  phone,
  password,
  passwordConfirm,
  agreements = {},
}) => {
  try {
    const response = await apiClient.post('/auth/signup/', {
      email,
      name,
      nickname,
      phone,
      password,
      password_confirm: passwordConfirm,
      agreed_terms: true,
      agreed_email_marketing: Boolean(agreements.newsletter),
      agreed_sms_notification: Boolean(agreements.sms),
      agreed_marketing: Boolean(agreements.marketing),
      notifications: {
        email: Boolean(agreements.newsletter),
        sms: Boolean(agreements.sms),
        marketing: Boolean(agreements.marketing),
      },
    })
    storeSession(response.data)
    syncNotificationSettingsOnSignup(agreements)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: extractErrorMessage(error, '회원가입 중 오류가 발생했습니다.') }
  }
}

export const login = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/auth/login/', { email, password })
    storeSession(response.data)
    return { success: true, data: response.data }
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }
    return { success: false, message: extractErrorMessage(error, '로그인 중 오류가 발생했습니다.') }
  }
}

export const logout = async () => {
  const refresh = localStorage.getItem('refresh_token')
  try {
    if (refresh) {
      await apiClient.post('/auth/logout/', { refresh })
    }
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('wcw_user')
  }
}
