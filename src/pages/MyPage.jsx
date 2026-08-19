import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getMe, getMyReservations, getMyItems, getMyOwnerships } from '../api/mypage.js';
import './MyPage.css';

function formatReservedAt(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const hour24 = date.getHours();
  const meridiem = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 • ${meridiem} ${hour12}:${minute}`;
}

export default function MyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 현재 활성화된 탭 ('profile', 'reservations', 'items', 'ownerships', 'wishlist', 'settings')
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [items, setItems] = useState([]);
  const [ownerships, setOwnerships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyPageData = async () => {
      setLoading(true);
      try {
        const [meRes, resRes, itemsRes, ownRes] = await Promise.allSettled([
          getMe(),
          getMyReservations(),
          getMyItems(),
          getMyOwnerships(),
        ]);

        if (meRes.status === 'fulfilled' && meRes.value?.success) setProfile(meRes.value.data);
        if (resRes.status === 'fulfilled' && resRes.value?.success) setReservations(resRes.value.data || []);
        if (itemsRes.status === 'fulfilled' && itemsRes.value?.success) setItems(itemsRes.value.data || []);
        if (ownRes.status === 'fulfilled' && ownRes.value?.success) setOwnerships(ownRes.value.data || []);
      } catch (error) {
        console.error('마이페이지 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="mypage-wrapper">
      {/* 1. 사이드바 메뉴 (클릭 시 activeTab 변경) */}
      <aside className="mypage-sidebar">
        <ul className="sidebar-menu">
          <li
            className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="icon">👤</span> 프로필 개요
          </li>
          <li
            className={`menu-item ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <span className="icon">📋</span> 예약 내역
          </li>
          <li
            className={`menu-item ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            <span className="icon">🔖</span> 저장된 노리개 디자인
          </li>
          <li
            className={`menu-item ${activeTab === 'ownerships' ? 'active' : ''}`}
            onClick={() => setActiveTab('ownerships')}
          >
            <span className="icon">🛡️</span> 소유권 및 관리
          </li>
          <li
            className={`menu-item menu-gap ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <span className="icon">♡</span> 위시리스트
          </li>
          <li
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="icon">⚙️</span> 계정 설정
          </li>
        </ul>
      </aside>

      {/* 2. 메인 컨텐츠 영역 (activeTab에 따라 다른 뷰 출력) */}
      <main className="mypage-content">
        {/* TAB 1: 프로필 개요 (기존 마이페이지 메인) */}
        {activeTab === 'profile' && (
          <>
            <div className="content-header">
              <h2>마이페이지</h2>
              <p>프로필, 예약 및 맞춤형 제작물을 관리하세요.</p>
            </div>

            <div className="profile-card">
              <div className="profile-left">
                <div className="avatar-box">
                  {profile?.profile_image ? (
                    <img src={profile.profile_image} alt="프로필" className="avatar-image" />
                  ) : (
                    <span className="avatar-icon">👤</span>
                  )}
                </div>
                <div className="user-info">
                  <h3>{profile?.nickname || profile?.name || user?.name || '고객님'}</h3>
                  <p>{profile?.email || user?.email}</p>
                </div>
              </div>
              <button className="btn-edit-profile" onClick={() => setActiveTab('settings')}>
                프로필 수정
              </button>
            </div>

            <section className="section-block">
              <div className="section-header">
                <h3>나의 노리개 타임라인</h3>
                <button className="btn-more" onClick={() => setActiveTab('items')}>
                  전체 보기
                </button>
              </div>
              <div className="timeline-grid">
                {items.slice(0, 2).map((item) => (
                  <div className="timeline-card" key={item.id || item.item_id}>
                    {item.image_url || item.thumbnail ? (
                      <img src={item.image_url || item.thumbnail} alt="" className="timeline-image" />
                    ) : (
                      <div className="img-placeholder">🖼️</div>
                    )}
                  </div>
                ))}
                <Link to="/editor" className="timeline-card add-card">
                  <div className="add-icon">+</div>
                  <h4>새로 만들기</h4>
                  <p>나만의 노리개를 디자인하세요.</p>
                </Link>
              </div>
            </section>

            <div className="two-column-grid">
              <div className="info-card">
                <div className="card-header">
                  <h3>최근 예약 내역</h3>
                  <button className="btn-more" onClick={() => setActiveTab('reservations')}>
                    전체 보기
                  </button>
                </div>
                <ul className="reservation-list">
                  {reservations.length === 0 && <p className="card-desc">예약 내역이 없습니다.</p>}
                  {reservations.slice(0, 2).map((res) => (
                    <li className="reservation-item" key={res.id || res.reservation_id}>
                      <div>
                        <strong>{res.store_name || res.store}</strong>
                        <p>{formatReservedAt(res.reserved_at || res.reservation_date)}</p>
                      </div>
                      <span className={`status-tag ${res.status === '취소' ? 'done' : 'active'}`}>
                        {res.status || '확정'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="info-card highlight-card">
                <div className="card-header">
                  <h3>소유권 레지스트리</h3>
                </div>
                <p className="card-desc">디자인 일련번호 및 제작권을 관리하세요.</p>
                <button className="btn-accent-full" onClick={() => setActiveTab('ownerships')}>
                  소유권 상세 관리 &gt;
                </button>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: 예약 내역 전체 페이지 */}
        {activeTab === 'reservations' && (
          <div className="tab-page">
            <div className="content-header">
              <h2>전체 예약 내역</h2>
              <p>진행 중이거나 완료된 방문/체험 예약 내역입니다.</p>
            </div>
            <div className="info-card">
              <ul className="reservation-list">
                {reservations.length === 0 ? (
                  <p className="card-desc">예약 내역이 존재하지 않습니다.</p>
                ) : (
                  reservations.map((res) => (
                    <li className="reservation-item" key={res.id || res.reservation_id}>
                      <div>
                        <strong>{res.store_name || res.store || '체험 공방'}</strong>
                        <p>{formatReservedAt(res.reserved_at || res.reservation_date)}</p>
                        <span style={{ fontSize: '13px', color: '#666' }}>
                          인원: {res.party_size || 1}명
                        </span>
                      </div>
                      <span className={`status-tag ${res.status === '취소' ? 'done' : 'active'}`}>
                        {res.status || '예약 완료'}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: 저장된 노리개 디자인 전체 페이지 */}
        {activeTab === 'items' && (
          <div className="tab-page">
            <div className="content-header">
              <h2>저장된 노리개 디자인</h2>
              <p>에디터에서 커스텀 및 저장한 나의 노리개 컬렉션입니다.</p>
            </div>
            <div className="timeline-grid">
              {items.map((item) => (
                <div className="timeline-card" key={item.id || item.item_id}>
                  {item.image_url || item.thumbnail ? (
                    <img src={item.image_url || item.thumbnail} alt="" className="timeline-image" />
                  ) : (
                    <div className="img-placeholder">🖼️</div>
                  )}
                  <h4 style={{ marginTop: '10px' }}>{item.title || '나의 노리개'}</h4>
                </div>
              ))}
              <Link to="/editor" className="timeline-card add-card">
                <div className="add-icon">+</div>
                <h4>새로 만들기</h4>
              </Link>
            </div>
          </div>
        )}

        {/* TAB 4: 소유권 및 관리 전체 페이지 */}
        {activeTab === 'ownerships' && (
          <div className="tab-page">
            <div className="content-header">
              <h2>소유권 및 레지스트리</h2>
              <p>고유 디자인 디지털 증명 및 상업적 제작 권한 관리 페이지입니다.</p>
            </div>
            {ownerships.length === 0 ? (
              <div className="info-card">
                <p className="card-desc">등록된 소유권 정보가 없습니다.</p>
              </div>
            ) : (
              ownerships.map((own, idx) => (
                <div className="info-card highlight-card" key={own.id || idx} style={{ marginBottom: '16px' }}>
                  <h3>{own.product_name || own.title || '등록된 노리개 디자인'}</h3>
                  <p className="card-desc">일련번호: {own.serial_number || `NORIGAE-2026-${idx + 101}`}</p>
                  <p className="card-desc">제작권 여부: {own.has_production_right ? '보유 (제작 가능)' : '심사 중'}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5 & 6: 위시리스트 및 계정 설정 임시 뷰 */}
        {(activeTab === 'wishlist' || activeTab === 'settings') && (
          <div className="tab-page">
            <div className="content-header">
              <h2>{activeTab === 'wishlist' ? '위시리스트' : '계정 설정'}</h2>
              <p>해당 기능은 준비 중입니다.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}