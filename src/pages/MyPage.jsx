import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getMe, getMyReservations, getMyItems, getMyOwnerships } from '../api/mypage.js';
import MyPageSidebar from '../components/MyPageSidebar.jsx';
import NorigaePreview from '../components/NorigaePreview.jsx';
import { buildNorigaeData } from '../utils/norigaeAssets.js';
import iconAvatarPlaceholder from '../assets/mypage/icon-avatar-placeholder.svg';
import iconPlusSmall from '../assets/mypage/icon-plus-small.svg';
import iconPlusCircle from '../assets/mypage/icon-plus-circle.svg';
import iconLink from '../assets/mypage/icon-link.svg';
import './MyPage.css';

// 완료/취소된 예약 상태 판별
const isCancelledStatus = (status) => status === '취소' || status === '취소됨' || status === '예약 취소'
const isCompletedStatus = (status) => status === '완료' || status === '완료됨' || status === '방문 완료' || status === '방문완료' || status === '이용 완료' || status === '이용완료'

function formatItemDate(item) {
  const raw = item.created_at || item.created_at_date || item.updated_at
  if (!raw) return ''
  const date = new Date(raw)
  if (isNaN(date.getTime())) return String(raw)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}.${month}.${day}`
}

async function handleShareItem(item) {
  const shareUrl = `${window.location.origin}/norigae/${item.id || item.item_id || ''}`
  try {
    await navigator.clipboard.writeText(shareUrl)
    alert('공유 링크가 클립보드에 복사되었습니다.')
  } catch {
    // 클립보드 접근 실패 시 무시
  }
}

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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyPageData = async () => {
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
      }
    };

    fetchMyPageData();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="mypage-wrapper">
      <MyPageSidebar active={activeTab} onSelect={setActiveTab} />

      {/* 메인 컨텐츠 영역 (activeTab에 따라 다른 뷰 출력) */}
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
                    <img src={iconAvatarPlaceholder} alt="" className="avatar-icon" />
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
                {items.slice(0, 2).map((item) => {
                  const preview = buildNorigaeData(item);
                  return (
                    <div className="timeline-card" key={item.id || item.item_id}>
                      {item.image_url || item.thumbnail ? (
                        <img src={item.image_url || item.thumbnail} alt={item.title || ''} className="timeline-image" />
                      ) : preview?.knotImage ? (
                        <NorigaePreview norigaeData={preview} showSeasonBadge={false} />
                      ) : (
                        <div className="img-placeholder">🖼️</div>
                      )}
                    </div>
                  );
                })}
                <Link to="/editor" className="timeline-card add-card">
                  <img src={iconPlusCircle} alt="" className="add-icon" />
                  <h4>새로 만들기</h4>
                  <p>나만의 노리개를 디자인하세요.</p>
                </Link>
              </div>
            </section>

            <div className="two-column-grid">
              <div className="info-card">
                <div className="card-header">
                  <h3>최근 예약 내역</h3>
                  <button className="btn-more" onClick={() => navigate('/mypage/reservations')}>
                    전체 보기
                  </button>
                </div>
                <ul className="reservation-list">
                  {reservations.length === 0 && <p className="card-desc">예약 내역이 없습니다.</p>}
                  {reservations.slice(0, 2).map((res) => {
                    const isCancelled = isCancelledStatus(res.status);
                    const isCompleted = isCompletedStatus(res.status);
                    const statusLabel = isCancelled
                      ? '예약 취소'
                      : isCompleted
                      ? '방문 완료'
                      : (res.status || '확정');
                    const tagClass = isCancelled
                      ? ' status-tag--cancelled'
                      : isCompleted
                      ? ' status-tag--completed'
                      : '';
                    const itemClass = isCancelled
                      ? ' reservation-item--cancelled'
                      : isCompleted
                      ? ' reservation-item--completed'
                      : '';
                    return (
                      <li
                        className={`reservation-item${itemClass}`}
                        key={res.id || res.reservation_id}
                      >
                        <div>
                          <strong>{res.store_name || res.store}</strong>
                          <p>{formatReservedAt(res.reserved_at || res.reservation_date)}</p>
                        </div>
                        <span className={`status-tag${tagClass}`}>
                          {statusLabel}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="info-card highlight-card">
                <div className="card-header">
                  <h3>소유권 레지스트리</h3>
                </div>
                <p className="card-desc">만든 노리개 디자인의 일련번호를 등록하고 당신만의 디자인으로 등록하세요.</p>
                {ownerships[0] && (
                  <div className="registry-box">
                    <div className="registry-info">
                      <strong>{ownerships[0].product_name || ownerships[0].title}</strong>
                      <p>
                        상태:{' '}
                        <span className="registry-status">
                          {ownerships[0].has_production_right ? '보유' : '심사 중'}
                        </span>
                      </p>
                    </div>
                    <button type="button" className="btn-text-link" onClick={() => setActiveTab('ownerships')}>
                      자세히
                    </button>
                  </div>
                )}
                <button className="btn-accent-full" onClick={() => setActiveTab('ownerships')}>
                  새 소유권 등록
                  <img src={iconPlusSmall} alt="" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* TAB 3: 저장된 노리개 디자인 전체 페이지 */}
        {activeTab === 'items' && (
          <div className="tab-page">
            <div className="content-header">
              <h2>저장된 노리개 디자인</h2>
              <p>에디터에서 커스텀 및 저장한 나의 노리개 컬렉션입니다.</p>
            </div>
            <div className="wish-card-grid">
              {items.map((item) => {
                const preview = buildNorigaeData(item);
                return (
                  <div className="wish-card" key={item.id || item.item_id}>
                    <div className="wish-card__image-area">
                      <div className="wish-card__image-frame">
                        {item.image_url || item.thumbnail ? (
                          <img src={item.image_url || item.thumbnail} alt={item.title || ''} className="timeline-image" />
                        ) : preview?.knotImage ? (
                          <NorigaePreview norigaeData={preview} showSeasonBadge={false} />
                        ) : (
                          <div className="img-placeholder">🖼️</div>
                        )}
                      </div>
                      {preview?.isSeasonal && <span className="wish-card__tag">{preview.seasonTag}</span>}
                    </div>
                    <div className="wish-card__divider" />
                    <div className="wish-card__body">
                      <div className="wish-card__meta">
                        <div className="wish-card__title-row">
                          <h3 className="wish-card__title">{item.title || '나의 노리개'}</h3>
                          <span className="wish-card__date">{formatItemDate(item)}</span>
                        </div>
                        <p className="wish-card__desc">{item.symbol_reason || item.wish_keyword || ''}</p>
                      </div>
                      <div className="wish-card__actions">
                        <button type="button" className="wish-card__btn wish-card__btn--primary">
                          상세보기
                        </button>
                        <button
                          type="button"
                          className="wish-card__btn wish-card__btn--outline"
                          onClick={() => handleShareItem(item)}
                        >
                          <img src={iconLink} alt="" /> 공유하기
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link to="/editor" className="wish-card wish-card--add">
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