import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const clearAuthSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('wcw_user')
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response || error.response.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Skip refresh attempt for auth endpoints
    if (
      originalRequest.url?.includes('/auth/login/') ||
      originalRequest.url?.includes('/auth/signup/') ||
      originalRequest.url?.includes('/auth/token/refresh/')
    ) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refresh_token')

    // If no refresh token exists, clear stale auth data and retry without Authorization header
    if (!refreshToken) {
      clearAuthSession()
      originalRequest._retry = true
      delete originalRequest.headers.Authorization
      return apiClient(originalRequest).catch((retryError) => Promise.reject(retryError))
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          } else {
            delete originalRequest.headers.Authorization
          }
          return apiClient(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const baseURL = rawBaseUrl.replace(/\/$/, '')
    const refreshUrl = `${baseURL}/auth/token/refresh/`

    try {
      const response = await axios.post(refreshUrl, { refresh: refreshToken })
      const newAccessToken = response.data.access
      localStorage.setItem('token', newAccessToken)
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh)
      }

      apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      processQueue(null, newAccessToken)
      return apiClient(originalRequest)
    } catch (refreshError) {
      clearAuthSession()
      processQueue(refreshError, null)
      delete originalRequest.headers.Authorization
      return apiClient(originalRequest).catch(() => Promise.reject(refreshError))
    } finally {
      isRefreshing = false
    }
  }
)
