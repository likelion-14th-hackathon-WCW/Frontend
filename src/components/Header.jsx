import './Header.css'
import NavTabs from './NavTabs.jsx'

export default function Header() {
  return (
    <header className="header">
      <a href="/" className="header__logo">
        로고 영역
      </a>

      <nav className="header__nav">
        <NavTabs />
      </nav>

      <a href="/login" className="header__login">
        로그인
      </a>
    </header>
  )
}
