import './SignUpComplete.css'
import successCheckIcon from '../assets/success-check-large.svg'

export default function SignUpComplete() {
  return (
    <main className="signup-complete">
      <div className="signup-complete__card">
        <div className="signup-complete__icon">
          <img src={successCheckIcon} alt="" />
        </div>

        <div className="signup-complete__message">
          <h1 className="signup-complete__title">회원가입이 완료되었습니다.</h1>
          <p className="signup-complete__subtitle">
            <span className="signup-complete__subtitle-brand">Yeongyeol</span>의 회원이 되신 것을 환영합니다.
          </p>
        </div>

        <div className="signup-complete__actions">
          <a href="/editor" className="signup-complete__primary">
            노리개 제작하러 가기
          </a>
          <a href="/" className="signup-complete__secondary">
            홈으로
          </a>
        </div>
      </div>
    </main>
  )
}
