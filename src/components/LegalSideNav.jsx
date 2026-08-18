import './LegalSideNav.css'

export const LEGAL_LINKS = [
  { label: '온라인 서비스 이용 약관', href: '/terms' },
  { label: '개인정보 처리방침', href: '#' },
  { label: '장인정신', href: '/craftsmanship' },
  { label: '고객센터', href: '#' },
]

export default function LegalSideNav({ active }) {
  return (
    <aside className="legal-sidenav">
      {LEGAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={`legal-sidenav__link${link.label === active ? ' legal-sidenav__link--active' : ''}`}
        >
          {link.label}
        </a>
      ))}
    </aside>
  )
}
