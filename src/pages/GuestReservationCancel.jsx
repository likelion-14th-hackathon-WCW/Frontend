import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ReservationSummaryCard from '../components/ReservationSummaryCard.jsx'
import NorigaePreview from '../components/NorigaePreview.jsx'
import { resolveGuestNorigaePreview } from '../utils/guestNorigaePreview.js'
import infoIcon from '../assets/info-icon.svg'
import './GuestReservationCancel.css'

const CANCEL_REASONS = ['일정 변경', '매장 방문 불가', '단순 변심', '기타']

export default function GuestReservationCancel() {
  const navigate = useNavigate()
  const location = useLocation()
  const reservation = location.state?.reservation
  const previewData = useMemo(() => resolveGuestNorigaePreview(reservation), [reservation])
  const [selectedReason, setSelectedReason] = useState(null)

  useEffect(() => {
    if (!reservation) navigate('/reservation/lookup', { replace: true })
  }, [reservation, navigate])

  if (!reservation) return null

  const handleSelectReason = (reason) => {
    setSelectedReason((prev) => (prev === reason ? null : reason))
  }

  // ponytail: 비회원 예약 취소 API가 아직 없음(docs/reservation-lookup-api-todo.md) — 홈으로 되돌아감
  const handleCancel = () => {
    if (!selectedReason) return
    navigate('/', { replace: true })
  }

  return (
    <main className="guest-cancel">
      <div className="guest-cancel__header">
        <h1 className="guest-cancel__title">예약 취소</h1>
      </div>

      <div className="guest-cancel__summary-row">
        <div className="guest-cancel__image-container">
          <NorigaePreview imageSrc={reservation.imageSrc} norigaeData={previewData} />
        </div>
        <ReservationSummaryCard
          heading="예약 정보"
          email={reservation.email}
          reservationNumber={reservation.reservationNumber}
          storeName={reservation.storeName}
          dateLabel={reservation.dateLabel}
        />
      </div>

      <section className="guest-cancel__reason-section">
        <div className="guest-cancel__reason-heading">
          <h2>취소 사유를 선택해주세요</h2>
          <p className="guest-cancel__reason-helper">※ 취소 사유 선택 후 예약 취소가 가능합니다.</p>
        </div>
        <div className="guest-cancel__reason-grid">
          {CANCEL_REASONS.map((reason) => (
            <button
              type="button"
              key={reason}
              className={`guest-cancel__reason-btn${selectedReason === reason ? ' guest-cancel__reason-btn--active' : ''}`}
              onClick={() => handleSelectReason(reason)}
            >
              {reason}
            </button>
          ))}
        </div>
      </section>

      <div className="guest-cancel__warning-box">
        <img src={infoIcon} alt="" className="guest-cancel__warning-icon" />
        <div className="guest-cancel__warning-text">
          <p className="guest-cancel__warning-kr">
            취소 후에는 복구가 불가능하며, 동일한 시간에 재예약이 어려울 수 있습니다.
          </p>
          <p className="guest-cancel__warning-en">
            Please note that cancellations cannot be undone, and rebooking at the same time may not be possible.
          </p>
        </div>
      </div>

      <div className="guest-cancel__actions">
        <button
          type="button"
          className="guest-cancel__btn-keep"
          onClick={() => navigate('/reservation/lookup/detail', { state: { reservation } })}
        >
          예약 유지하기
        </button>
        <button
          type="button"
          className="guest-cancel__btn-confirm"
          disabled={!selectedReason}
          onClick={handleCancel}
        >
          예약 취소하기
        </button>
      </div>
    </main>
  )
}
