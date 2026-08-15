import './Footer.css'

const FOOTER_LINKS = ['개인정보 처리방침', '이용약관', '장인정신', '고객센터']

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">로고영역</div>

      <nav className="footer__nav">
        {FOOTER_LINKS.map((label) => (
          <a key={label} href="#" className="footer__link">
            {label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
