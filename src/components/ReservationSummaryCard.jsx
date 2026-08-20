import './ReservationSummaryCard.css'

export default function ReservationSummaryCard({ heading, email, reservationNumber, storeName, dateLabel, cancelled = false }) {
  return (
    <div className={`reservation-summary-card${cancelled ? ' reservation-summary-card--cancelled' : ''}`}>
      <div className="reservation-summary-card__header">
        <h3 className="reservation-summary-card__heading">{heading}</h3>
      </div>
      <div className="reservation-summary-card__body">
        {email && (
          <div className="reservation-summary-card__row">
            <span className="reservation-summary-card__label">이메일</span>
            <span className="reservation-summary-card__value">{email}</span>
          </div>
        )}
        <div className="reservation-summary-card__row">
          <span className="reservation-summary-card__label">예약 번호</span>
          <span className="reservation-summary-card__value">{reservationNumber}</span>
        </div>
        <div className="reservation-summary-card__row">
          <span className="reservation-summary-card__label">스토어</span>
          <span className="reservation-summary-card__value">{storeName}</span>
        </div>
        <div className="reservation-summary-card__row reservation-summary-card__row--last">
          <span className="reservation-summary-card__label">예약 일시</span>
          <span className="reservation-summary-card__value">{dateLabel}</span>
        </div>
      </div>
    </div>
  )
}
