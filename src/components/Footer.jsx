import './Footer.css'

const FOOTER_LINKS = [
  { label: '개인정보 처리방침', href: '/privacy' },
  { label: '이용약관', href: '/terms' },
  { label: '장인정신', href: '/craftsmanship' },
  { label: '고객센터', href: '#' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">로고영역</div>

      <nav className="footer__nav">
        {FOOTER_LINKS.map(({ label, href }) => (
          <a key={label} href={href} className="footer__link">
            {label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
