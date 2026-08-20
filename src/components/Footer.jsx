import { Link } from 'react-router-dom'
import logo from '../assets/logo-mcm-yeongyeol.png'
import './Footer.css'

const FOOTER_LINKS = [
  { label: '개인정보 처리방침', href: '/privacy' },
  { label: '이용약관', href: '/terms' },
  { label: '장인정신', href: '/craftsmanship' },
  { label: '고객센터', href: '/support' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="footer__brand" aria-label="MCM 연결 홈으로 이동">
        <img src={logo} alt="MCM : Yeongyeol" className="footer__logo-image" />
      </Link>

      <nav className="footer__nav">
        {FOOTER_LINKS.map(({ label, href }) => (
          <Link key={label} to={href} className="footer__link">
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
