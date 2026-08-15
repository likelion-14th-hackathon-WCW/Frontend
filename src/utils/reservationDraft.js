const KEY = 'wcw_reservation_draft'

export function saveReservationDraft(draft) {
  sessionStorage.setItem(KEY, JSON.stringify(draft))
}

export function readReservationDraft() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
