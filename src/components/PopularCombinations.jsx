import { useEffect, useState } from 'react'
import './PopularCombinations.css'
import heartIcon from '../assets/heart-icon.svg'
import heartIconFilled from '../assets/heart-icon-filled.svg'
import CombinationDetailModal from './CombinationDetailModal.jsx'
import { getRankings } from '../api/rankings.js'

export default function PopularCombinations() {
  const [rankings, setRankings] = useState([])
  const [likedRanks, setLikedRanks] = useState([])
  const [selectedRank, setSelectedRank] = useState(null)

  useEffect(() => {
    getRankings()
      .then(setRankings)
      .catch(() => setRankings([]))
  }, [])

  function toggleLike(rank) {
    setLikedRanks((current) =>
      current.includes(rank) ? current.filter((liked) => liked !== rank) : [...current, rank],
    )
  }

  const selectedCombination = rankings.find((combination) => combination.rank === selectedRank) ?? null

  return (
    <section className="popular-combinations">
      <div className="popular-combinations__heading">
        <h2 className="popular-combinations__title">인기 조합</h2>
        <p className="popular-combinations__description">
          우리 커뮤니티가 제작한 가장 인기 있는 노리개 디자인을 발견하고 한정 생산을 고려해보세요.
        </p>
      </div>
      {rankings.length === 0 ? (
        <p className="popular-combinations__description">아직 저장된 조합이 없습니다.</p>
      ) : (
        <div className="popular-combinations__list">
          {rankings.map(({ rank, title, description, creator }) => {
            const liked = likedRanks.includes(rank)
            return (
              <article
                className="combination-card"
                key={rank}
                onClick={() => setSelectedRank(rank)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => event.key === 'Enter' && setSelectedRank(rank)}
              >
                <div className="combination-card__thumb">
                  <span
                    className={`combination-card__rank${rank === 1 ? ' combination-card__rank--top' : ''}`}
                  >
                    {rank}
                  </span>
                </div>
                <div className="combination-card__body">
                  <span className="combination-card__badge">인기</span>
                  <h3 className="combination-card__title">{title}</h3>
                  <p className="combination-card__description">{description}</p>
                  <div className="combination-card__footer">
                    <span className="combination-card__author">@{creator} 님 제작</span>
                    <button
                      className="combination-card__like"
                      type="button"
                      aria-label="좋아요"
                      aria-pressed={liked}
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleLike(rank)
                      }}
                    >
                      <img src={liked ? heartIconFilled : heartIcon} alt="" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <CombinationDetailModal
        combination={selectedCombination}
        liked={selectedRank !== null && likedRanks.includes(selectedRank)}
        onToggleLike={() => toggleLike(selectedRank)}
        onClose={() => setSelectedRank(null)}
      />
    </section>
  )
}
