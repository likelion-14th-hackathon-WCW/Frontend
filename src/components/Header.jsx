import './Header.css'
import NavTabs from './NavTabs.jsx'
import { useAuth } from '../hooks/useAuth.js'
import logo from '../assets/logo-mcm-yeongyeol.png'

export default function Header() {
  const { user } = useAuth()
  return (
    <header className="header">
      <a href="/" className="header__logo">
        <img src={logo} alt="MCM : Yeongyeol" className="header__logo-image" />
      </a>

      <nav className="header__nav">
        <NavTabs />
      </nav>

      {user ? (
        <a href="/mypage" className="header__user">
          {user.name}님
        </a>
      ) : (
        <a href="/login" className="header__login">
          로그인/회원가입
        </a>
      )}
    </header>
  )
}