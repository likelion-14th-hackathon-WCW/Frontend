import React from 'react';
import './EditorPage.css';
import saveIcon from '../assets/storage.svg';
import downIcon from '../assets/download.svg';
import shareIcon from '../assets/share.svg';
import mainIcon1 from '../assets/main_dec1.svg';
import mainIcon2 from '../assets/main_dec2.svg';

export default function EditorPage() {
  return (
    <div className="editor-main-container">
      <aside className="sidebar-left">
        <div className="section-title">
          <h2>나만의 노리개 디자인</h2>
          <p className="subtitle">전통 한국 장신구를 현대적 감각으로 직접 디자인해보세요.</p>
        </div>

        <div className="input-group">
          <label>소원 또는 키워드 입력</label>
          <div className="input-with-icon">
            <input type="text" placeholder="예: 번영, 건강..." />
            <button className="btn-ai">✨</button>
          </div>
          <p className="hint">소원을 입력하시면 AI 추천을 받을 수 있습니다.</p>
          <button className="btn-text">🔄 추천 다시 받기</button>
        </div>

        <div className="option-group">
          <div className="option-header">
            <span>매듭 선택</span>
            <span className="arrow">▲</span>
          </div>
          <div className="grid-3">
            <div className="square-item selected">선택됨</div>
            <div className="square-item"></div>
            <div className="square-item"></div>
          </div>
        </div>

        {/* 💡 메인 장식 아이콘 클래스 추가 (card-icon) */}
        <div className="option-group">
          <div className="option-header">
            <span>메인 장식</span>
            <span className="arrow">▲</span>
          </div>
          <div className="grid-2">
            <div className="card-item">
              <img src={mainIcon1} alt="옥 펜던트" className="card-icon" /> 옥 펜던트
            </div>
            <div className="card-item selected">
              <img src={mainIcon2} alt="골드 타이거" className="card-icon" /> 골드 타이거
            </div>
          </div>
        </div>

        <div className="option-group">
          <div className="option-header">
            <span>색상</span>
            <span className="arrow">▲</span>
          </div>
          <div className="color-palette">
            <span className="color-chip active" style={{ backgroundColor: '#111' }}></span>
            <span className="color-chip" style={{ backgroundColor: '#555' }}></span>
            <span className="color-chip" style={{ backgroundColor: '#888' }}></span>
            <span className="color-chip" style={{ backgroundColor: '#ccc' }}></span>
            <span className="color-chip" style={{ backgroundColor: '#fff', border: '1px solid #ccc' }}></span>
          </div>
        </div>

        {/* 💡 하단 버튼 아이콘 클래스 추가 (btn-icon) */}
        <div className="action-buttons">
          <button className="btn-primary">
            <img src={saveIcon} alt="저장" className="btn-icon" /> 디자인 저장
          </button>
          <div className="btn-row">
            <button className="btn-secondary">
              <img src={downIcon} alt="다운로드" className="btn-icon" /> 이미지 다운로드
            </button>
            <button className="btn-secondary">
              <img src={shareIcon} alt="공유" className="btn-icon" /> 공유하기
            </button>
          </div>
          <button className="btn-reset">기본값으로 초기화</button>
        </div>
      </aside>

      <section className="editor-canvas">
        <div className="norigae-preview">
          <div className="shape-diamond"></div>
          <div className="shape-line"></div>
          <div className="shape-rect">🖼️</div>
          <div className="shape-line"></div>
          <div className="shape-circle"></div>
          <div className="shape-tassel"></div>
        </div>
      </section>

      <aside className="sidebar-right">
        <div className="info-box">
          <h3>✨ 상징적 의미</h3>
          <p className="info-desc">입력하신 키워드 <strong>"번영"</strong>에 맞춰, 국화 매듭과 옥 장식이 조합되었습니다.</p>
          <blockquote className="quote-box">
            "호랑이는 나쁜 기운을 물리치고, 국화는 장수와 인내를 상징합니다. 함께 어우러져 성공과 보호를 기원하는 강력한 부적이 됩니다."
          </blockquote>
          <button className="btn-text">🔄 추천 원문 노리개 되돌리기</button>
        </div>

        <div className="product-recommendation">
          <h3>함께 어울리는 MCM 상품</h3>
          <p className="subtitle">나만의 노리개 디자인과 완벽하게 어울리는 MCM 아이템.</p>

          <div className="product-card">
            <div className="product-img"></div>
            <div className="product-info">
              <span className="brand">MCM</span>
              <p className="name">피세토스 숄더 토트</p>
              <p className="price">$1,290</p>
            </div>
            <button className="btn-like">♡</button>
          </div>

          <div className="product-card">
            <div className="product-img"></div>
            <div className="product-info">
              <span className="brand">MCM</span>
              <p className="name">비세토스 미니 파우치</p>
              <p className="price">$395</p>
            </div>
            <button className="btn-like">♡</button>
          </div>

          <button className="btn-more">모든 추천 상품 보기</button>
        </div>
      </aside>
    </div>
  );
}