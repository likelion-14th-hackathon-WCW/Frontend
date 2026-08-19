import './AuthHeader.css'
import logo from '../assets/logo-mcm-yeongyeol.png'

export default function AuthHeader() {
  return (
    <header className="auth-header">
      <a href="/" className="auth-header__logo">
        <img src={logo} alt="MCM : Yeongyeol" className="auth-header__logo-image" />
      </a>
    </header>
  )
}
