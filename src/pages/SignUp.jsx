import { useState } from 'react'
import './SignUp.css'
import mailIcon from '../assets/mail-icon.svg'
import phoneIcon from '../assets/phone-icon.svg'
import lockIcon from '../assets/lock-icon.svg'
import eyeOffIcon from '../assets/eye-toggle-icon.svg'
import eyeOpenIcon from '../assets/eye-open-icon.svg'
import hintCheckDefault from '../assets/hint-check-default.svg'
import hintCheckValid from '../assets/hint-check-valid.svg'

const ALLOWED_SPECIAL_CHARS = '!@#$%^&*'
const DISALLOWED_PASSWORD_CHARS = /[^a-zA-Z0-9!@#$%^&*]/g

const PASSWORD_RULES = [
  { key: 'length', label: '최소 8자 이상', test: (v) => v.length >= 8 },
  { key: 'case', label: '영문 대문자 최소 1개 및 소문자 최소 1개 이상', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { key: 'special', label: `특수 문자 최소 1개 이상 (${ALLOWED_SPECIAL_CHARS})`, test: (v) => /[!@#$%^&*]/.test(v) },
  { key: 'digit', label: '숫자 최소 1개 이상', test: (v) => /\d/.test(v) },
]

const sanitizePassword = (value) => value.replace(DISALLOWED_PASSWORD_CHARS, '')

const REQUIRED_AGREEMENTS = [
  { key: 'collect', label: '[필수] 수집하는 개인정보의 항목, 목적 및 보유기간' },
  { key: 'terms', label: '[필수] 온라인 서비스 이용 약관' },
  { key: 'overseas', label: '[필수] 개인정보 국외 이전 동의 및 제3자 제공' },
]

const OPTIONAL_AGREEMENTS = [
  { key: 'newsletter', label: '[선택 ] MCM 의 광고와 마케팅 메시지를 뉴스레터로 받습니다' },
  { key: 'sms', label: '[선택] MCM 광고 및 마케팅 메시지를 문자 메시지로 받습니다' },
  { key: 'marketing', label: '[선택] MCM 마케팅 활동(소식, 맞춤형 상품 제안 등)을 위한 개인정보 활용에 대하여 동의합니다' },
]

const AGE_AGREEMENT = { key: 'age', label: '[필수] 만 14세 이상입니다' }

const ALL_AGREEMENT_KEYS = [...REQUIRED_AGREEMENTS, ...OPTIONAL_AGREEMENTS, AGE_AGREEMENT].map((a) => a.key)

export default function SignUp() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreements, setAgreements] = useState(() =>
    Object.fromEntries(ALL_AGREEMENT_KEYS.map((key) => [key, false]))
  )

  const isNameValid = name.trim().length > 0
  const isEmailValid = email.trim().length > 0
  const passwordRuleStatus = PASSWORD_RULES.map((rule) => ({ ...rule, valid: rule.test(password) }))
  const isPasswordValid = passwordRuleStatus.every((rule) => rule.valid)
  const isConfirmValid = confirmPassword.length > 0 && confirmPassword === password
  const allAgreed = ALL_AGREEMENT_KEYS.every((key) => agreements[key])
  const requiredAgreementKeys = [...REQUIRED_AGREEMENTS, AGE_AGREEMENT].map((a) => a.key)
  const isAgreementValid = requiredAgreementKeys.every((key) => agreements[key])

  const canSubmit = isNameValid && isEmailValid && isPasswordValid && isConfirmValid && isAgreementValid

  const toggleAgreement = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleAll = () => {
    const next = !allAgreed
    setAgreements(Object.fromEntries(ALL_AGREEMENT_KEYS.map((key) => [key, next])))
  }

  const handleSubmit = () => {
    window.location.href = '/signup/complete'
  }

  return (
    <main className="signup">
      <div className="signup__card">
        <div className="signup__intro">
          <h1 className="signup__title">회원가입</h1>
          <p className="signup__subtitle">(서비스명) 와 함께해주셔서 감사합니다.</p>
        </div>

        <div className="signup__form">
          <p className="signup__required-note">
            <span className="signup__asterisk">*</span> 표시가 있는 모든 입력 항목은 필수입니다.
          </p>

          <div className="signup__fields">
            <label className="text-box">
              <span className="text-box__label">
                성명 <span className="signup__asterisk">*</span>
              </span>
              <div className={`text-box__box${isNameValid ? ' text-box__box--valid' : ''}`}>
                <img src={mailIcon} alt="" className="text-box__icon" />
                <input
                  type="text"
                  className="text-box__input"
                  placeholder="홍길동"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </label>

            <label className="text-box">
              <span className="text-box__label">전화번호</span>
              <div className="text-box__box">
                <img src={phoneIcon} alt="" className="text-box__icon" />
                <input
                  type="tel"
                  className="text-box__input"
                  placeholder="010-1234-6789"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </label>

            <label className="text-box">
              <span className="text-box__label">
                이메일 주소 <span className="signup__asterisk">*</span>
              </span>
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
              <span className="text-box__label">
                비밀번호 <span className="signup__asterisk">*</span>
              </span>
              <div className={`text-box__box${isPasswordValid ? ' text-box__box--valid' : ''}`}>
                <img src={lockIcon} alt="" className="text-box__icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="text-box__input"
                  value={password}
                  onChange={(event) => setPassword(sanitizePassword(event.target.value))}
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
              <div className="signup__password-rules">
                {passwordRuleStatus.map((rule) => (
                  <span key={rule.key} className={`text-box__hint${rule.valid ? ' text-box__hint--valid' : ''}`}>
                    <img src={rule.valid ? hintCheckValid : hintCheckDefault} alt="" />
                    {rule.label}
                  </span>
                ))}
              </div>
            </label>

            <label className="text-box">
              <span className="text-box__label">
                비밀번호 확인 <span className="signup__asterisk">*</span>
              </span>
              <div className={`text-box__box${isConfirmValid ? ' text-box__box--valid' : ''}`}>
                <img src={lockIcon} alt="" className="text-box__icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="text-box__input"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(sanitizePassword(event.target.value))}
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

          <div className="signup__agreements">
            <label className="signup__agree signup__agree--all">
              <input type="checkbox" checked={allAgreed} onChange={toggleAll} />
              <span>모두 동의하기</span>
            </label>

            <div className="signup__agree-list">
              {REQUIRED_AGREEMENTS.map((agreement) => (
                <label key={agreement.key} className="signup__agree">
                  <input
                    type="checkbox"
                    checked={agreements[agreement.key]}
                    onChange={() => toggleAgreement(agreement.key)}
                  />
                  <span>{agreement.label}</span>
                </label>
              ))}
              {OPTIONAL_AGREEMENTS.map((agreement) => (
                <label key={agreement.key} className="signup__agree signup__agree--underline">
                  <input
                    type="checkbox"
                    checked={agreements[agreement.key]}
                    onChange={() => toggleAgreement(agreement.key)}
                  />
                  <span>{agreement.label}</span>
                </label>
              ))}
              <label className="signup__agree">
                <input
                  type="checkbox"
                  checked={agreements[AGE_AGREEMENT.key]}
                  onChange={() => toggleAgreement(AGE_AGREEMENT.key)}
                />
                <span>{AGE_AGREEMENT.label}</span>
              </label>
            </div>
          </div>
        </div>

        <button type="button" className="signup__submit" disabled={!canSubmit} onClick={handleSubmit}>
          회원가입 하기
        </button>
      </div>
    </main>
  )
}
