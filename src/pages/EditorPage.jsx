import { useState } from 'react'
import './EditorPage.css'
import saveIcon from '../assets/save-outline-icon.svg'
import shareIcon from '../assets/share.svg'
import aiSparkleIcon from '../assets/ai-sparkle-icon.svg'
import refreshIcon from '../assets/refresh-icon.svg'
import meaningSparkleIcon from '../assets/meaning-sparkle-icon.svg'
import calendarCheckIcon from '../assets/calendar-check-icon.svg'
import optionPlaceholderIcon from '../assets/option-placeholder-icon.svg'
import loadingSpinnerIcon from '../assets/loading-spinner-icon.svg'
import { getAiRecommendation, saveNorigaeDesign } from '../api/norigaeApi'

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

// 하드코딩: 추천 상품 목록. 이미지는 아직 붙이지 않고 자리만 확보 — 추후 상품 추천 API로 대체
const RECOMMENDED_PRODUCTS = [
  { id: 'p1', badge: '완벽한 조합', name: 'Aren 비세토스 코스메틱 파우치', price: '₩590,000' },
  { id: 'p2', name: 'Ottomar 비세토스 토일레트리 백', price: '₩790,000' },
]

// ponytail: 위 매듭/장식/술 선택 그리드는 아직 실제 컴포넌트 ID가 아닌 자리표시자라
// 저장 시엔 AI 추천으로 받은 knot/decoration id와 이 기본 술 id를 사용합니다.
// 그리드가 실제 GET /api/components/ 데이터로 교체되면 지워도 됩니다.
const DEFAULT_TASSEL_ID = 13

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
  const [recommendation, setRecommendation] = useState(null)
  const [excludeCombinations, setExcludeCombinations] = useState([])
  const [title, setTitle] = useState('')

  async function requestAiRecommendation() {
    if (!keyword.trim() || aiStage === 'loading') return
    if (excludeCombinations.length >= 3) {
      alert('추천은 최대 3번까지만 가능합니다.')
      return
    }

    const trimmedKeyword = keyword.trim()
    setSubmittedKeyword(trimmedKeyword)
    setAiStage('loading')

    const result = await getAiRecommendation(trimmedKeyword, excludeCombinations)

    if (result.success) {
      const data = result.data
      setRecommendation(data)
      setTitle((current) => current || data.suggested_title || '')
      setSelectedKnot(data.knot)
      setSelectedOrnament(data.decoration)
      setSelectedTassel((current) => current ?? DEFAULT_TASSEL_ID)
      setExcludeCombinations((prev) => [...prev, { knot: data.knot, decoration: data.decoration }])
      setAiStage('result')
    } else {
      setAiStage('idle')
      alert(result.message || '추천 요청 중 오류가 발생했습니다.')
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      alert('제목을 입력해야 저장할 수 있습니다.')
      return
    }
    if (!selectedKnot || !selectedOrnament) {
      alert('먼저 AI 추천을 받아 매듭과 장식을 정해주세요.')
      return
    }

    const result = await saveNorigaeDesign({
      wish_keyword: submittedKeyword || keyword,
      symbol_reason: recommendation?.reason || '',
      knot: Number(selectedKnot),
      decoration: Number(selectedOrnament),
      tassel: Number(selectedTassel ?? DEFAULT_TASSEL_ID),
      color: selectedColorHex || '',
      title,
    })

    if (result.success) {
      alert('노리개 디자인이 성공적으로 저장되었습니다!')
    } else if (result.status === 401) {
      alert('로그인이 필요한 서비스입니다.')
    } else if (result.status === 400 && result.errors) {
      const [firstField, firstMessages] = Object.entries(result.errors)[0] ?? []
      alert(firstMessages?.[0] ? `${firstField} 오류: ${firstMessages[0]}` : '입력값을 확인해 주세요.')
    } else {
      alert(result.message || '디자인 저장 중 오류가 발생했습니다.')
    }
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
              {/* 스파클 아이콘은 입력 전/후 관계없이 항상 왼쪽 고정, 클릭하면 AI 추천 제출 */}
              <button type="button" className="btn-ai" aria-label="AI 추천 받기" onClick={requestAiRecommendation}>
                <img src={aiSparkleIcon} alt="" className="btn-icon" />
              </button>
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && requestAiRecommendation()}
                placeholder="예: 번영, 건강..."
              />
            </div>
            <p className="hint">
              소망을 입력하면 AI 추천을 받을 수 있습니다. ({excludeCombinations.length}/3회 사용)
            </p>
            <button
              type="button"
              className="btn-text"
              onClick={requestAiRecommendation}
              disabled={!keyword.trim() || aiStage === 'loading' || excludeCombinations.length >= 3}
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
                  입력하신 키워드, '<strong className="highlight">{submittedKeyword}</strong>'에 어울리는 조합을
                  추천했어요.
                </p>
                <blockquote className="quote-box">{recommendation?.reason}</blockquote>
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
            <button type="button" className="btn-secondary" onClick={handleSave}>
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
