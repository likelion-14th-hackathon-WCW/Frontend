import { useMemo, useState } from 'react'
import './Reservation.css'
import searchIcon from '../assets/search-icon.svg'
import clockIcon from '../assets/clock-icon.svg'
import chevronLeft from '../assets/chevron-left.svg'
import chevronRight from '../assets/chevron-right.svg'
import { useAuth } from '../hooks/useAuth.js'
import { saveReservationDraft } from '../utils/reservationDraft.js'
import StoreMap from '../components/StoreMap.jsx'

// 출처: MCM 공식 매장 찾기(kr.mcmworldwide.com) 서울 기준 검색 결과 중 대한민국 매장
// kakaoUrl: 카카오맵 장소 상세 페이지 — 지도 마커 클릭 시 새 탭으로 연결
const STORES = [
  {
    id: 'lotte-main',
    name: 'MCM 롯데백화점 본점',
    address: '서울 중구 남대문로 81, 롯데백화점 본점 1F',
    hours: '월-목 10:30-20:00 · 금-일 10:30-20:30',
    kakaoUrl: 'https://place.map.kakao.com/1377183359',
  },
  {
    id: 'haus-flagship',
    name: 'MCM 하우스 플래그십스토어',
    address: '서울 강남구 압구정로 412',
    hours: '매일 11:00-20:00',
    kakaoUrl: 'https://place.map.kakao.com/8048352',
  },
  {
    id: 'lotte-jamsil',
    name: 'MCM 롯데백화점 잠실점',
    address: '서울 송파구 올림픽로 240, 롯데백화점 잠실점 1F',
    hours: '월-목 10:30-20:00 · 금-일 10:30-20:30',
    kakaoUrl: 'https://place.map.kakao.com/1034672903',
  },
  {
    id: 'lotte-daegu',
    name: 'MCM 롯데백화점 대구점',
    address: '대구광역시 북구 태평로 161, 롯데백화점 대구점 B1',
    hours: '월-목 10:30-20:00 · 금-일 10:30-20:30',
    kakaoUrl: 'https://place.map.kakao.com/950172435',
  },
]

const TIME_SLOTS = ['오전 11:00', '오후 12:30', '오후 2:00', '오후 3:30', '오후 5:00', '오후 6:30']

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  )
}

function isPastDay(date, today) {
  return isSameDay(date, today) ? false : date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

function parseTimeSlot(label) {
  const [, meridiem, hourStr, minuteStr] = label.match(/^(오전|오후) (\d{1,2}):(\d{2})$/)
  let hour = Number(hourStr) % 12
  if (meridiem === '오후') hour += 12
  return { hour, minute: Number(minuteStr) }
}

function isPastTimeSlot(label, selectedDate, now) {
  if (!isSameDay(selectedDate, now)) return false
  const { hour, minute } = parseTimeSlot(label)
  return hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes())
}

function buildCalendarDays(viewYear, viewMonth) {
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

  const days = []
  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    days.push({ date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i), inMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    days.push({ date: new Date(viewYear, viewMonth, d), inMonth: true })
  }
  const trailing = (7 - (days.length % 7)) % 7
  for (let d = 1; d <= trailing; d += 1) {
    days.push({ date: new Date(viewYear, viewMonth + 1, d), inMonth: false })
  }
  return days
}

export default function Reservation() {
  const today = useMemo(() => new Date(), [])
  const { user } = useAuth()

  const [query, setQuery] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState(STORES[0].id)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedTime, setSelectedTime] = useState(null)

  const filteredStores = STORES.filter(
    (store) => store.name.includes(query) || store.address.includes(query),
  )
  const selectedStore = STORES.find((store) => store.id === selectedStoreId)
  const calendarDays = useMemo(() => buildCalendarDays(viewYear, viewMonth), [viewYear, viewMonth])

  const goToPrevMonth = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1)
    setViewYear(prev.getFullYear())
    setViewMonth(prev.getMonth())
  }

  const goToNextMonth = () => {
    const next = new Date(viewYear, viewMonth + 1, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const confirmReservation = () => {
    saveReservationDraft({
      storeName: selectedStore?.name,
      dateLabel: `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`,
      timeLabel: selectedTime,
    })
    window.location.href = user ? '/reservation/complete-member' : '/reservation/guest-info'
  }

  return (
    <main className="reservation">
      <div className="reservation__intro">
        <h1 className="reservation__title">방문 예약</h1>
        <p className="reservation__subtitle">
          부티크를 선택하고 개인 상담을 예약하여 당사의 모던 헤리티지 컬렉션을 만나보세요.
        </p>
      </div>

      <div className="reservation__layout">
        <div className="reservation__main">
          <section className="reservation__section">
            <h2 className="reservation__section-title">1. 매장 선택</h2>

            <div className="store-search">
              <img className="store-search__icon" src={searchIcon} alt="" />
              <input
                className="store-search__input"
                type="text"
                placeholder="도시 또는 우편번호 검색"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="store-list">
              {filteredStores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  className={`store-card${store.id === selectedStoreId ? ' store-card--selected' : ''}`}
                  onClick={() => setSelectedStoreId(store.id)}
                >
                  <div className="store-card__top">
                    <span className="store-card__name">{store.name}</span>
                    {store.id === selectedStoreId && <span className="store-card__badge">선택됨</span>}
                  </div>
                  <div className="store-card__meta">
                    <span className="store-card__address">{store.address}</span>
                    <span className="store-card__hours">
                      <img src={clockIcon} alt="" />
                      {store.hours}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="reservation__date-section">
            <div className="reservation__calendar-col">
              <h2 className="reservation__section-title">2. 날짜 및 시간 선택</h2>

              <div className="calendar">
                <div className="calendar__header">
                  <button type="button" className="calendar__nav" onClick={goToPrevMonth} aria-label="이전 달">
                    <img src={chevronLeft} alt="" />
                  </button>
                  <span className="calendar__month">
                    {viewYear}년 {viewMonth + 1}월
                  </span>
                  <button type="button" className="calendar__nav" onClick={goToNextMonth} aria-label="다음 달">
                    <img src={chevronRight} alt="" />
                  </button>
                </div>

                <div className="calendar__weekdays">
                  {WEEKDAYS.map((day) => (
                    <span key={day} className="calendar__weekday">
                      {day}
                    </span>
                  ))}
                </div>

                <div className="calendar__grid">
                  {calendarDays.map(({ date, inMonth }) => {
                    const isSelected = inMonth && isSameDay(date, selectedDate)
                    const isPast = inMonth && isPastDay(date, today)
                    const disabled = !inMonth || isPast
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        disabled={disabled}
                        className={`calendar__day${isSelected ? ' calendar__day--selected' : ''}${disabled ? ' calendar__day--muted' : ''}`}
                        onClick={() => {
                          setSelectedDate(date)
                          setSelectedTime(null)
                        }}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="reservation__time-col">
              <span className="reservation__time-heading">
                {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 예약 가능 시간
              </span>
              <div className="time-slots">
                {TIME_SLOTS.map((time) => {
                  const unavailable = isPastTimeSlot(time, selectedDate, today)
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={unavailable}
                      className={`time-slot${time === selectedTime ? ' time-slot--selected' : ''}${unavailable ? ' time-slot--disabled' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        </div>

        <aside className="summary">
          <div className="summary__card">
            <h3 className="summary__title">예약 내역 확인</h3>

            <div className="summary__rows">
              <div className="summary__row">
                <span className="summary__label">매장</span>
                <span className="summary__value">{selectedStore?.name}</span>
              </div>
              <div className="summary__row">
                <span className="summary__label">날짜</span>
                <span className="summary__value">
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                </span>
              </div>
              <div className="summary__row">
                <span className="summary__label">시간</span>
                <span className="summary__value">{selectedTime ?? '시간을 선택해주세요'}</span>
              </div>
            </div>

            <button type="button" className="summary__cta" disabled={!selectedTime} onClick={confirmReservation}>
              예약 확정하기
            </button>
          </div>

          {/* 선택한 매장 위치를 카카오맵으로 표시. 매장 선택 시 해당 위치로 자동 포커스 */}
          <StoreMap stores={STORES} selectedStoreId={selectedStoreId} />
        </aside>
      </div>
    </main>
  )
}
