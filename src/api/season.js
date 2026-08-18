import { apiClient } from './client.js'

export async function getCurrentSeason() {
  try {
    const { data } = await apiClient.get('/api/season/current/')
    return data
  } catch (error) {
    if (error.response?.status === 404) return null
    throw error
  }
}

export async function getComponents({ type, season } = {}) {
  const { data } = await apiClient.get('/api/components/', { params: { type, season } })
  return data
}
