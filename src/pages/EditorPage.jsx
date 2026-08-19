import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAiRecommendation, saveNorigaeDesign } from '../api/norigaeApi';
import LoginModal from '../components/LoginModal'; // 모달 컴포넌트 불러오기
import './EditorPage.css';
import shareIcon from '../assets/editor-share.svg';
import checkIcon from '../assets/calendar-check-02.svg';
import downloadIcon from '../assets/editor-download.svg';

export default function EditorPage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('성장');
  const [title, setTitle] = useState('');

  const [recommendation, setRecommendation] = useState(null);
  const [excludeCombinations, setExcludeCombinations] = useState([]);

  const [selectedKnot, setSelectedKnot] = useState(1);
  const [selectedDecoration, setSelectedDecoration] = useState(1);
  const [selectedTassel, setSelectedTassel] = useState(13);
  const [selectedColor, setSelectedColor] = useState('#1E293B');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 로그인 모달 열림 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 예시: 로그인 여부 확인 (토큰 유무로 검증)
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleGetRecommendation = async () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      alert('소망 또는 키워드를 입력해 주세요.');
      return;
    }
    if (trimmedKeyword.length > 10) {
      alert('키워드는 최대 10자까지만 입력 가능합니다.');
      return;
    }

    if (excludeCombinations.length >= 3) {
      alert('추천은 최대 3번까지만 가능합니다.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const result = await getAiRecommendation(trimmedKeyword, excludeCombinations);

    if (result.success) {
      const data = result.data;

      if (!recommendation) {
        setRecommendation(data);
        setTitle(data.suggested_title || '');
      } else {
        setRecommendation((prev) => ({
          ...prev,
          knot: data.knot,
          decoration: data.decoration,
          reason: data.reason || prev.reason,
        }));
      }

      setSelectedKnot(data.knot);
      setSelectedDecoration(data.decoration);

      setExcludeCombinations((prev) => [
        ...prev,
        { knot: data.knot, decoration: data.decoration },
      ]);
    } else {
      if (result.status === 429) {
        alert(result.message || '추천은 최대 3번까지만 가능합니다.');
      } else if (result.status === 503) {
        setErrorMsg(result.message || '추천 생성에 실패했습니다. 다시 시도해 주세요.');
      } else {
        setErrorMsg(result.message || 'AI 추천 중 오류가 발생했습니다.');
      }
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGetRecommendation();
    }
  };

  const handleReset = () => {
    if (window.confirm('디자인을 초기 상태로 복원하시겠습니까?')) {
      if (recommendation) {
        setSelectedKnot(recommendation.knot);
        setSelectedDecoration(recommendation.decoration);
      } else {
        setSelectedKnot(1);
        setSelectedDecoration(1);
      }
      setSelectedTassel(13);
      setSelectedColor('#1E293B');
    }
  };

  const handleSave = async () => {
    // 1) 클라이언트 측 비회원 사전 차단
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    const payload = {
      wish_keyword: keyword,
      symbol_reason: recommendation?.reason || '',
      knot: Number(selectedKnot),
      tassel: Number(selectedTassel),
      decoration: Number(selectedDecoration),
      color: selectedColor,
      title: title,
    };

    const result = await saveNorigaeDesign(payload);

    if (result.success) {
      alert('노리개 디자인이 성공적으로 저장되었습니다!');
    } else {
      // 2) 서버 응답 401 Unauthorized 처리
      if (result.status === 401) {
        setIsLoginModalOpen(true);
      } else if (result.status === 400) {
        const errors = result.errors;
        if (errors?.knot) alert(`매듭 오류: ${errors.knot[0]}`);
        else if (errors?.title) alert(`제목 오류: ${errors.title[0]}`);
        else alert('입력값을 확인해 주세요.');
      } else {
        alert(result.message || '저장에 실패했습니다.');
      }
    }
  };

  const handleImageDownload = () => {
    alert('제작한 노리개 이미지가 PNG 파일로 다운로드됩니다.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || '나만의 노리개',
          text: `${keyword} 소망을 담은 나만의 노리개 디자인입니다.`,
          url: window.location.href,
        });
      } catch (err) {
        // 공유 취소
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('공유 링크가 클립보드에 복사되었습니다.');
    }
  };

  const handleGoToReservation = () => {
    navigate('/reservation', {
      state: {
        norigaeData: {
          title,
          keyword,
          knot: selectedKnot,
          decoration: selectedDecoration,
          tassel: selectedTassel,
          color: selectedColor,
        },
      },
    });
  };

  return (
    <div className="editor-page-container">
      {/* 로그인 모달 바인딩 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <div className="editor-grid">
        <div className="panel-left">
          <h1 className="section-head-title">나만의 노리개 만들기</h1>
          <p className="section-head-desc">
            전통 한국 장신구를 현대적인 감각으로 직접 디자인해보세요.
          </p>

          <label className="input-label">소망 또는 키워드 입력</label>
          <div className="keyword-input-card">
            <span className="sparkle-icon">✨</span>
            <input
              id="wish-keyword-input"
              name="wishKeyword"
              type="text"
              className="keyword-field"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="소망 입력 (최대 10자)"
              maxLength={10}
            />
          </div>

          <div className="sub-text-group">
            <p className="helper-text">소망을 입력하면 AI 추천을 받을 수 있습니다.</p>
            <button
              className="action-link"
              onClick={handleGetRecommendation}
              disabled={loading}
            >
              ↺ 추천 다시 받기 ({excludeCombinations.length}/3)
            </button>
          </div>

          <div className="divider-line" />

          <label className="input-label">실 색상 선택</label>
          <div className="color-selector">
            {['#1E293B', '#F472B6', '#F59E0B', '#10B981', '#EF4444'].map((col, idx) => (
              <div
                key={col}
                className={`color-dot ${selectedColor === col ? 'active' : ''}`}
                style={{ backgroundColor: col }}
                onClick={() => setSelectedColor(col)}
              >
                {idx === 4 && <span className="badge-dot" />}
              </div>
            ))}
          </div>

          <label className="input-label">매듭 선택</label>
          <div className="option-cards-grid">
            {[1, 2, 3].map((id, idx) => (
              <div
                key={id}
                className={`item-thumb-card ${selectedKnot === id ? 'active' : ''}`}
                onClick={() => setSelectedKnot(id)}
              >
                <div className="img-placeholder" />
                {idx === 2 && <span className="badge-dot" />}
              </div>
            ))}
          </div>

          <div className="divider-line" />

          <label className="input-label">메인 장식</label>
          <div className="option-cards-grid">
            {[1, 2].map((id, idx) => (
              <div
                key={id}
                className={`item-thumb-card ${selectedDecoration === id ? 'active' : ''}`}
                onClick={() => setSelectedDecoration(id)}
              >
                <div className="img-placeholder" />
                <span>장식 {id}</span>
                {idx === 1 && <span className="badge-dot" />}
              </div>
            ))}
          </div>

          <div className="divider-line" />

          <label className="input-label">술 선택</label>
          <div className="option-cards-grid">
            {[1, 2, 3].map((id, idx) => (
              <div
                key={id}
                className={`item-thumb-card ${selectedTassel === id ? 'active' : ''}`}
                onClick={() => setSelectedTassel(id)}
              >
                <div className="img-placeholder" />
                {idx === 2 && <span className="badge-dot" />}
              </div>
            ))}
          </div>
          <div className="limited-season-tag">● 시즌 한정판</div>
        </div>

        <div className="panel-center">
          {loading ? (
            <div className="canvas-state-box">
              <div className="loading-spinner">🔆</div>
              <p className="canvas-loading-text">
                AI가 입력한 소망과 어울리는 노리개 조합을 생각하고 있어요.
              </p>
            </div>
          ) : !recommendation ? (
            <div className="canvas-state-box">
              <p className="canvas-loading-text">
                소망이나 키워드를 입력한 후 AI 추천을 받아보세요.
              </p>
            </div>
          ) : (
            <div className="norigae-render-container">
              <div className={`knot-part knot-style-${selectedKnot}`} style={{ color: selectedColor }}>
                <img src={`/assets/knots/knot_${selectedKnot}.svg`} alt="매듭" />
              </div>

              <div className={`decoration-part deco-style-${selectedDecoration}`}>
                <img src={`/assets/decorations/deco_${selectedDecoration}.svg`} alt="장식" />
              </div>

              <div className={`tassel-part tassel-style-${selectedTassel}`} style={{ color: selectedColor }}>
                <img src={`/assets/tassels/tassel_${selectedTassel}.svg`} alt="술" />
              </div>
            </div>
          )}

          {errorMsg && <p className="error-text" style={{ color: '#e06666', fontSize: '12px', marginTop: '12px' }}>{errorMsg}</p>}
        </div>

        <div className="panel-right">
          <div className="panel-right-top">
            <div className="symbol-section">
              <div className="symbol-header">
                <span className="sparkle-icon">✨</span> 상징적 의미
              </div>
              <p className="symbol-body">
                키워드를 입력하고 만들어진 노리개의 부여된<br />
                상징적 의미를 확인해 보세요.
              </p>

              <div className="symbol-card-box">
                {recommendation?.reason || '소망 키워드를 입력하고 AI 추천을 받아보세요.'}
              </div>

              <button className="symbol-reset-btn" onClick={handleReset}>
                <span>↺</span> 추천 받은 노리개로 되돌리기
              </button>
            </div>

            <div className="mcm-recommend-box">
              <div className="mcm-title">함께 어울리는 MCM 상품</div>
              <div className="mcm-desc">노리개를 만들어 보고 MCM 상품을 추천받아 보세요.</div>
            </div>
          </div>

          <div className="bottom-action-container">
            <input
              id="norigae-title-input"
              name="norigaeTitle"
              type="text"
              style={{
                padding: '10px 12px',
                border: '1px solid #e0d8c8',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                marginBottom: '8px',
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="작품 제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button className="btn-full-action" onClick={handleGoToReservation}>
              <img src={checkIcon} alt="예약" /> 매장 예약하기
            </button>

            <div className="btn-dual-group">
              <button className="btn-secondary-action" onClick={handleSave}>
                <img src={downloadIcon} alt="저장" /> 디자인 저장
              </button>
              <button className="btn-secondary-action" onClick={handleShare}>
                <img src={shareIcon} alt="공유" /> 공유하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}