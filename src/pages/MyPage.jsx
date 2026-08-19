import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { getMe, getMyReservations, getMyItems, getMyOwnerships } from '../api/mypage.js';
import './MyPage.css';

function formatReservedAt(isoString) {
  const date = new Date(isoString);
  const hour24 = date.getHours();
  const meridiem = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 • ${meridiem} ${hour12}:${minute}`;
}

export default function MyPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [items, setItems] = useState([]);
  const [ownerships, setOwnerships] = useState([]);

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    getMe().then((result) => result.success && setProfile(result.data));
    getMyReservations().then((result) => result.success && setReservations(result.data));
    getMyItems().then((result) => result.success && setItems(result.data));
    getMyOwnerships().then((result) => result.success && setOwnerships(result.data));
  }, [user]);

  if (!user) return null;

  const registry = ownerships[0];

  return (
    <div className="mypage-wrapper">
      <aside className="mypage-sidebar">
        <ul className="sidebar-menu">
          <li className="menu-item active">
            <span className="icon">👤</span> 프로필 개요
          </li>
          <li className="menu-item">
            <span className="icon">📋</span> 예약 내역
          </li>
          <li className="menu-item">
            <span className="icon">🔖</span> 저장된 노리개 디자인
          </li>
          <li className="menu-item">
            <span className="icon">🛡️</span> 소유권 및 관리
          </li>
          <li className="menu-item menu-gap">
            <span className="icon">♡</span> 위시리스트
          </li>
          <li className="menu-item">
            <span className="icon">⚙️</span> 계정 설정
          </li>
        </ul>
      </aside>

      <main className="mypage-content">
        <div className="content-header">
          <h2>마이페이지</h2>
          <p>프로필, 예약 및 맞춤형 제작물을 관리하세요.</p>
        </div>

        <div className="profile-card">
          <div className="profile-left">
            <div className="avatar-box">
              {profile?.profile_image ? (
                <img src={profile.profile_image} alt="" className="avatar-image" />
              ) : (
                <span className="avatar-icon">👤</span>
              )}
            </div>
            <div className="user-info">
              <h3>{profile?.nickname || profile?.name || '고객'}</h3>
              <p>{profile?.email}</p>
            </div>
          </div>
          <button className="btn-edit-profile">프로필 수정</button>
        </div>

        <section className="section-block">
          <div className="section-header">
            <h3>나의 노리개 타임라인</h3>
            <button className="btn-more">전체 보기</button>
          </div>
          <div className="timeline-grid">
            {items.slice(0, 2).map((item) => (
              <div className="timeline-card" key={item.id}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="timeline-image" />
                ) : (
                  <div className="img-placeholder">🖼️</div>
                )}
              </div>
            ))}
            <a href="/editor" className="timeline-card add-card">
              <div className="add-icon">+</div>
              <h4>새로 만들기</h4>
              <p>나만의 노리개를 디자인하세요.</p>
            </a>
          </div>
        </section>

        <div className="two-column-grid">
          <div className="info-card">
            <div className="card-header">
              <h3>최근 예약 내역</h3>
              <button className="btn-more">전체 보기</button>
            </div>
            <ul className="reservation-list">
              {reservations.length === 0 && <p className="card-desc">예약 내역이 없습니다.</p>}
              {reservations.slice(0, 2).map((reservation) => (
                <li className="reservation-item" key={reservation.id}>
                  <div>
                    <strong>{reservation.store_name}</strong>
                    <p>{formatReservedAt(reservation.reserved_at)}</p>
                  </div>
                  <span className={`status-tag ${reservation.status === '취소' ? 'done' : 'active'}`}>
                    {reservation.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card highlight-card">
            <div className="card-header">
              <h3>소유권 레지스트리</h3>
            </div>
            <p className="card-desc">
              만든 노리개 디자인의 일련번호를 등록하고 당신만의 디자인으로 등록하세요.
            </p>
            {registry && (
              <div className="registry-box">
                <div className="registry-info">
                  <strong>{registry.product_name}</strong>
                  <p>상태: {registry.has_production_right ? '제작권 보유' : '심사 중'}</p>
                </div>
                <button className="btn-text-link">자세히</button>
              </div>
            )}
            <button className="btn-accent-full">새 노리개 등록 +</button>
          </div>
        </div>
      </main>
    </div>
  );
}
