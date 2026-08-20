import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveNorigaeDesign, getRecommendProducts } from '../api/norigaeApi';
import successCheckIcon from '../assets/success-check-large.svg';
import './NorigaeNamingPage.css';

function NorigaePreview({ norigaeData, tasselCountClass }) {
  return (
    <div className="naming-norigae-frame">
      <div className="naming-norigae-inner">
        <span className="naming-corner naming-corner-tl" />
        <span className="naming-corner naming-corner-tr" />
        <span className="naming-corner naming-corner-bl" />
        <span className="naming-corner naming-corner-br" />
        <div className="naming-norigae-render">
          <img className="naming-knot-part" src={norigaeData.knotImage} alt="매듭" />
          <img className="naming-decoration-part" src={norigaeData.decorationImage} alt="장식" />
          <img
            className={`naming-tassel-part ${tasselCountClass}`}
            src={norigaeData.tasselImage}
            alt="술"
          />
        </div>
      </div>
    </div>
  );
}

export default function NorigaeNamingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const norigaeData = location.state?.norigaeData;

  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedItemId, setSavedItemId] = useState(null);
  const [recommendProducts, setRecommendProducts] = useState([]);

  useEffect(() => {
    if (!saved || !savedItemId) return;
    getRecommendProducts(savedItemId).then((result) => {
      if (result.success) setRecommendProducts(result.data);
    });
  }, [saved, savedItemId]);

  useEffect(() => {
    if (!norigaeData) {
      navigate('/editor', { replace: true });
    }
  }, [norigaeData, navigate]);

  if (!norigaeData) return null;

  const tasselCountClass = `tassel-part--count-${norigaeData.tasselCount}`;
  const isFilled = title.trim().length > 0;

  const handleSave = async () => {
    const finalTitle = title.trim() || norigaeData.defaultTitle || '나만의 노리개';
    const { defaultTitle: _defaultTitle, knotImage: _knotImage, decorationImage: _decorationImage, tasselImage: _tasselImage, tasselCount: _tasselCount, ...payload } = norigaeData;

    setSaving(true);
    const result = await saveNorigaeDesign({ ...payload, title: finalTitle });
    setSaving(false);

    if (result.success) {
      try {
        const savedItem = {
          ...result.data,
          id: result.data?.id ?? Date.now(),
          title: finalTitle,
          knot: norigaeData.knot,
          decoration: norigaeData.decoration,
          tassel: norigaeData.tassel,
          color: norigaeData.color,
          wish_keyword: norigaeData.wish_keyword || norigaeData.keyword || '',
          symbol_reason: norigaeData.symbol_reason || '',
          knotImage: norigaeData.knotImage,
          decorationImage: norigaeData.decorationImage,
          tasselImage: norigaeData.tasselImage,
          tasselCount: norigaeData.tasselCount,
        };
        const prev = JSON.parse(localStorage.getItem('wcw_saved_items') || '[]');
        const updated = [savedItem, ...prev.filter((i) => (i.id ?? i.item_id) !== savedItem.id)];
        localStorage.setItem('wcw_saved_items', JSON.stringify(updated));
      } catch (err) {
        console.error('로컬 스토리지 캐시 실패:', err);
      }
      setTitle(finalTitle);
      setSavedItemId(savedItem.id);
      setSaved(true);
    } else if (result.status === 401) {
      navigate('/login');
    } else if (result.status === 400) {
      const errors = result.errors;
      if (errors && typeof errors === 'object') {
        const firstKey = Object.keys(errors)[0];
        const firstError = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
        alert(`[${firstKey}] 오류: ${firstError}`);
      } else {
        alert('입력값을 확인해 주세요.');
      }
    } else {
      alert(result.message || '저장에 실패했습니다.');
    }
  };

  if (saved) {
    return (
      <div className="naming-page-container">
        <div className="naming-bg-accent" />
        <div className="naming-success-icon">
          <img src={successCheckIcon} alt="" />
        </div>
        <div className="naming-content">
          <div className="naming-heading">
            <h1 className="naming-title">디자인 저장 완료</h1>
            <p className="naming-desc">나만의 노리개 디자인이 저장되었습니다.</p>
          </div>

          <NorigaePreview norigaeData={norigaeData} tasselCountClass={tasselCountClass} />

          <div className="naming-input-wrap naming-input-wrap--filled">
            <input
              type="text"
              className="naming-input"
              value={title}
              readOnly
            />
          </div>

          {recommendProducts.length > 0 && (
            <div className="mcm-recommend-list">
              <div className="mcm-recommend-title">함께 어울리는 MCM 상품</div>
              <div className="mcm-recommend-cards">
                {recommendProducts.map((product) => (
                  <a
                    key={product.id}
                    href={product.mcm_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mcm-product-card"
                  >
                    <img src={product.image_url} alt={product.name} className="mcm-product-img" />
                    <span className="mcm-product-name">{product.name}</span>
                    <span className="mcm-product-price">{product.price.toLocaleString()}원</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="naming-success-btn-group">
            <button className="naming-btn naming-btn--primary" onClick={() => navigate('/mypage')}>
              나만의 컬렉션 보기
            </button>
            <div className="naming-success-btn-row">
              <button className="naming-btn naming-btn--light" onClick={() => navigate('/editor')}>
                계속 편집하기
              </button>
              <button
                className="naming-btn naming-btn--yellow"
                onClick={() => navigate('/reservation', { state: { norigaeData: { ...norigaeData, title } } })}
              >
                매장 예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="naming-page-container">
      <div className="naming-bg-accent" />
      <div className="naming-content">
        <div className="naming-heading">
          <h1 className="naming-title">노리개 이름을 만들어주세요.</h1>
          <p className="naming-desc">
            노리개 이름은 랭킹, 제작권 등록 등 다양한 서비스에서 활용됩니다.
          </p>
        </div>

        <NorigaePreview norigaeData={norigaeData} tasselCountClass={tasselCountClass} />

        <div className={`naming-input-wrap ${isFilled ? 'naming-input-wrap--filled' : ''}`}>
          <input
            type="text"
            className="naming-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="노리개 이름을 작성해주세요."
            maxLength={20}
          />
        </div>

        <button
          className={`naming-btn naming-btn--full ${isFilled ? 'naming-btn--active' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '저장 중...' : '노리개 저장하기'}
        </button>
      </div>
    </div>
  );
}
