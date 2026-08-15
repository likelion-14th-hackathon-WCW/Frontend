import { useEffect, useState } from 'react'
import './SeasonalSymbols.css'
import thumb1 from '../assets/seasonal-symbol-thumb-1.png'
import thumb2 from '../assets/seasonal-symbol-thumb-2.png'
import thumb3 from '../assets/seasonal-symbol-thumb-3.png'
import thumb4 from '../assets/seasonal-symbol-thumb-4.png'

const images = [
  { id: 'thumb1', src: thumb1 },
  { id: 'thumb2', src: thumb2 },
  { id: 'thumb3', src: thumb3 },
  { id: 'thumb4', src: thumb4 },
]

export default function SeasonalSymbols() {
  const [activeId, setActiveId] = useState(images[0].id)
  const featured = images.find((image) => image.id === activeId)

  // ponytail: fixed 4s cadence, add a slower/faster control if design ever asks for it
  useEffect(() => {
    const id = setInterval(() => {
      setActiveId((current) => {
        const nextIndex = (images.findIndex((image) => image.id === current) + 1) % images.length
        return images[nextIndex].id
      })
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="seasonal-symbols">
      <div className="seasonal-symbols__heading">
        <h2 className="seasonal-symbols__title">시즌 상징</h2>
        <p className="seasonal-symbols__description">이번 시즌에서만 사용할 수 있는 노리개 디자인입니다.</p>
      </div>
      <div className="seasonal-symbols__grid">
        <div
          key={featured.id}
          className="seasonal-symbols__feature"
          style={{ backgroundImage: `url(${featured.src})` }}
        >
          <div className="seasonal-symbols__feature-scrim" />
          <div className="seasonal-symbols__feature-text">
            <h3 className="seasonal-symbols__feature-title">연꽃 비취</h3>
            <p className="seasonal-symbols__feature-description">
              순수함과 깨달음을 상징하며,
              <br />
              봄 컬렉션을 위해 독점적으로 공급되었습니다.
            </p>
          </div>
        </div>
        <div className="seasonal-symbols__thumbs">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              className={`seasonal-symbols__thumb${
                image.id === activeId ? ' seasonal-symbols__thumb--active' : ''
              }`}
              style={{ backgroundImage: `url(${image.src})` }}
              onClick={() => setActiveId(image.id)}
              aria-label="이 디자인을 크게 보기"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
