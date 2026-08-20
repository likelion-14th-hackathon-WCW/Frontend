import { readReservationDraft } from './reservationDraft.js'
import { getReservationNorigae } from './reservationNorigaeCache.js'
import { buildNorigaeData } from './norigaeAssets.js'

// ponytail: 비회원 예약 조회 API가 없어 노리개 데이터를 응답으로 못 받음 —
// 예약 확정 시 남겨둔 예약 id별 캐시(localStorage), 없으면 같은 세션의 드래프트(sessionStorage)로 대체
export function resolveGuestNorigaePreview(reservation) {
  if (reservation?.norigaeData) {
    const built = buildNorigaeData(reservation.norigaeData)
    if (built) return built
  }

  const cached = getReservationNorigae(reservation?.id ?? reservation?.reservationNumber)
  if (cached) {
    const built = buildNorigaeData(cached)
    if (built) return built
  }

  const draft = readReservationDraft()
  if (draft?.norigaeData) {
    const built = buildNorigaeData(draft.norigaeData)
    if (built) return built
  }

  return null
}
