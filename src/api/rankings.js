import { apiClient } from './client.js'

export async function getRankings() {
  const { data } = await apiClient.get('/api/rankings/')
  return data
}
