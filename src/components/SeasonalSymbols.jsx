import { useEffect, useState } from 'react'
import './SeasonalSymbols.css'
import { getCurrentSeason, getComponents } from '../api/season.js'
import cicadaKnotImg from '../assets/seasonal-cicada-knot.png'
import hibiscusImg from '../assets/seasonal-hibiscus.png'
import craneJadeImg from '../assets/seasonal-crane-jade.png'
import coralTasselImg from '../assets/seasonal-coral-tassel.png'

// ponytail: API의 image_url은 실제 이미지가 아닌 식별자라 컴포넌트 name으로 로컬 이미지에 매핑.
// 새 시즌 상징이 늘어나면 여기에 항목 추가.
const SEASON_SYMBOL_IMAGES = {
  '매미 매듭': cicadaKnotImg,
  '무궁화 장식': hibiscusImg,
  '학 장식': craneJadeImg,
  '코랄 술': coralTasselImg,
}

export default function SeasonalSymbols() {
  const [symbols, setSymbols] = useState(null) // null: 로딩/시즌 없음, []: 시즌은 있으나 상징 없음
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const season = await getCurrentSeason()
      if (!season || cancelled) {
        if (!cancelled) setSymbols([])
        return
      }
      const components = await getComponents({ season: season.id })
      if (cancelled) return
      const featured = components.filter((component) => component.feature_image_url)
      setSymbols(featured)
      setActiveId(featured[0]?.id ?? null)
    }
    load().catch(() => setSymbols([]))
    return () => {
      cancelled = true
    }
  }, [])

  // ponytail: fixed 4s cadence, add a slower/faster control if design ever asks for it
  useEffect(() => {
    if (!symbols || symbols.length < 2) return
    const id = setInterval(() => {
      setActiveId((current) => {
        const nextIndex = (symbols.findIndex((symbol) => symbol.id === current) + 1) % symbols.length
        return symbols[nextIndex].id
      })
    }, 4000)
    return () => clearInterval(id)
  }, [symbols])

  const featured = symbols?.find((symbol) => symbol.id === activeId)

  return (
    <section className="seasonal-symbols">
      <div className="seasonal-symbols__heading">
        <h2 className="seasonal-symbols__title">시즌 상징</h2>
        <p className="seasonal-symbols__description">이번 시즌에서만 사용할 수 있는 노리개 디자인입니다.</p>
      </div>
      {featured ? (
        <div className="seasonal-symbols__grid">
          <div
            key={featured.id}
            className="seasonal-symbols__feature"
            style={{ backgroundImage: `url(${SEASON_SYMBOL_IMAGES[featured.name]})` }}
          >
            <div className="seasonal-symbols__feature-scrim" />
            <div className="seasonal-symbols__feature-text">
              <h3 className="seasonal-symbols__feature-title">{featured.name}</h3>
              <p className="seasonal-symbols__feature-description">{featured.feature_description}</p>
            </div>
          </div>
          <div className="seasonal-symbols__thumbs">
            {symbols.map((symbol) => (
              <button
                key={symbol.id}
                type="button"
                className={`seasonal-symbols__thumb${
                  symbol.id === activeId ? ' seasonal-symbols__thumb--active' : ''
                }`}
                style={{ backgroundImage: `url(${SEASON_SYMBOL_IMAGES[symbol.name]})` }}
                onClick={() => setActiveId(symbol.id)}
                aria-label={symbol.name}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="seasonal-symbols__description">진행 중인 시즌 상징이 없습니다.</p>
      )}
    </section>
  )
}
