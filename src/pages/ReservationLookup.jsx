import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ReservationLookup.css'
import mailIcon from '../assets/mail-icon.svg'
import lockIcon from '../assets/lock-icon.svg'
import eyeOffIcon from '../assets/eye-toggle-icon.svg'
import eyeOpenIcon from '../assets/eye-open-icon.svg'

export default function ReservationLookup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const canSubmit = email.trim().length > 0 && password.length > 0

  // ponytail: 비회원 예약 조회 API가 아직 명세에 없음(docs/reservation-lookup-api-todo.md) — 실제 API가 생기면
  // 여기서 예약 데이터를 받아와 GuestReservationDetail로 넘기면 됨. 지금은 조회 성공을 가정한 안내용 목업.
  const handleSubmit = () => {
    setSubmitError('')
    navigate('/reservation/lookup/detail', {
      state: {
        reservation: {
          email,
          reservationNumber: 'MCM-2026-1010',
          storeName: 'MCM 롯데백화점 본점',
          dateLabel: '2026년 8월 13일 오후 4시 30분',
        },
      },
    })
  }

  return (
    <main className="lookup">
      <div className="lookup__card">
        <div className="lookup__intro">
          <h1 className="lookup__title">비회원 예약 확인</h1>
          <p className="lookup__subtitle">비회원 예약 확인을 위한 정보를 입력해주세요.</p>
        </div>

        <div className="lookup__form">
          <label className="text-box">
            <span className="text-box__label">이메일 주소</span>
            <div className="text-box__box">
              <img src={mailIcon} alt="" className="text-box__icon" />
              <input
                type="email"
                className="text-box__input"
                placeholder="example@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </label>

          <label className="text-box">
            <span className="text-box__label">비밀번호</span>
            <div className="text-box__box">
              <img src={lockIcon} alt="" className="text-box__icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="text-box__input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="text-box__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="비밀번호 표시 전환"
              >
                <img src={showPassword ? eyeOpenIcon : eyeOffIcon} alt="" />
              </button>
            </div>
          </label>
        </div>

        {submitError && <p className="lookup__error">{submitError}</p>}

        <button type="button" className="lookup__submit" disabled={!canSubmit} onClick={handleSubmit}>
          예약 확인하기
        </button>

        <div className="lookup__divider">
          <span className="lookup__divider-line" />
          <span className="lookup__divider-line" />
        </div>

        <a href="/login" className="lookup__login-link">
          로그인/회원가입
        </a>
      </div>
    </main>
  )
}
