import './ReservationCompleteCard.css'
import successCheckIcon from '../assets/success-check-large.svg'
import markerPinIcon from '../assets/marker-pin-icon.svg'
import calendarIcon from '../assets/calendar-icon.svg'
import alarmClockIcon from '../assets/alarm-clock-icon.svg'
import infoIcon from '../assets/info-icon.svg'
import { formatReservationNumber } from '../utils/reservationNumber.js'

export default function ReservationCompleteCard({ subtitle, draft, ctaHref = '/mypage' }) {
  const reservationNumber = formatReservationNumber(draft)
  const ctaLabel = ctaHref === '/mypage' ? '마이페이지' : '예약 확인 페이지'
  const notes = [
    '상담 시간은 약 1시간 정도 소요됩니다.',
    '예약 시간 10분 전까지 매장에 도착해 주시기 바랍니다.',
    `예약 변경 및 취소는 방문 24시간 전까지 ${ctaLabel}에서 가능합니다.`,
  ]

  return (
    <main className="reservation-complete">
      <div className="reservation-complete__card">
        <div className="reservation-complete__icon">
          <img src={successCheckIcon} alt="" />
        </div>

        <h1 className="reservation-complete__title">예약이 확정되었습니다</h1>
        <p className="reservation-complete__subtitle">{subtitle}</p>

        <div className="reservation-complete__details">
          <div className="reservation-complete__number-row">
            <span className="reservation-complete__number-label">예약 번호</span>
            <span className="reservation-complete__number-value">{reservationNumber}</span>
          </div>

          <div className="reservation-complete__info-row">
            <div className="reservation-complete__info-item">
              <div className="reservation-complete__info-heading">
                <img src={markerPinIcon} alt="" />
                <span>방문 매장</span>
              </div>
              <span className="reservation-complete__info-value">{draft.storeName}</span>
            </div>
            <div className="reservation-complete__info-item">
              <div className="reservation-complete__info-heading">
                <img src={calendarIcon} alt="" />
                <span>방문 일자</span>
              </div>
              <span className="reservation-complete__info-value">{draft.dateLabel}</span>
            </div>
            <div className="reservation-complete__info-item">
              <div className="reservation-complete__info-heading">
                <img src={alarmClockIcon} alt="" />
                <span>방문 시간</span>
              </div>
              <span className="reservation-complete__info-value">{draft.timeLabel}</span>
            </div>
          </div>
        </div>

        <a href={ctaHref} className="reservation-complete__cta">
          예약 확인하기
        </a>

        <div className="reservation-complete__notes">
          <h2 className="reservation-complete__notes-title">예약 유의사항</h2>
          <ul className="reservation-complete__notes-list">
            {notes.map((note) => (
              <li key={note}>
                <img src={infoIcon} alt="" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
