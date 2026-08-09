import './NavTabs.css'

const TABS = [
  { key: 'home', label: '홈', href: '/' },
  { key: 'make', label: '만들기', href: '/make' },
  { key: 'reservation', label: '예약', href: '/reservation' },
  { key: 'mypage', label: '마이페이지', href: '/mypage' },
]

export default function NavTabs() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <nav className="nav-tabs">
      {TABS.map((tab) => (
        <a
          key={tab.key}
          href={tab.href}
          className={`nav-tabs__link${tab.href === currentPath ? ' nav-tabs__link--active' : ''}`}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  )
}
