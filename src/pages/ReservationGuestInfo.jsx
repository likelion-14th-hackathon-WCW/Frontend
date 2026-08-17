import { useState } from 'react'
import './ReservationGuestInfo.css'
import mailIcon from '../assets/mail-icon.svg'
import eyeOffIcon from '../assets/eye-toggle-icon.svg'
import eyeOpenIcon from '../assets/eye-open-icon.svg'
import hintCheckDefault from '../assets/hint-check-default.svg'
import hintCheckValid from '../assets/hint-check-valid.svg'

const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/

export default function ReservationGuestInfo() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const isEmailValid = email.trim().length > 0
  const isPasswordValid = PASSWORD_RULE.test(password)
  const isConfirmValid = confirmPassword.length > 0 && confirmPassword === password
  const canSubmit = isEmailValid && isPasswordValid && isConfirmValid

  const handleComplete = () => {
    window.location.href = '/reservation/complete-guest'
  }

  return (
    <main className="guest-info">
      <div className="guest-info__card">
        <div className="guest-info__intro">
          <h1 className="guest-info__title">비회원 예약 확인 정보 설정</h1>
          <p className="guest-info__subtitle">
            비회원 예약 시, 추후 예약 조회를 위해
            <br />
            이메일과 비밀번호 설정이 필요합니다.
          </p>
        </div>

        <div className="guest-info__form">
          <div className="guest-info__fields">
            <label className="text-box">
              <span className="text-box__label">예약 확인용 이메일</span>
              <div className={`text-box__box${isEmailValid ? ' text-box__box--valid' : ''}`}>
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
              <span className="text-box__label">예약 확인용 비밀번호</span>
              <div className={`text-box__box${isPasswordValid ? ' text-box__box--valid' : ''}`}>
                <img src={mailIcon} alt="" className="text-box__icon" />
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
              <span className={`text-box__hint${isPasswordValid ? ' text-box__hint--valid' : ''}`}>
                <img src={isPasswordValid ? hintCheckValid : hintCheckDefault} alt="" />
                영어대소문자, 숫자 포함 8자 이상
              </span>
            </label>

            <label className="text-box">
              <span className="text-box__label">예약 확인용 비밀번호 확인</span>
              <div className={`text-box__box${isConfirmValid ? ' text-box__box--valid' : ''}`}>
                <img src={mailIcon} alt="" className="text-box__icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="text-box__input"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="text-box__toggle"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label="비밀번호 확인 표시 전환"
                >
                  <img src={showConfirmPassword ? eyeOpenIcon : eyeOffIcon} alt="" />
                </button>
              </div>
              <span className={`text-box__hint${isConfirmValid ? ' text-box__hint--valid' : ''}`}>
                <img src={isConfirmValid ? hintCheckValid : hintCheckDefault} alt="" />
                비밀번호 일치
              </span>
            </label>
          </div>

          <label className="guest-info__agree">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
            <span className="guest-info__agree-text">노리개 디자인 활용 및 권리 귀속 동의</span>
          </label>

          <div className="guest-info__actions">
            <button type="button" className="guest-info__primary" disabled={!canSubmit} onClick={handleComplete}>
              예약 완료하기
            </button>
            {/* ponytail: 로그인 페이지는 별도 레포 소관 — 기존 코드베이스의 스텁 링크 패턴을 따름 */}
            <a href="/login" className="guest-info__secondary">
              회원으로 예약하기
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
