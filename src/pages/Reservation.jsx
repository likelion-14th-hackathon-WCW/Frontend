import { useEffect, useMemo, useState } from 'react'
import './Reservation.css'
import searchIcon from '../assets/search-icon.svg'
import clockIcon from '../assets/clock-icon.svg'
import chevronLeft from '../assets/chevron-left.svg'
import chevronRight from '../assets/chevron-right.svg'
import { useAuth } from '../hooks/useAuth.js'
import { saveReservationDraft } from '../utils/reservationDraft.js'
import { getStores, getBookedTimes, createReservation } from '../api/reservations.js'
import StoreMap from '../components/StoreMap.jsx'

const TIME_SLOTS = ['오전 11:00', '오후 12:30', '오후 2:00', '오후 3:30', '오후 5:00', '오후 6:30']

function toStoreView(store) {
  return {
    id: store.id,
    name: store.name,
    address: store.address,
    hours: `${store.open_time.slice(0, 5)}-${store.close_time.slice(0, 5)}`,
    postalCode: '',
  }
}

function formatDateParam(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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

function toTimeParam(label) {
  const { hour, minute } = parseTimeSlot(label)
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
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
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [stores, setStores] = useState([])
  const [bookedTimes, setBookedTimes] = useState([])
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getStores().then((result) => {
      if (result.success) setStores(result.data.map(toStoreView))
    })
  }, [])

  useEffect(() => {
    setBookedTimes([])
    if (!selectedStoreId || !selectedDate) return
    getBookedTimes(selectedStoreId, formatDateParam(selectedDate)).then((result) => {
      if (result.success) setBookedTimes(result.data)
    })
  }, [selectedStoreId, selectedDate])

  const filteredStores = stores.filter(
    (store) => store.name.includes(query) || store.address.includes(query) || store.postalCode.includes(query),
  )
  const selectedStore = stores.find((store) => store.id === selectedStoreId)
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

  const confirmReservation = async () => {
    const reservedAt = `${formatDateParam(selectedDate)}T${toTimeParam(selectedTime)}:00`
    const draft = {
      storeId: selectedStore.id,
      reservedAt,
      storeName: selectedStore.name,
      dateLabel: `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`,
      timeLabel: selectedTime,
    }

    if (!user) {
      saveReservationDraft(draft)
      window.location.href = '/reservation/guest-info'
      return
    }

    setSubmitError('')
    setIsSubmitting(true)
    const result = await createReservation({ store: selectedStore.id, reservedAt })
    setIsSubmitting(false)
    if (!result.success) {
      setSubmitError(result.message)
      return
    }
    saveReservationDraft(draft)
    window.location.href = '/reservation/complete-member'
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
                  onClick={() => {
                    setSelectedStoreId(store.id)
                    setSelectedDate(today)
                    setSelectedTime(null)
                  }}
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

          {selectedStore && (
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
                      const isSelected = inMonth && selectedDate && isSameDay(date, selectedDate)
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

              {selectedDate && (
                <div className="reservation__time-col">
                  <span className="reservation__time-heading">
                    {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 예약 가능 시간
                  </span>
                  <div className="time-slots">
                    {TIME_SLOTS.map((time) => {
                      const unavailable =
                        isPastTimeSlot(time, selectedDate, today) || bookedTimes.includes(toTimeParam(time))
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
              )}
            </section>
          )}
        </div>

        <aside className="summary-col">
          <div className="summary">
            <h3 className="summary__title">예약 내역 확인</h3>

            <div className="summary__rows">
              <div className="summary__row">
                <span className={`summary__label${selectedStore ? ' summary__label--filled' : ''}`}>매장</span>
                <span className="summary__value">{selectedStore?.name}</span>
              </div>
              <div className="summary__row">
                <span className={`summary__label${selectedDate ? ' summary__label--filled' : ''}`}>날짜</span>
                <span className="summary__value">
                  {selectedDate &&
                    `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`}
                </span>
              </div>
              <div className="summary__row">
                <span className={`summary__label${selectedTime ? ' summary__label--filled' : ''}`}>시간</span>
                <span className="summary__value">{selectedTime}</span>
              </div>
            </div>

            {submitError && <p className="reservation__error">{submitError}</p>}

            <button
              type="button"
              className="summary__cta"
              disabled={!selectedTime || isSubmitting}
              onClick={confirmReservation}
            >
              {isSubmitting ? '예약 중...' : '예약 확정하기'}
            </button>
          </div>

          <StoreMap stores={stores} selectedStoreId={selectedStoreId} />
        </aside>
      </div>
    </main>
  )
}
