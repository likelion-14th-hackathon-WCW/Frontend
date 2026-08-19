import { useEffect, useState } from 'react'
import ReservationCompleteCard from '../components/ReservationCompleteCard.jsx'
import { readReservationDraft } from '../utils/reservationDraft.js'

export default function ReservationCompleteGuest() {
  const [draft] = useState(readReservationDraft)

  useEffect(() => {
    if (!draft) window.location.href = '/'
  }, [draft])

  if (!draft) return null

  return (
    <ReservationCompleteCard
      subtitle="고객님의 예약이 성공적으로 완료되었습니다. 방문을 기다리겠습니다."
      draft={draft}
      ctaHref="/reservation/lookup"
    />
  )
}
