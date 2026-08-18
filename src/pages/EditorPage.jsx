import React, { useState } from 'react';
import { getAiRecommendation, saveNorigaeDesign } from '../api/norigaeApi';
import './EditorPage.css';

export default function EditorPage() {
  const [keyword, setKeyword] = useState('성장');
  
  const [recommendation, setRecommendation] = useState(null);
  const [excludeCombinations, setExcludeCombinations] = useState([]);
  
  const [selectedKnot, setSelectedKnot] = useState(1);
  const [selectedDecoration, setSelectedDecoration] = useState(1);
  const [selectedTassel, setSelectedTassel] = useState(13);
  const [selectedColor, setSelectedColor] = useState('#1E293B');
  const [title, setTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGetRecommendation = async () => {
    if (excludeCombinations.length >= 3) {
      alert('추천은 최대 3번까지만 가능합니다.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const result = await getAiRecommendation(keyword, excludeCombinations);

    if (result.success) {
      const data = result.data;
      
      if (!recommendation) {
        setRecommendation(data); 
        setTitle(data.suggested_title);
      } else {
        setRecommendation((prev) => ({
          ...prev,
          knot: data.knot,
          decoration: data.decoration,
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
        setErrorMsg(result.message || '추천 생성에 실패했습니다. 다시 시도해주세요.');
      } else {
        setErrorMsg(result.message);
      }
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('작품 제목을 입력해 주세요.');
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
      if (result.status === 401) {
        alert('로그인이 필요한 서비스입니다.');
      } else if (result.status === 400) {
        const errors = result.errors;
        if (errors.knot) alert(`매듭 오류: ${errors.knot[0]}`);
        else if (errors.title) alert(`제목 오류: ${errors.title[0]}`);
        else alert('입력값을 확인해 주세요.');
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-grid">
        
        <div className="panel-left">
          <h2 className="section-head-title">나만의 노리개 만들기</h2>
          <p className="section-head-desc">
            전통 한국 장신구를 현대적인 감각으로 직접 디자인해보세요.
          </p>

          <div className="divider-line" />

          <div className="input-label">소망 또는 키워드 입력</div>
          <div className="keyword-input-card">
            <span className="sparkle-icon">✨</span>
            <input
              type="text"
              className="keyword-field"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="소망 입력"
            />
          </div>

          <div className="sub-text-group">
            <p className="helper-text">소망을 입력하면 AI 추천을 받을 수 있습니다.</p>
            <button className="action-link" onClick={handleGetRecommendation} disabled={loading}>
              ↻ 추천 다시 받기
            </button>
          </div>

          <div className="input-label">실 색상 선택</div>
          <div className="color-selector">
            {['#1E293B', '#F472B6', '#F59E0B', '#10B981', '#EF4444'].map((col, idx) => (
              <div
                key={col}
                className={`color-dot ${selectedColor === col ? 'active' : ''}`}
                style={{ backgroundColor: col }}
                onClick={() => setSelectedColor(col)}
              >
                {idx === 4 && <div className="badge-dot" />}
              </div>
            ))}
          </div>

          <div className="input-label">매듭 선택</div>
          <div className="option-cards-grid">
            {[1, 2, 3].map((id, idx) => (
              <div
                key={id}
                className={`item-thumb-card ${selectedKnot === id ? 'active' : ''}`}
                onClick={() => setSelectedKnot(id)}
              >
                <div className="img-placeholder" />
                {idx === 2 && <div className="badge-dot" />}
              </div>
            ))}
          </div>

          <div className="input-label" style={{ marginTop: '16px' }}>메인 장식</div>
          <div className="option-cards-grid">
            {[1, 2].map((id, idx) => (
              <div
                key={id}
                className={`item-thumb-card ${selectedDecoration === id ? 'active' : ''}`}
                onClick={() => setSelectedDecoration(id)}
              >
                <div className="img-placeholder" />
                <span>text</span>
                {idx === 1 && <div className="badge-dot" />}
              </div>
            ))}
          </div>

          <div className="input-label" style={{ marginTop: '16px' }}>술 선택</div>
          <div className="option-cards-grid">
            {[1, 2, 3].map((id, idx) => (
              <div
                key={id}
                className={`item-thumb-card ${selectedTassel === id ? 'active' : ''}`}
                onClick={() => setSelectedTassel(id)}
              >
                <div className="img-placeholder" />
                {idx === 2 && <div className="badge-dot" />}
              </div>
            ))}
          </div>
          <div className="limited-season-tag">• 시즌 한정판</div>
        </div>

        <div className="panel-center">
          <div className="loading-spinner">🔆</div>
          <p className="canvas-loading-text">
            AI가 입력한 소망과 어울리는 노리개 조합을 생각하고 있어요.
          </p>
        </div>

        <div className="panel-right">
          <div className="symbol-card-box">
            <div className="symbol-header">
              <span style={{ color: '#d97706' }}>✨</span> 상징적 의미
            </div>
            <p className="helper-text" style={{ marginBottom: '12px' }}>
              키워드를 입력하고 만들어진 노리개에 부여된 상징적 의미를 확인해 보세요.
            </p>

            <div className="symbol-body">
              {recommendation ? recommendation.reason : ''}
            </div>

            <button className="action-link" onClick={handleGetRecommendation}>
              ↻ 추천 받은 노리개로 되돌리기
            </button>
          </div>

          <div className="mcm-recommend-box">
            <div className="mcm-title">함께 어울리는 MCM 상품</div>
            <div className="mcm-desc">노리개를 만들어 보고 MCM 상품을 추천받아 보세요.</div>
          </div>

          <div className="bottom-action-container">
            <input
              type="text"
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '4px'
              }}
              placeholder="작품 제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button className="btn-reservation">
              🏷️ 매장 예약하기
            </button>

            <div className="btn-dual-group">
              <button className="btn-secondary-action" onClick={handleSave}>
                💾 디자인 저장하기
              </button>
              <button className="btn-secondary-action" onClick={() => alert('공유 링크가 복사되었습니다.')}>
                🔗 공유하기
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}