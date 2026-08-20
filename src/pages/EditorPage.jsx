import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAiRecommendation } from '../api/norigaeApi';
import { useAuth } from '../hooks/useAuth.js';
import LoginModal from '../components/LoginModal';
import './EditorPage.css';
import shareIcon from '../assets/editor-share.svg';
import checkIcon from '../assets/calendar-check-02.svg';
import checkIcon2 from '../assets/calendar-check-03.svg';
import downloadIcon from '../assets/editor-download.svg';
import meansIcon from '../assets/editor-means.svg';
import knotMaemi from '../assets/editor-items/knot-maemi.svg';
import knotSamjeongja from '../assets/editor-items/knot-samjeongja.svg';
import knotDongsimgyeol from '../assets/editor-items/knot-dongsimgyeol.svg';
import knotJanggu from '../assets/editor-items/knot-janggu.svg';
import knotSaengjjok from '../assets/editor-items/knot-saengjjok.svg';
import knotGuidorae from '../assets/editor-items/knot-guidorae.svg';
import decoMugunghwa from '../assets/editor-items/deco-mugunghwa.svg';
import decoCrane from '../assets/editor-items/deco-crane.svg';
import decoAmber from '../assets/editor-items/deco-amber.svg';
import decoWhale from '../assets/editor-items/deco-whale.svg';
import decoButterfly from '../assets/editor-items/deco-butterfly.svg';
import decoLotus from '../assets/editor-items/deco-lotus.svg';
import tassel1 from '../assets/editor-items/tassel-1.svg';
import tassel2 from '../assets/editor-items/tassel-2.svg';
import tassel3 from '../assets/editor-items/tassel-3.svg';

// 실 색상(hex) -> 조합 에셋 파일명에 쓰인 색상 키
const COLOR_KEY_BY_HEX = {
  '#17216E': 'navy',
  '#FEB9E3': 'pink',
  '#FFC95F': 'yellow',
  '#369F39': 'green',
  '#F37E7E': 'coral',
};

// knot-{key}-{color}.svg / tassel-{count}-{color}.svg 전체를 한 번에 로드
function loadComboAssets(pattern) {
  const modules = import.meta.glob('../assets/editor-combo/*.svg', { eager: true, import: 'default' });
  const map = {};
  for (const path in modules) {
    const name = path.split('/').pop().replace('.svg', '');
    if (pattern.test(name)) map[name] = modules[path];
  }
  return map;
}
const KNOT_COMBO_ASSETS = loadComboAssets(/^knot-/);
const TASSEL_COMBO_ASSETS = loadComboAssets(/^tassel-/);

// ponytail: decorative scroll thumb sized/positioned from real scroll metrics, not hand-tuned px
function useHorizontalScrollThumb() {
  const ref = useRef(null);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    if (scrollWidth <= clientWidth) {
      setThumb({ width: 100, left: 0 });
      return;
    }
    const widthPct = (clientWidth / scrollWidth) * 100;
    const maxLeftPct = 100 - widthPct;
    const leftPct = (scrollLeft / (scrollWidth - clientWidth)) * maxLeftPct;
    setThumb({ width: widthPct, left: leftPct });
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return { ref, thumb, onScroll: update };
}

export default function EditorPage() {
  const navigate = useNavigate();

  // 부품 목록 상태 (기본 더미 데이터 지정 & 중복 선언 제거)
  const [components, setComponents] = useState([
    { pk: 1, type: 'knot', name: '매미 매듭', season: true, image: knotMaemi, comboKey: 'maemi' },
    { pk: 2, type: 'knot', name: '삼정자 매듭', season: false, image: knotSamjeongja, comboKey: 'samjeongja' },
    { pk: 3, type: 'knot', name: '동심결 매듭', season: false, image: knotDongsimgyeol, comboKey: 'dongsimgyeol' },
    { pk: 4, type: 'knot', name: '장구 매듭', season: false, image: knotJanggu, comboKey: 'janggu' },
    { pk: 5, type: 'knot', name: '생쪽 매듭', season: false, image: knotSaengjjok, comboKey: 'saengjjok' },
    { pk: 6, type: 'knot', name: '귀도래 매듭', season: false, image: knotGuidorae, comboKey: 'guidorae' },
    { pk: 7, type: 'decoration', name: '무궁화', season: true, image: decoMugunghwa },
    { pk: 8, type: 'decoration', name: '학', season: true, image: decoCrane },
    { pk: 9, type: 'decoration', name: '호박보석', season: false, image: decoAmber },
    { pk: 10, type: 'decoration', name: '고래', season: false, image: decoWhale },
    { pk: 11, type: 'decoration', name: '나비', season: false, image: decoButterfly },
    { pk: 12, type: 'decoration', name: '연꽃', season: false, image: decoLotus },
    { pk: 13, type: 'tassel', name: '1개', season: false, image: tassel1, count: 1 },
    { pk: 14, type: 'tassel', name: '2개', season: false, image: tassel2, count: 2 },
    { pk: 15, type: 'tassel', name: '3개', season: false, image: tassel3, count: 3 },
  ]);

  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');

  const [recommendation, setRecommendation] = useState(null);
  const [excludeCombinations, setExcludeCombinations] = useState([]);

  // 선택된 Component PK (초기 상태: 아무것도 선택되지 않음)
  const [selectedKnot, setSelectedKnot] = useState(null);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [selectedTassel, setSelectedTassel] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  const knotScroll = useHorizontalScrollThumb();
  const decoScroll = useHorizontalScrollThumb();

  // TODO: 백엔드 API 연동 시 사용
  /*
  useEffect(() => {
    async function fetchComponents() {
      const data = await getComponentsApi();
      if (data && data.length > 0) setComponents(data);
    }
    fetchComponents();
  }, []);
  */

  const knots = components.filter((item) => item.type === 'knot');
  const decorations = components.filter((item) => item.type === 'decoration');
  const tassels = components.filter((item) => item.type === 'tassel');

  const activeKnotObj = components.find((item) => item.pk === Number(selectedKnot));
  const activeDecoObj = components.find((item) => item.pk === Number(selectedDecoration));
  const activeTasselObj = components.find((item) => item.pk === Number(selectedTassel));
  const colorKey = COLOR_KEY_BY_HEX[selectedColor];

  // 매듭/장식/술/색상까지 노리개 스펙을 모두 골라야 예약·저장·공유가 가능
  const allSpecsSelected = Boolean(
    selectedKnot && selectedDecoration && selectedTassel && selectedColor
  );

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
        setTitle(data.suggested_title ?? '');
      } else {
        setRecommendation((prev) => ({
          ...prev,
          knot: data.knot,
          decoration: data.decoration,
          reason: data.reason || prev.reason,
        }));
      }

      setSelectedKnot(Number(data.knot));
      setSelectedDecoration(Number(data.decoration));

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
        setSelectedKnot(Number(recommendation.knot));
        setSelectedDecoration(Number(recommendation.decoration));
      } else {
        setSelectedKnot(1);
        setSelectedDecoration(7);
      }
      setSelectedTassel(13);
      setSelectedColor('#1E293B');
    }
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!allSpecsSelected) {
      alert('매듭, 메인 장식, 술, 실 색상을 모두 선택해 주세요.');
      return;
    }

    navigate('/editor/naming', {
      state: {
        norigaeData: {
          wish_keyword: keyword || '',
          symbol_reason: recommendation?.reason || '사용자 지정 노리개 디자인',
          knot: Number(selectedKnot),
          tassel: Number(selectedTassel),
          tassel_count: 1, // 백엔드가 수량을 기대하는 경우 기본 1개로 전송
          decoration: Number(selectedDecoration),
          color: selectedColor,
          defaultTitle: `${activeKnotObj?.name || '커스텀'} 노리개`,
          knotImage: KNOT_COMBO_ASSETS[`knot-${activeKnotObj.comboKey}-${colorKey}`],
          decorationImage: activeDecoObj.image,
          tasselImage: TASSEL_COMBO_ASSETS[`tassel-${activeTasselObj.count}-${colorKey}`],
          tasselCount: activeTasselObj.count,
        },
      },
    });
  };

  const handleShare = () => {
    navigate('/editor/share', {
      state: {
        norigaeData: {
          title: title || `${activeKnotObj?.name || '커스텀'} 노리개`,
          knotImage: KNOT_COMBO_ASSETS[`knot-${activeKnotObj.comboKey}-${colorKey}`],
          decorationImage: activeDecoObj.image,
          tasselImage: TASSEL_COMBO_ASSETS[`tassel-${activeTasselObj.count}-${colorKey}`],
          tasselCount: activeTasselObj.count,
        },
      },
    });
  };

  const handleGoToReservation = () => {
    navigate('/reservation', {
      state: {
        norigaeData: {
          title: title || '',
          keyword: keyword || '',
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
            <span className="sparkle-icon">
              <img
                src={meansIcon}
                alt=""
                style={{ width: '18.33px', height: '18.33px' }}
              />
            </span>
            <input
              id="wish-keyword-input"
              name="wishKeyword"
              type="text"
              className="keyword-field"
              value={keyword || ''}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 번영, 건강... "
              maxLength={10}
            />
          </div>

          <div className="sub-text-group">
            <p className="helper-text">
              소망을 입력하면 AI 추천을 받을 수 있습니다.
            </p>
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
            {['#17216E', '#FEB9E3', '#FFC95F', '#369F39', '#F37E7E'].map(
              (col, idx) => (
                <div
                  key={col}
                  className={`color-dot ${selectedColor === col ? 'active' : ''
                    }`}
                  style={{ backgroundColor: col }}
                  onClick={() => setSelectedColor(col)}
                >
                  {idx === 4 && <span className="badge-dot" />}
                </div>
              )
            )}
          </div>

          <label className="input-label">매듭 선택</label>
          <div
            className="option-cards-scroll"
            ref={knotScroll.ref}
            onScroll={knotScroll.onScroll}
          >
            {knots.map((item) => (
              <div
                key={item.pk}
                className={`item-thumb-card ${selectedKnot === item.pk ? 'active' : ''
                  }`}
                onClick={() => setSelectedKnot(item.pk)}
              >
                <div className="item-thumb-box">
                  <img className="item-thumb-img" src={item.image} alt="" />
                  {item.season && <span className="badge-dot" />}
                  <span className="item-thumb-label">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-track">
            <div
              className="scroll-thumb"
              style={{ width: `${knotScroll.thumb.width}%`, left: `${knotScroll.thumb.left}%` }}
            />
          </div>

          <label className="input-label">메인 장식</label>
          <div
            className="option-cards-scroll"
            ref={decoScroll.ref}
            onScroll={decoScroll.onScroll}
          >
            {decorations.map((item) => (
              <div
                key={item.pk}
                className={`item-thumb-card ${selectedDecoration === item.pk ? 'active' : ''
                  }`}
                onClick={() => setSelectedDecoration(item.pk)}
              >
                <div className="item-thumb-box">
                  <img className="item-thumb-img" src={item.image} alt="" />
                  {item.season && <span className="badge-dot" />}
                  <span className="item-thumb-label">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-track">
            <div
              className="scroll-thumb"
              style={{ width: `${decoScroll.thumb.width}%`, left: `${decoScroll.thumb.left}%` }}
            />
          </div>

          <label className="input-label">술 선택</label>
          <div className="option-cards-row">
            {tassels.map((item) => (
              <div
                key={item.pk}
                className={`item-thumb-card ${selectedTassel === item.pk ? 'active' : ''
                  }`}
                onClick={() => setSelectedTassel(item.pk)}
              >
                <div className="item-thumb-box">
                  <img className="item-thumb-img" src={item.image} alt="" />
                  <span className="item-thumb-label">{item.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="season-legend">
            <span className="season-legend-dot" /> 시즌 한정판
          </div>
        </div>

        <div className="panel-center">
          {loading ? (
            <div className="canvas-state-box">
              <div className="loading-spinner">🔆</div>
              <p className="canvas-loading-text">
                AI가 입력한 소망과 어울리는 노리개 조합을 생각하고 있어요.
              </p>
            </div>
          ) : !allSpecsSelected ? (
            <div className="canvas-state-box">
              <p className="canvas-loading-text">
                매듭, 메인 장식, 술, 실 색상을 모두 선택하면 노리개 미리보기가 나타납니다.
              </p>
            </div>
          ) : (
            <div className="norigae-render-container">
              <img
                className="knot-part"
                src={KNOT_COMBO_ASSETS[`knot-${activeKnotObj.comboKey}-${colorKey}`]}
                alt="매듭"
              />
              <img
                className="decoration-part"
                src={activeDecoObj.image}
                alt="장식"
              />
              <img
                className={`tassel-part tassel-part--count-${activeTasselObj.count}`}
                src={TASSEL_COMBO_ASSETS[`tassel-${activeTasselObj.count}-${colorKey}`]}
                alt="술"
              />
            </div>
          )}

          {errorMsg && (
            <p
              className="error-text"
              style={{ color: '#e06666', fontSize: '12px', marginTop: '12px' }}
            >
              {errorMsg}
            </p>
          )}
        </div>

        <div className="panel-right">
          <div className="panel-right-top">
            <div className="symbol-section">
              <div className="symbol-header">
                <span className="sparkle-icon">
                  <img src={meansIcon} alt="" />
                </span>{' '}
                상징적 의미
              </div>
              <p className="symbol-body">
                키워드를 입력하고 만들어진 노리개의 부여된
                <br />
                상징적 의미를 확인해 보세요.
              </p>

              <div className="symbol-card-box">
                {recommendation?.reason ||
                  '키워드를 입력하고 만들어진 노리개의 부여된 상징적 의미를 확인해 보세요.'}
              </div>

              <button className="symbol-reset-btn" onClick={handleReset}>
                <span>↺</span> 추천 받은 노리개로 되돌리기
              </button>
            </div>

            <div className="mcm-recommend-box">
              <div className="mcm-title">함께 어울리는 MCM 상품</div>
              <div className="mcm-desc">
                노리개를 만들어 보고 MCM 상품을 추천받아 보세요.
              </div>
            </div>
          </div>

          <div className="bottom-action-container">
            <button
              className={`btn-full-action ${allSpecsSelected ? 'active' : ''}`}
              onClick={handleGoToReservation}
              disabled={!allSpecsSelected}
            >
              <img
                src={allSpecsSelected ? checkIcon2 : checkIcon}
                alt="예약"
              />
              매장 예약하기
            </button>

            <div className="btn-dual-group">
              <button
                className="btn-secondary-action"
                onClick={handleSave}
                disabled={!allSpecsSelected}
              >
                <img src={downloadIcon} alt="저장" /> 디자인 저장
              </button>
              <button
                className="btn-secondary-action"
                onClick={handleShare}
                disabled={!allSpecsSelected}
              >
                <img src={shareIcon} alt="공유" /> 공유하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}