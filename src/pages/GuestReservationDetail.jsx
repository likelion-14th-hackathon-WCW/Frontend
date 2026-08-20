import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ReservationSummaryCard from '../components/ReservationSummaryCard.jsx'
import NorigaePreview from '../components/NorigaePreview.jsx'
import StoreMap from '../components/StoreMap.jsx'
import { STORE_INFO } from '../data/storeInfo.js'
import chevronLeft from '../assets/chevron-left.svg'
import './GuestReservationDetail.css'

export default function GuestReservationDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const reservation = location.state?.reservation

  useEffect(() => {
    if (!reservation) navigate('/reservation/lookup', { replace: true })
  }, [reservation, navigate])

  if (!reservation) return null

  const storeInfo = STORE_INFO[reservation.storeName]

  const stores = [
    {
      id: 1,
      name: reservation.storeName,
      address: storeInfo?.address || '',
      kakaoUrl: storeInfo?.kakaoUrl,
    },
  ]

  return (
    <main className="guest-reservation-detail">
      <div className="guest-reservation-detail__header">
        <div className="guest-reservation-detail__title-group">
          <button
            type="button"
            className="guest-reservation-detail__back"
            onClick={() => navigate('/reservation/lookup')}
            aria-label="뒤로 가기"
          >
            <img src={chevronLeft} alt="" />
          </button>
          <h1 className="guest-reservation-detail__title">예약 상세 내역</h1>
        </div>
        <span className="guest-reservation-detail__tag">방문 예정</span>
      </div>

      <div className="guest-reservation-detail__summary-row">
        <div className="guest-reservation-detail__image-container">
          <NorigaePreview imageSrc={reservation.imageSrc} norigaeData={reservation.norigaeData} />
        </div>
        <ReservationSummaryCard
          heading="예약 정보"
          email={reservation.email}
          reservationNumber={reservation.reservationNumber}
          storeName={reservation.storeName}
          dateLabel={reservation.dateLabel}
        />
      </div>

      <section className="guest-reservation-detail__store-section">
        <h2 className="guest-reservation-detail__store-heading">스토어 위치 안내</h2>
        <div className="guest-reservation-detail__store-body">
          <StoreMap stores={stores} selectedStoreId={stores[0].id} />
          <div className="guest-reservation-detail__store-info">
            <div className="guest-reservation-detail__info-block">
              <span className="guest-reservation-detail__info-label">ADDRESS</span>
              <span className="guest-reservation-detail__info-value">{storeInfo?.address || '-'}</span>
            </div>
            <div className="guest-reservation-detail__info-block">
              <span className="guest-reservation-detail__info-label">CONTACT</span>
              <span className="guest-reservation-detail__info-value">{storeInfo?.tel || '-'}</span>
            </div>
            <div className="guest-reservation-detail__info-block">
              <span className="guest-reservation-detail__info-label">OPERATING HOURS</span>
              <span className="guest-reservation-detail__info-value">{storeInfo?.hours || '-'}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="guest-reservation-detail__actions">
        <button
          type="button"
          className="guest-reservation-detail__cancel-btn"
          onClick={() => navigate('/reservation/lookup/cancel', { state: { reservation } })}
        >
          예약 취소하기
        </button>
      </div>
    </main>
  )
}
