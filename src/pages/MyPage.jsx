import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { logout } from '../api/auth.js';
import {
  getMe,
  getMyReservations,
  getMyItems,
  getMyOwnerships,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../api/mypage.js';
import { getNotificationSettings, saveNotificationSettings } from '../utils/notificationSettings.js';
import MyPageSidebar from '../components/MyPageSidebar.jsx';
import NorigaePreview from '../components/NorigaePreview.jsx';
import NorigaeDetailView from '../components/NorigaeDetailView.jsx';
import { buildNorigaeData } from '../utils/norigaeAssets.js';
import iconAvatarPlaceholder from '../assets/mypage/icon-avatar-placeholder.svg';
import iconPlusSmall from '../assets/mypage/icon-plus-small.svg';
import iconPlusCircle from '../assets/mypage/icon-plus-circle.svg';
import iconLink from '../assets/mypage/icon-link.svg';
import iconCamera from '../assets/mypage/icon-camera.svg';
import iconBell from '../assets/mypage/icon-bell.svg';
import iconUserX from '../assets/mypage/icon-user-x.svg';
import iconSettingsPerson from '../assets/mypage/icon-settings-person.svg';
import eyeOffIcon from '../assets/eye-toggle-icon.svg';
import eyeOpenIcon from '../assets/eye-open-icon.svg';
import hintCheckDefault from '../assets/hint-check-default.svg';
import hintCheckValid from '../assets/hint-check-valid.svg';
import DigitalOwnership from './DigitalOwnershipPage';
import './MyPage.css';

const NICKNAME_RULE = {
  label: '특수문자 제외 2~10자 이내',
  test: (v) => /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]{2,10}$/.test(v),
};

const PASSWORD_RULES = [
  { key: 'length', label: '최소 8자 이상', test: (v) => v.length >= 8 },
  { key: 'case', label: '영문 대문자 최소 1개 및 소문자 최소 1개 이상', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { key: 'special', label: '특수 문자 최소 1개 이상', test: (v) => /[!@#$%^&*]/.test(v) },
  { key: 'digit', label: '숫자 최소 1개 이상', test: (v) => /\d/.test(v) },
];

// 완료/취소된 예약 상태 판별
const isCancelledStatus = (status) => status === '취소' || status === '취소됨' || status === '예약 취소';
const isCompletedStatus = (status) => status === '완료' || status === '완료됨' || status === '방문 완료' || status === '방문완료' || status === '이용 완료' || status === '이용완료';

function formatItemDate(item) {
  const raw = item.created_at || item.created_at_date || item.updated_at;
  if (!raw) return '';
  const date = new Date(raw);
  if (isNaN(date.getTime())) return String(raw);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day}`;
}

async function handleShareItem(item) {
  const shareUrl = `${window.location.origin}/norigae/${item.id || item.item_id || ''}`;
  try {
    await navigator.clipboard.writeText(shareUrl);
    alert('공유 링크가 클립보드에 복사되었습니다.');
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

// URL 경로에서 탭 결정
const getTabFromPath = (pathname) => {
  if (pathname.includes('reservations')) return 'reservations';
  if (pathname.includes('collections')) return 'items';
  if (pathname.includes('ownership')) return 'ownerships';
  if (pathname.includes('wishlist')) return 'wishlist';
  if (pathname.includes('settings')) return 'settings';
  return 'profile';
};

export default function MyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 활성화된 탭 ('profile', 'reservations', 'items', 'ownerships', 'wishlist', 'settings')
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [items, setItems] = useState([]);
  const [ownerships, setOwnerships] = useState([]);

  // 설정 탭: 프로필 수정
  const [nickname, setNickname] = useState('');
  const [savedNickname, setSavedNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // 설정 탭: 알림
  const [notifications, setNotifications] = useState(getNotificationSettings());

  // 설정 탭: 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (profile?.nickname) {
      setNickname(profile.nickname);
      setSavedNickname(profile.nickname);
    }
  }, [profile]);

  // URL 변경 시 activeTab 업데이트
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // activeTab 변경 시 URL 업데이트
  useEffect(() => {
    const pathMap = {
      profile: '/mypage',
      reservations: '/mypage/reservations',
      items: '/mypage/collections',
      ownerships: '/mypage/ownership',
      wishlist: '/mypage/wishlist',
      settings: '/mypage/settings',
    };
    const newPath = pathMap[activeTab] || '/mypage';
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [activeTab, navigate, location.pathname]);

  // [수정점 1] 선택된 상세 노리개 아이템 상태 추가
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchOwnershipsData = async () => {
    try {
      const ownRes = await getMyOwnerships();
      if (ownRes?.success) {
        setOwnerships(ownRes.data || []);
      }
    } catch (error) {
      console.error('소유권 조회 실패:', error);
    }
  };

  // [수정점 2] 삭제 완료 시 아이템 목록 갱신 함수
  const handleDeleteSuccess = (deletedId) => {
    setItems((prev) => prev.filter((item) => (item.id || item.item_id) !== deletedId));
  };

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

  const isNicknameValid = NICKNAME_RULE.test(nickname);
  const isProfileDirty = nickname !== savedNickname || !!avatarFile;
  const passwordRuleStatus = PASSWORD_RULES.map((rule) => ({ ...rule, valid: rule.test(newPassword) }));
  const isNewPasswordValid = passwordRuleStatus.every((rule) => rule.valid);
  const isConfirmPasswordValid = confirmPassword.length > 0 && confirmPassword === newPassword;
  const canChangePassword = currentPassword.length > 0 && isNewPasswordValid && isConfirmPasswordValid;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setProfileSaveSuccess(false);
  };

  const handleSaveProfile = async () => {
    if (!isNicknameValid || !isProfileDirty) return;
    setIsSavingProfile(true);
    setNicknameError('');
    setProfileSaveSuccess(false);
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('name', profile?.name || user?.name || '');
    formData.append('phone', profile?.phone || '');
    if (avatarFile) formData.append('profile_image', avatarFile);
    const result = await updateProfile(formData);
    setIsSavingProfile(false);
    if (!result.success) {
      setNicknameError(result.message);
      return;
    }
    setSavedNickname(nickname);
    setProfileSaveSuccess(true);
    setProfile((prev) => ({ ...prev, ...result.data }));
    setAvatarFile(null);
  };

  const handleDeleteAvatar = async () => {
    setAvatarFile(null);
    setAvatarPreview('');
    const formData = new FormData();
    formData.append('nickname', nickname || profile?.nickname || '');
    formData.append('name', profile?.name || user?.name || '');
    formData.append('phone', profile?.phone || '');
    formData.append('profile_image', '');
    const result = await updateProfile(formData);
    if (result.success) {
      setProfile((prev) => ({ ...prev, ...result.data, profile_image: null }));
    }
  };

  const handleToggleNotification = (key) => {
    setNotifications(saveNotificationSettings({ [key]: !notifications[key] }));
  };

  const handleChangePassword = async () => {
    if (!canChangePassword) return;
    setIsSavingPassword(true);
    setPasswordError('');
    const result = await changePassword({ currentPassword, newPassword });
    setIsSavingPassword(false);
    if (!result.success) {
      setPasswordError(result.message);
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다. 계속하시겠습니까?')) return;
    const result = await deleteAccount();
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  if (!user) return null;

  return (
    <div className="mypage-wrapper">
      <MyPageSidebar 
        active={activeTab} 
        onSelect={(tab) => {
          setSelectedItem(null); // 탭 이동 시 상세보기 상태 초기화
          setActiveTab(tab);
        }} 
      />

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
                    <div className="timeline-card" key={item.id || item.item_id} onClick={() => setActiveTab('items')} style={{ cursor: 'pointer' }}>
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
                        onClick={() => navigate('/mypage/reservations')}
                        style={{ cursor: 'pointer' }}
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
          selectedItem ? (
            /* [수정점 3] 상세보기 클릭 시 보여지는 인라인 상세 뷰 화면 */
            <NorigaeDetailView
              item={selectedItem}
              onBack={() => setSelectedItem(null)}
              onDeleteSuccess={handleDeleteSuccess}
              onGoToReservation={() => navigate('/reservation')}
              onGoToOwnership={() => {
                setSelectedItem(null);
                setActiveTab('ownerships');
              }}
            />
          ) : (
            /* 기존 카드 그리드 목록 화면 */
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
                          {/* [수정점 4] 상세보기 버튼에 setSelectedItem 클릭 이벤트만 추가 */}
                          <button 
                            type="button" 
                            className="wish-card__btn wish-card__btn--primary"
                            onClick={() => setSelectedItem(item)}
                          >
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
                {items.length === 0 && (
                  <Link to="/editor" className="wish-card wish-card--add">
                    <img src={iconPlusCircle} alt="" className="add-icon" />
                    <h4>새로 만들기</h4>
                    <p>나만의 노리개를 디자인하세요.</p>
                  </Link>
                )}
              </div>
            </div>
          )
        )}

        {/* TAB 4: 소유권 및 관리 전체 페이지 (독립된 컴포넌트 출력) */}
        {activeTab === 'ownerships' && (
          <DigitalOwnership 
            ownerships={ownerships} 
            onRegisterSuccess={fetchOwnershipsData} 
          />
        )}

        {/* TAB 5: 위시리스트 임시 뷰 */}
        {activeTab === 'wishlist' && (
          <div className="tab-page">
            <div className="content-header">
              <h2>위시리스트</h2>
              <p>해당 기능은 준비 중입니다.</p>
            </div>
          </div>
        )}

        {/* TAB 6: 설정 */}
        {activeTab === 'settings' && (
          <div className="tab-page">
            <div className="content-header">
              <h2>설정</h2>
              <p>계정 정보 및 서비스 환경을 관리하세요.</p>
            </div>

            <div className="settings-groups">
              <section className="settings-card">
                <div className="settings-card__header">
                  <img src={iconSettingsPerson} alt="" className="settings-card__icon" />
                  <h3>프로필 정보 수정</h3>
                </div>

                <div className="settings-avatar-row">
                  <label className="settings-avatar">
                    {avatarPreview || profile?.profile_image ? (
                      <img src={avatarPreview || profile.profile_image} alt="" className="settings-avatar__image" />
                    ) : (
                      <img src={iconCamera} alt="" />
                    )}
                    <input type="file" accept="image/jpeg,image/png,image/gif" hidden onChange={handleAvatarChange} />
                  </label>
                  <div className="settings-avatar-actions">
                    <div className="settings-avatar-buttons">
                      <label className="settings-btn-outline">
                        사진 변경
                        <input type="file" accept="image/jpeg,image/png,image/gif" hidden onChange={handleAvatarChange} />
                      </label>
                      {(avatarPreview || profile?.profile_image) && (
                        <button type="button" className="settings-btn-outline settings-btn-outline--danger" onClick={handleDeleteAvatar}>
                          사진 삭제
                        </button>
                      )}
                    </div>
                    <p className="settings-hint-text">JPG, GIF 또는 PNG 파일 (최대 5MB)</p>
                  </div>
                </div>

                <div className="settings-field">
                  <label>닉네임</label>
                  <div
                    className={`settings-input${nicknameError ? ' settings-input--error' : nickname ? ' settings-input--filled' : ''}`}
                  >
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => {
                        setNickname(e.target.value);
                        setNicknameError('');
                        setProfileSaveSuccess(false);
                      }}
                    />
                  </div>
                  <p className={`settings-hint-text${nicknameError ? ' settings-hint-text--error' : ''}`}>
                    {nicknameError || NICKNAME_RULE.label}
                  </p>
                </div>

                <div className="settings-field">
                  <label>이메일 주소</label>
                  <div className="settings-input settings-input--readonly">{profile?.email || user?.email}</div>
                  <p className="settings-hint-text">이메일 변경은 고객센터로 문의해주세요.</p>
                </div>

                <div className="settings-actions-row">
                  <button
                    type="button"
                    className="settings-btn-primary"
                    disabled={!isNicknameValid || !isProfileDirty || isSavingProfile}
                    onClick={handleSaveProfile}
                  >
                    {isSavingProfile ? '저장 중...' : '프로필 수정'}
                  </button>
                  {profileSaveSuccess ? (
                    <p className="settings-hint-text settings-hint-text--valid">수정이 완료되었습니다.</p>
                  ) : (
                    <p className="settings-note">* 프로필 수정 버튼을 누르지 않을 경우 반영되지 않습니다.</p>
                  )}
                </div>
              </section>

              <section className="settings-card">
                <div className="settings-card__header">
                  <img src={iconBell} alt="" className="settings-card__icon" />
                  <h3>알림 설정</h3>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <h4>카카오톡 예약 알림</h4>
                    <p>예약 확정 및 리마인드 메시지를 카카오톡으로 받습니다.</p>
                  </div>
                  <button
                    type="button"
                    className={`settings-toggle${notifications.sms ? ' settings-toggle--on' : ''}`}
                    onClick={() => handleToggleNotification('sms')}
                    aria-label="카카오톡 예약 알림 전환"
                  >
                    <span className="settings-toggle__knob" />
                  </button>
                </div>

                <div className="settings-toggle-row settings-toggle-row--divider">
                  <div>
                    <h4>이메일 프로모션 수신</h4>
                    <p>이벤트 및 신상품 정보를 이메일로 받아봅니다.</p>
                  </div>
                  <button
                    type="button"
                    className={`settings-toggle${notifications.email ? ' settings-toggle--on' : ''}`}
                    onClick={() => handleToggleNotification('email')}
                    aria-label="이메일 프로모션 수신 전환"
                  >
                    <span className="settings-toggle__knob" />
                  </button>
                </div>
              </section>

              <section className="settings-card">
                <div className="settings-card__header">
                  <img src={iconUserX} alt="" className="settings-card__icon" />
                  <h3>계정 관리</h3>
                </div>

                <h4 className="settings-subheading">비밀번호 변경</h4>

                <div className="settings-field">
                  <label>현재 비밀번호</label>
                  <div className="settings-input settings-input--password">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="현재 비밀번호를 입력해주세요."
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="settings-input__toggle"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      aria-label="현재 비밀번호 표시 전환"
                    >
                      <img src={showCurrentPassword ? eyeOpenIcon : eyeOffIcon} alt="" />
                    </button>
                  </div>
                </div>

                <div className="settings-field">
                  <label>새 비밀번호</label>
                  <div className="settings-input settings-input--password">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="새로운 비밀번호를 입력해주세요."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="settings-input__toggle"
                      onClick={() => setShowNewPassword((v) => !v)}
                      aria-label="새 비밀번호 표시 전환"
                    >
                      <img src={showNewPassword ? eyeOpenIcon : eyeOffIcon} alt="" />
                    </button>
                  </div>
                  <div className="settings-password-rules">
                    {passwordRuleStatus.map((rule) => (
                      <span key={rule.key} className={`settings-hint-text${rule.valid ? ' settings-hint-text--valid' : ''}`}>
                        <img src={rule.valid ? hintCheckValid : hintCheckDefault} alt="" />
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="settings-field">
                  <label>새 비밀번호 확인</label>
                  <div className="settings-input settings-input--password">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="새로운 비밀번호를 다시 입력해주세요."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="settings-input__toggle"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label="새 비밀번호 확인 표시 전환"
                    >
                      <img src={showConfirmPassword ? eyeOpenIcon : eyeOffIcon} alt="" />
                    </button>
                  </div>
                  <span className={`settings-hint-text${isConfirmPasswordValid ? ' settings-hint-text--valid' : ''}`}>
                    <img src={isConfirmPasswordValid ? hintCheckValid : hintCheckDefault} alt="" />
                    비밀번호 일치
                  </span>
                </div>

                {passwordError && <p className="settings-hint-text settings-hint-text--error">{passwordError}</p>}

                <button
                  type="button"
                  className="settings-btn-primary"
                  disabled={!canChangePassword || isSavingPassword}
                  onClick={handleChangePassword}
                >
                  변경하기
                </button>

                <div className="settings-withdraw-row">
                  <div>
                    <h4>로그아웃</h4>
                    <p>현재 기기에서 로그아웃합니다.</p>
                  </div>
                  <button type="button" className="settings-logout-btn" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>

                <div className="settings-withdraw-row">
                  <div>
                    <h4 className="settings-withdraw-title">회원 탈퇴</h4>
                    <p>탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.</p>
                  </div>
                  <button type="button" className="settings-withdraw-btn" onClick={handleDeleteAccount}>
                    탈퇴 하기
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}