import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MyPageSidebar from '../components/MyPageSidebar.jsx'
import ReservationSummaryCard from '../components/ReservationSummaryCard.jsx'
import NorigaePreview from '../components/NorigaePreview.jsx'
import StoreMap from '../components/StoreMap.jsx'
import { getMyReservations, getMyItems } from '../api/mypage.js'
import { getCurrentSeason } from '../api/season.js'
import { readReservationDraft } from '../utils/reservationDraft.js'
import { getReservationNorigae } from '../utils/reservationNorigaeCache.js'
import { formatReservationNumber } from '../utils/reservationNumber.js'
import { buildNorigaeData } from '../utils/norigaeAssets.js'
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
  const [items, setItems] = useState([])
  const [seasonTag, setSeasonTag] = useState('')

  useEffect(() => {
    getMyReservations().then((result) => {
      setReservations(result.success ? result.data || [] : [])
    })
    getMyItems().then((result) => {
      if (result.success) setItems(result.data || [])
    })
    // ponytail: 시즌 태그는 현재 활성 시즌을 그대로 보여줌(예약 시점 시즌과 매칭하는 필드가 없음)
    getCurrentSeason().then((season) => {
      if (season?.name) setSeasonTag(`${season.name.replace(/^\d+\s*/, '')} 시즌`)
    })
  }, [])

  const reservation = useMemo(() => {
    if (!reservations) return null
    return reservations.find((r) => String(r.id ?? r.reservation_id) === id) || null
  }, [reservations, id])

  const storeName = reservation?.store_name || reservation?.store || ''
  const storeInfo = STORE_INFO[storeName]
  const isCancelled = reservation?.status === '취소' || reservation?.status === '취소됨' || reservation?.status === '예약 취소'
  const isCompleted = reservation?.status === '완료' || reservation?.status === '완료됨' || reservation?.status === '방문 완료' || reservation?.status === '방문완료' || reservation?.status === '이용 완료' || reservation?.status === '이용완료'
  const reservationNumber = formatReservationNumber(reservation)

  // 예약과 연결된 노리개 원본 데이터를 우선순위대로 찾는다 (아직 조합 이미지로 빌드하지 않은 원본 객체).
  const norigaeSource = useMemo(() => {
    if (!reservation) return null
    const reservationId = reservation.id ?? reservation.reservation_id

    // 1. 예약 확정 시 이 예약 id로 캐싱해둔 노리개 데이터 (가장 신뢰도 높음 — 예약별로 구분됨)
    const cached = getReservationNorigae(reservationId)
    if (cached) return cached

    // 2. 예약 객체 자체에 노리개 데이터가 있는 경우
    if (reservation.norigaeData || reservation.norigae_data) {
      return reservation.norigaeData || reservation.norigae_data
    }

    // 3. 예약 객체에 매듭/장식/술 부품 필드가 직접 있는 경우
    if (buildNorigaeData(reservation)?.knotImage) return reservation

    // 4. 예약과 연계된 아이템이 있는 경우
    if (reservation.item || reservation.item_id) {
      const targetItemId = reservation.item_id ?? (typeof reservation.item === 'object' ? reservation.item.id : reservation.item)
      const matched = items.find((item) => (item.id ?? item.item_id) === targetItemId)
      if (matched) return matched
    }

    // 5. 이 예약 id로 캐싱된 데이터가 없을 때만: 방금 작성한 예약 드래프트를 최후의 보정값으로 사용
    //    (id가 아직 없던 시점에 저장된 구버전 예약 등, 그 외엔 매칭 정보가 전혀 없는 경우)
    const draft = readReservationDraft()
    if (!reservationId && draft?.norigaeData) return draft.norigaeData

    return null
  }, [reservation, items])

  // 위시리스트에서 캐싱된 실제 이미지가 있으면 자동 조합 렌더링보다 그 이미지를 우선한다
  // (WishlistGrid/WishlistDesignDetail과 동일한 우선순위).
  const previewImageSrc =
    norigaeSource?.image ||
    reservation?.image_url ||
    reservation?.thumbnail ||
    reservation?.norigae_image

  const previewData = useMemo(() => {
    if (previewImageSrc) return null
    return norigaeSource ? buildNorigaeData(norigaeSource) : null
  }, [norigaeSource, previewImageSrc])

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
          ) : isCompleted ? (
            <span className="reservation-detail__tag reservation-detail__tag--completed">방문 완료</span>
          ) : (
            seasonTag && <span className="reservation-detail__tag">{seasonTag}</span>
          )}
        </div>

        <div className="reservation-detail__summary-row">
          <div className={`reservation-detail__image-container${isCancelled ? ' reservation-detail__image-container--cancelled' : ''}`}>
            <NorigaePreview
              imageSrc={previewImageSrc}
              norigaeData={previewData}
            />
          </div>
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
