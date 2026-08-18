import React from 'react';
import './MyPage.css';

export default function MyPage() {
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
              <span className="avatar-icon">👤</span>
            </div>
            <div className="user-info">
              <h3>(유저 닉네임)</h3>
              <p>example@example.com</p>
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
            <div className="timeline-card">
              <span className="badge-season">가을 시즌</span>
              <div className="img-placeholder">🖼️</div>
            </div>
            <div className="timeline-card">
              <div className="img-placeholder">🖼️</div>
            </div>
            <div className="timeline-card add-card">
              <div className="add-icon">+</div>
              <h4>새로 만들기</h4>
              <p>나만의 노리개를 디자인하세요.</p>
            </div>
          </div>
        </section>

        <div className="two-column-grid">
          <div className="info-card">
            <div className="card-header">
              <h3>최근 예약 내역</h3>
              <button className="btn-more">전체 보기</button>
            </div>
            <ul className="reservation-list">
              <li className="reservation-item">
                <div>
                  <strong>MCM 롯데백화점 본점</strong>
                  <p>2026년 8월 13일 • 오후 4:30</p>
                </div>
                <span className="status-tag active">예약됨</span>
              </li>
              <li className="reservation-item">
                <div>
                  <strong>MCM 롯데백화점 본점</strong>
                  <p>2026년 8월 9일 • 오후 12:00</p>
                </div>
                <span className="status-tag done">완료됨</span>
              </li>
            </ul>
          </div>

          <div className="info-card highlight-card">
            <div className="card-header">
              <h3>소유권 레지스트리</h3>
            </div>
            <p className="card-desc">
              만든 노리개 디자인의 일련번호를 등록하고 당신만의 디자인으로 등록하세요.
            </p>
            <div className="registry-box">
              <div className="registry-info">
                <strong>(노리개 이름)</strong>
                <p>상태: 자격 심사 중</p>
              </div>
              <button className="btn-text-link">자세히</button>
            </div>
            <button className="btn-accent-full">새 노리개 등록 +</button>
          </div>
        </div>
      </main>
    </div>
  );
}