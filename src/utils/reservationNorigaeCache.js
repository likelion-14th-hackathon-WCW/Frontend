// ponytail: 백엔드가 예약 생성 시 노리개 데이터를 저장/반환하지 않아,
// 예약 확정 시점에 브라우저에 예약 id별로 남겨뒀다가 예약 상세에서 다시 매칭해 보여준다.
// (예약 하나짜리 sessionStorage draft를 그대로 쓰면 여러 예약을 볼 때 전부 같은 이미지로 보이는 문제가 있었음)
const STORAGE_KEY = 'wcw_reservation_norigae_cache'

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export function saveReservationNorigae(reservationId, norigaeData) {
  if (!reservationId || !norigaeData) return
  const cache = readCache()
  cache[reservationId] = norigaeData
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // 저장 실패는 무시 (미리보기 정보가 없어도 기능엔 지장 없음)
  }
}

export function getReservationNorigae(reservationId) {
  if (!reservationId) return null
  return readCache()[reservationId] || null
}
