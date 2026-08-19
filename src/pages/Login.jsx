import { useState } from 'react'
import { login } from '../api/auth.js'
import './Login.css'
import mailIcon from '../assets/mail-icon.svg'
import lockIcon from '../assets/lock-icon.svg'
import eyeOffIcon from '../assets/eye-toggle-icon.svg'
import eyeOpenIcon from '../assets/eye-open-icon.svg'
import kakaoIcon from '../assets/kakao-icon.png'
import naverIcon from '../assets/naver-icon.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = email.trim().length > 0 && password.length > 0

  const handleSubmit = async () => {
    setSubmitError('')
    setIsSubmitting(true)
    const result = await login({ email, password })
    setIsSubmitting(false)
    if (!result.success) {
      setSubmitError(result.message)
      return
    }
    window.location.href = '/'
  }

  return (
    <main className="login">
      <div className="login__card">
        <div className="login__intro">
          <h1 className="login__title">로그인</h1>
          <p className="login__subtitle">(서비스명) 로그인 정보를 입력해주세요.</p>
        </div>

        <div className="login__form">
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

          <div className="login__remember-forgot">
            <label className="login__remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>로그인 상태 유지</span>
            </label>
            <a href="/find-password" className="login__forgot">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>

        {submitError && <p className="login__error">{submitError}</p>}

        <button type="button" className="login__submit" disabled={!canSubmit || isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? '로그인 중...' : '로그인하기'}
        </button>

        <div className="login__divider">
          <span className="login__divider-line" />
          <span className="login__divider-text">소셜로그인</span>
          <span className="login__divider-line" />
        </div>

        <button type="button" className="login__social login__social--kakao">
          <img src={kakaoIcon} alt="" />
          카카오 로그인
        </button>
        <button type="button" className="login__social login__social--naver">
          <img src={naverIcon} alt="" />
          네이버 로그인
        </button>

        <a href="/signup" className="login__signup-link">
          회원가입
        </a>
      </div>
    </main>
  )
}
