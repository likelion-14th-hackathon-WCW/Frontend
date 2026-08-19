import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MyPageSidebar from '../components/MyPageSidebar.jsx'
import ReservationSummaryCard from '../components/ReservationSummaryCard.jsx'
import StoreMap from '../components/StoreMap.jsx'
import { getMyReservations } from '../api/mypage.js'
import { getCurrentSeason } from '../api/season.js'
import { STORE_INFO } from '../data/storeInfo.js'
import chevronLeft from '../assets/chevron-left.svg'
import './MyPageReservationDetail.css'

function formatReservedAt(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString

  const hour24 = date.getHours()
  const meridiem = hour24 < 12 ? '오전' : '오후'
  const hour12 = hour24 % 12 || 12
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${meridiem} ${hour12}시 ${minute}분`
}

export default function MyPageReservationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [reservations, setReservations] = useState(null)
  const [seasonTag, setSeasonTag] = useState('')

  useEffect(() => {
    getMyReservations().then((result) => {
      setReservations(result.success ? result.data || [] : [])
    })
    // ponytail: 시즌 태그는 현재 활성 시즌을 그대로 보여줌(예약 시점 시즌과 매칭하는 필드가 없음)
    getCurrentSeason().then((season) => {
      if (season?.name) setSeasonTag(`${season.name.replace(/^\d+\s*/, '')} 시즌`)
    })
  }, [])

  if (reservations === null) {
    return (
      <div className="mypage-wrapper">
        <MyPageSidebar active="reservations" />
        <main className="mypage-content">
          <p className="reservation-detail__loading">불러오는 중...</p>
        </main>
      </div>
    )
  }

  const reservation = reservations.find((r) => String(r.id ?? r.reservation_id) === id)

  if (!reservation) {
    return (
      <div className="mypage-wrapper">
        <MyPageSidebar active="reservations" />
        <main className="mypage-content">
          <p className="reservation-detail__loading">예약 내역을 찾을 수 없습니다.</p>
        </main>
      </div>
    )
  }

  const storeName = reservation.store_name || reservation.store || ''
  const storeInfo = STORE_INFO[storeName]
  const isCancelled = reservation.status === '취소'
  const reservationNumber = reservation.reservation_number || `MCM-${reservation.id ?? reservation.reservation_id}`

  const stores = [
    {
      id: reservation.store_id ?? reservation.id ?? 1,
      name: storeName,
      address: storeInfo?.address || '',
      kakaoUrl: storeInfo?.kakaoUrl,
    },
  ]

  return (
    <div className="mypage-wrapper">
      <MyPageSidebar active="reservations" />
      <main className="mypage-content">
        <div className="reservation-detail__header">
          <div className="reservation-detail__title-group">
            <button
              type="button"
              className="reservation-detail__back"
              onClick={() => navigate('/mypage/reservations')}
              aria-label="뒤로 가기"
            >
              <img src={chevronLeft} alt="" />
            </button>
            <h2 className="reservation-detail__title">예약 상세 내역</h2>
          </div>
          {isCancelled ? (
            <span className="reservation-detail__tag reservation-detail__tag--cancelled">예약 취소</span>
          ) : (
            seasonTag && <span className="reservation-detail__tag">{seasonTag}</span>
          )}
        </div>

        <div className="reservation-detail__summary-row">
          <div className={`reservation-detail__image-placeholder${isCancelled ? ' reservation-detail__image-placeholder--cancelled' : ''}`} />
          <ReservationSummaryCard
            heading={isCancelled ? '예약 취소 정보' : '예약 정보'}
            reservationNumber={reservationNumber}
            storeName={storeName}
            dateLabel={formatReservedAt(reservation.reserved_at || reservation.reservation_date)}
            cancelled={isCancelled}
          />
        </div>

        <section className="reservation-detail__store-section">
          <h3 className="reservation-detail__store-heading">스토어 위치 안내</h3>
          <div className="reservation-detail__store-body">
            <StoreMap stores={stores} selectedStoreId={stores[0].id} />
            <div className="reservation-detail__store-info">
              <div className="reservation-detail__info-block">
                <span className="reservation-detail__info-label">ADDRESS</span>
                <span className="reservation-detail__info-value">{storeInfo?.address || '-'}</span>
              </div>
              <div className="reservation-detail__info-block">
                <span className="reservation-detail__info-label">CONTACT</span>
                <span className="reservation-detail__info-value">{storeInfo?.tel || '-'}</span>
              </div>
              <div className="reservation-detail__info-block">
                <span className="reservation-detail__info-label">OPERATING HOURS</span>
                <span className="reservation-detail__info-value">{storeInfo?.hours || '-'}</span>
              </div>
            </div>
          </div>
        </section>

        {!isCancelled && (
          <div className="reservation-detail__actions">
            <button
              type="button"
              className="reservation-detail__cancel-btn"
              onClick={() => navigate(`/mypage/reservations/${id}/cancel`)}
            >
              예약 취소하기
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
