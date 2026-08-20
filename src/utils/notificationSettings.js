const NOTIFICATION_STORAGE_KEY = 'wcw_notifications'
const USER_STORAGE_KEY = 'wcw_user'

export const DEFAULT_NOTIFICATION_SETTINGS = {
  email: false, // 이메일 프로모션/뉴스레터 알림
  sms: false, // 카카오톡/문자 예약 및 마케팅 알림
  marketing: false, // 마케팅 활용 동의
}

/**
 * 저장된 알림 설정 상태를 조회합니다.
 * @returns {{ email: boolean, sms: boolean, marketing: boolean }}
 */
export function getNotificationSettings() {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY)
    if (raw) return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) }

    const userRaw = localStorage.getItem(USER_STORAGE_KEY)
    if (userRaw) {
      const user = JSON.parse(userRaw)
      if (user.notifications) {
        return { ...DEFAULT_NOTIFICATION_SETTINGS, ...user.notifications }
      }
    }
  } catch {
    // ignore parse error
  }
  return { ...DEFAULT_NOTIFICATION_SETTINGS }
}

/**
 * 알림 설정 상태를 저장합니다. (마이페이지 설정 토글 등에서 활용)
 * @param {{ email?: boolean, sms?: boolean, marketing?: boolean }} settings
 */
export function saveNotificationSettings(settings) {
  try {
    const current = getNotificationSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated))

    const userRaw = localStorage.getItem(USER_STORAGE_KEY)
    if (userRaw) {
      const user = JSON.parse(userRaw)
      user.notifications = updated
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    }
    return updated
  } catch {
    return settings
  }
}

/**
 * 회원가입 시 선택한 약관 동의 상태를 알림 설정으로 동기화하여 저장합니다.
 * @param {Record<string, boolean>} agreements
 */
export function syncNotificationSettingsOnSignup(agreements = {}) {
  const settings = {
    email: Boolean(agreements.newsletter),
    sms: Boolean(agreements.sms),
    marketing: Boolean(agreements.marketing),
  }
  return saveNotificationSettings(settings)
}
