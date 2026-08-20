import { useNavigate } from 'react-router-dom';
import iconProfile from '../assets/mypage/icon-profile.svg';
import iconProfileActive from '../assets/mypage/icon-profile-active.svg';
import iconReservations from '../assets/mypage/icon-reservations.svg';
import iconReservationsActive from '../assets/mypage/icon-reservations-active.svg';
import iconItems from '../assets/mypage/icon-items.svg';
import iconItemsActive from '../assets/mypage/icon-items-active.svg';
import iconOwnershipOuter from '../assets/mypage/icon-ownership-outer.svg';
import iconOwnershipOuterActive from '../assets/mypage/icon-ownership-outer-active.svg';
import iconOwnershipInner from '../assets/mypage/icon-ownership-inner.svg';
import iconOwnershipInnerActive from '../assets/mypage/icon-ownership-inner-active.svg';
import iconWishlist from '../assets/mypage/icon-wishlist.svg';
import iconWishlistActive from '../assets/mypage/icon-wishlist-active.svg';
import iconSettings from '../assets/mypage/icon-settings.svg';
import iconSettingsActive from '../assets/mypage/icon-settings-active.svg';
import './MyPageSidebar.css';

const SIDEBAR_ITEMS = [
  { key: 'profile', label: '프로필 개요', icon: iconProfile, activeIcon: iconProfileActive },
  { key: 'reservations', label: '예약 내역', icon: iconReservations, activeIcon: iconReservationsActive },
  { key: 'items', label: '저장된 노리개 디자인', icon: iconItems, activeIcon: iconItemsActive },
  {
    key: 'ownerships',
    label: '소유권 및 관리',
    icon: iconOwnershipOuter,
    activeIcon: iconOwnershipOuterActive,
    innerIcon: iconOwnershipInner,
    innerActiveIcon: iconOwnershipInnerActive,
  },
  { key: 'wishlist', label: '위시리스트', icon: iconWishlist, activeIcon: iconWishlistActive, gap: true },
  { key: 'settings', label: '계정 설정', icon: iconSettings, activeIcon: iconSettingsActive },
];

// MyPage.jsx의 pathMap과 동일한 탭↔경로 매핑 (onSelect 없이 다른 페이지에서 진입할 때 사용)
const TAB_PATHS = {
  profile: '/mypage',
  reservations: '/mypage/reservations',
  items: '/mypage/collections',
  ownerships: '/mypage/ownership',
  wishlist: '/mypage/wishlist',
  settings: '/mypage/settings',
};

export default function MyPageSidebar({ active, onSelect }) {
  const navigate = useNavigate();

  const handleClick = (key) => {
    // 마이페이지 본체(MyPage.jsx)에서는 내부 탭 전환, 그 외(예약 상세/취소 등)에서는 해당 탭 경로로 이동
    if (onSelect) {
      onSelect(key);
    } else {
      navigate(TAB_PATHS[key] || '/mypage');
    }
  };

  return (
    <aside className="mypage-sidebar">
      <ul className="sidebar-menu">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <li
              key={item.key}
              className={`menu-item ${isActive ? 'active' : ''}${item.gap ? ' menu-gap' : ''}`}
              onClick={() => handleClick(item.key)}
            >
              {item.key === 'ownerships' ? (
                <span className="menu-icon menu-icon--layered">
                  <img src={isActive ? item.activeIcon : item.icon} alt="" />
                  <img src={isActive ? item.innerActiveIcon : item.innerIcon} alt="" className="menu-icon-inner" />
                </span>
              ) : (
                <img src={isActive ? item.activeIcon : item.icon} alt="" className="menu-icon" />
              )}
              {item.label}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
