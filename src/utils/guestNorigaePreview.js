import { readReservationDraft } from './reservationDraft.js'
import { buildNorigaeData } from './norigaeAssets.js'

// ponytail: 비회원 예약 조회 API가 없어 노리개 데이터를 응답으로 못 받음 —
// 같은 브라우저 세션에 남아있는 예약 작성 드래프트(sessionStorage)로 대체
export function resolveGuestNorigaePreview(reservation) {
  if (reservation?.norigaeData) {
    const built = buildNorigaeData(reservation.norigaeData)
    if (built) return built
  }

  const draft = readReservationDraft()
  if (draft?.norigaeData) {
    const built = buildNorigaeData(draft.norigaeData)
    if (built) return built
  }

  return null
}
