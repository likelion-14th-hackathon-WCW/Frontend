import { useEffect, useRef, useState } from 'react'
import './EditorPage.css'
import saveIcon from '../assets/save-outline-icon.svg'
import shareIcon from '../assets/share.svg'
import aiSparkleIcon from '../assets/ai-sparkle-icon.svg'
import refreshIcon from '../assets/refresh-icon.svg'
import meaningSparkleIcon from '../assets/meaning-sparkle-icon.svg'
import calendarCheckIcon from '../assets/calendar-check-icon.svg'
import optionPlaceholderIcon from '../assets/option-placeholder-icon.svg'
import loadingSpinnerIcon from '../assets/loading-spinner-icon.svg'

// 하드코딩: 실 색상 팔레트. 추후 구성요소 관리 API 데이터로 대체 예정
const THREAD_COLORS = [
  { id: 'navy', hex: '#17216e' },
  { id: 'pink', hex: '#feb9e3' },
  { id: 'yellow', hex: '#ffc95f' },
  { id: 'green', hex: '#369f39' },
  { id: 'red', hex: '#f37e7e', limited: true },
]

// 하드코딩: 매듭 옵션 3종. 추후 구성요소 관리 API 데이터로 대체 예정
const KNOT_OPTIONS = [{ id: 'knot-1' }, { id: 'knot-2', limited: true }, { id: 'knot-3', limited: true }]

// 하드코딩: 메인 장식 옵션 2종. 라벨은 Figma 시안의 임시 텍스트("text")를 그대로 사용
const ORNAMENT_OPTIONS = [
  { id: 'ornament-1', label: 'text' },
  { id: 'ornament-2', label: 'text', limited: true },
]

// 하드코딩: 술 옵션 2종. 추후 구성요소 관리 API 데이터로 대체 예정
const TASSEL_OPTIONS = [{ id: 'tassel-1', limited: true }, { id: 'tassel-2' }]

// 하드코딩: AI 추천 예시 문구("성장"은 예시일 뿐 — 실제로는 submittedKeyword를 사용).
// 매듭/장식 이름과 의미 문구 자체는 백엔드 연동 전까지의 고정 예시
const AI_KNOT_NAME = '국화 매듭'
const AI_ORNAMENT_NAME = '골드 타이거 장식'
const AI_MEANING_TEXT =
  '"호랑이는 나쁜 기운을 물리치고, 국화는 장수와 인내를 상징합니다. 함께 어우러져 성공과 보호를 기원하는 강력한 부적이 됩니다."'

// 하드코딩: 추천 상품 목록. 이미지는 아직 붙이지 않고 자리만 확보 — 추후 상품 추천 API로 대체
const RECOMMENDED_PRODUCTS = [
  { id: 'p1', badge: '완벽한 조합', name: 'Aren 비세토스 코스메틱 파우치', price: '₩590,000' },
  { id: 'p2', name: 'Ottomar 비세토스 토일레트리 백', price: '₩790,000' },
]

// 백엔드 연동 전까지 AI 응답을 흉내내는 지연 시간(ms). 실제 API 연동 시 이 setTimeout을 fetch 호출로 교체
const MOCK_AI_DELAY_MS = 1200

export default function EditorPage() {
  // 새로고침/최초 진입 시에는 아무 것도 선택되지 않은 상태로 시작
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedKnot, setSelectedKnot] = useState(null)
  const [selectedOrnament, setSelectedOrnament] = useState(null)
  const [selectedTassel, setSelectedTassel] = useState(null)

  const [keyword, setKeyword] = useState('')
  // aiStage: 'idle' → 입력 전/미제출, 'loading' → AI 응답 대기, 'result' → 응답 도착
  const [aiStage, setAiStage] = useState('idle')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const aiTimeoutRef = useRef(null)

  useEffect(() => () => clearTimeout(aiTimeoutRef.current), [])

  function requestAiRecommendation() {
    if (!keyword.trim() || aiStage === 'loading') return
    setSubmittedKeyword(keyword.trim())
    setAiStage('loading')
    // TODO: 백엔드 연동 시 아래 setTimeout을 실제 AI 추천 API 호출로 교체
    aiTimeoutRef.current = setTimeout(() => setAiStage('result'), MOCK_AI_DELAY_MS)
  }

  // 실 색상 미선택 시 기본값(#e5e5e5 / #999999), 선택 시 해당 색상(옅은/진한 톤)으로 미리보기에 반영
  const selectedColorHex = THREAD_COLORS.find((color) => color.id === selectedColor)?.hex
  const threadColorStyle = selectedColorHex
    ? {
        '--thread-solid': selectedColorHex,
        '--thread-faint': `${selectedColorHex}33`,
        '--thread-edge': `${selectedColorHex}cc`,
      }
    : undefined

  const hasResult = aiStage === 'result'

  return (
    <div className="editor-main-container">
      <aside className="sidebar-left">
        <div className="sidebar-left__header">
          <h2>나만의 노리개 만들기</h2>
          <p className="subtitle">전통 한국 장신구를 현대적인 감각으로 직접 디자인해보세요.</p>
        </div>

        <div className="sidebar-left__scroll">
          <div className="input-group">
            <label>소망 또는 키워드 입력</label>
            <div className="input-with-icon">
              {/* 키워드 입력 전에는 스파클 아이콘을 인풋 왼쪽 안내 아이콘으로, 입력 중에는 오른쪽 제출 버튼으로 표시 */}
              {!keyword && <img src={aiSparkleIcon} alt="" className="btn-icon input-leading-icon" />}
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && requestAiRecommendation()}
                placeholder="예: 번영, 건강..."
              />
              {keyword && (
                <button type="button" className="btn-ai" aria-label="AI 추천 받기" onClick={requestAiRecommendation}>
                  <img src={aiSparkleIcon} alt="" className="btn-icon" />
                </button>
              )}
            </div>
            <p className="hint">소망을 입력하면 AI 추천을 받을 수 있습니다.</p>
            <button
              type="button"
              className="btn-text"
              onClick={requestAiRecommendation}
              disabled={!keyword.trim() || aiStage === 'loading'}
            >
              <img src={refreshIcon} alt="" className="btn-icon btn-icon--small" />
              추천 다시 받기
            </button>
          </div>

          <hr className="divider" />

          <div className="option-group">
            <div className="option-header">
              <span>실 색상 선택</span>
            </div>
            <div className="color-palette">
              {THREAD_COLORS.map((color) => (
                <button
                  type="button"
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`color-chip${color.id === selectedColor ? ' color-chip--selected' : ''}${color.limited ? ' color-chip--limited' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`${color.id} 색상 선택`}
                  aria-pressed={color.id === selectedColor}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <div className="option-header">
              <span>매듭 선택</span>
            </div>
            <div className="grid-3">
              {KNOT_OPTIONS.map((knot) => (
                <button
                  type="button"
                  key={knot.id}
                  onClick={() => setSelectedKnot(knot.id)}
                  aria-pressed={knot.id === selectedKnot}
                  className={`square-item${knot.id === selectedKnot ? ' selected' : ''}`}
                >
                  {/* 매듭 썸네일: 실제 매듭 이미지 연동 전까지 플레이스홀더 아이콘 사용 */}
                  <img src={optionPlaceholderIcon} alt="" className="square-item__icon" />
                  {knot.limited && <span className="limited-badge" aria-label="시즌 한정판" />}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <div className="option-header">
              <span>메인 장식</span>
            </div>
            <div className="grid-2">
              {ORNAMENT_OPTIONS.map((ornament) => (
                <button
                  type="button"
                  key={ornament.id}
                  onClick={() => setSelectedOrnament(ornament.id)}
                  aria-pressed={ornament.id === selectedOrnament}
                  className={`card-item${ornament.id === selectedOrnament ? ' selected' : ''}`}
                >
                  <img src={optionPlaceholderIcon} alt="" className="square-item__icon" />
                  <span>{ornament.label}</span>
                  {ornament.limited && <span className="limited-badge" aria-label="시즌 한정판" />}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <div className="option-header">
              <span>술 선택</span>
            </div>
            <div className="grid-2">
              {TASSEL_OPTIONS.map((tassel) => (
                <button
                  type="button"
                  key={tassel.id}
                  onClick={() => setSelectedTassel(tassel.id)}
                  aria-pressed={tassel.id === selectedTassel}
                  className={`square-item${tassel.id === selectedTassel ? ' selected' : ''}`}
                >
                  <img src={optionPlaceholderIcon} alt="" className="square-item__icon" />
                  {tassel.limited && <span className="limited-badge" aria-label="시즌 한정판" />}
                </button>
              ))}
            </div>
          </div>

          <div className="legend">
            <span className="legend__dot" />
            <span>시즌 한정판</span>
          </div>
        </div>
      </aside>

      <section className="editor-canvas">
        {aiStage === 'loading' ? (
          // AI 추천 대기 화면: 백엔드 연동 전까지는 MOCK_AI_DELAY_MS 이후 자동으로 결과로 전환됨
          <div className="editor-canvas-loading">
            <img src={loadingSpinnerIcon} alt="" className="editor-canvas-loading__spinner" />
            <p>AI가 입력한 소망과 어울리는 노리개 조합을 생각하고 있어요.</p>
          </div>
        ) : (
          <>
            {/* 노리개 실시간 미리보기: 실 색상 선택은 아래 --thread-* 변수로 연동됨.
                매듭/장식/술 모양 자체가 선택에 따라 바뀌는 것은 아직 고정 렌더링 — 에디터 상태관리 작업에서 이어서 처리 예정 */}
            <div className="preview-canvas">
              <div className="norigae-preview" style={threadColorStyle}>
                <div className="norigae-preview__loop" />
                <div className="norigae-preview__knot">
                  <div className="norigae-preview__knot-border" />
                </div>
                <div className="norigae-preview__connection" />
                <div className="norigae-preview__ornament" />
                <div className="norigae-preview__knot2" />
                <div className="norigae-preview__bead">
                  <div className="norigae-preview__bead-border" />
                </div>
                <div className="norigae-preview__tassels">
                  <span className="norigae-preview__tassel norigae-preview__tassel--edge" />
                  <span className="norigae-preview__tassel" />
                  <span className="norigae-preview__tassel norigae-preview__tassel--center" />
                  <span className="norigae-preview__tassel" />
                  <span className="norigae-preview__tassel norigae-preview__tassel--edge" />
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <aside className="sidebar-right">
        <div className="sidebar-right__scroll">
          <div className="info-box">
            <h3>
              <img src={meaningSparkleIcon} alt="" className="btn-icon" />
              상징적 의미
            </h3>
            {hasResult ? (
              <>
                <p className="info-desc">
                  입력하신 키워드, '<strong className="highlight">{submittedKeyword}</strong>'에 맞춰 '
                  {AI_KNOT_NAME}'과 '{AI_ORNAMENT_NAME}'이 조합되었습니다.
                </p>
                <blockquote className="quote-box">{AI_MEANING_TEXT}</blockquote>
              </>
            ) : (
              <>
                <p className="info-desc">키워드를 입력하고 만들어진 노리개의 부여된 상징적 의미를 확인해 보세요.</p>
                <div className="quote-box quote-box--empty" aria-hidden="true" />
              </>
            )}
            <button type="button" className="btn-text" disabled={!hasResult}>
              <img src={refreshIcon} alt="" className="btn-icon btn-icon--small" />
              추천 받은 노리개로 되돌리기
            </button>
          </div>

          <div className="product-recommendation">
            <h3 className="product-recommendation__title">함께 어울리는 MCM 상품</h3>
            {hasResult ? (
              <>
                <p className="subtitle">AI가 추천으로 만든 노리개와 어울리는 MCM 상품을 소개합니다.</p>
                {RECOMMENDED_PRODUCTS.map((product) => (
                  <div className="product-card" key={product.id}>
                    {/* 상품 이미지 자리 표시자: MCM 상품 이미지는 아직 붙이지 않음.
                        실제 상품 데이터/이미지 연동 시 이 div를 <img>로 교체 */}
                    <div className="product-img" aria-hidden="true" />
                    <div className="product-info">
                      {product.badge && <span className="badge">{product.badge}</span>}
                      <p className="name">{product.name}</p>
                      <p className="price">{product.price}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="subtitle">노리개를 만들어 보고 MCM 상품을 추천받아 보세요.</p>
            )}
          </div>
        </div>

        <div className="editor-actions">
          <button type="button" className="btn-primary">
            <img src={calendarCheckIcon} alt="" className="btn-icon" />
            매장 예약하기
          </button>
          <div className="btn-row">
            <button type="button" className="btn-secondary">
              <img src={saveIcon} alt="" className="btn-icon" />
              디자인 저장하기
            </button>
            <button type="button" className="btn-secondary">
              <img src={shareIcon} alt="" className="btn-icon" />
              공유하기
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
