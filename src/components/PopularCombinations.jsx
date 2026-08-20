import { useEffect, useState } from 'react'
import './PopularCombinations.css'
import heartIcon from '../assets/heart-icon.svg'
import heartIconFilled from '../assets/heart-icon-filled.svg'
import CombinationDetailModal from './CombinationDetailModal.jsx'
import { getRankings } from '../api/rankings.js'
import rank1Image from '../assets/rankings/rank-1-midnight-amber.png'
import rank2Image from '../assets/rankings/rank-2-minimal-jade.png'
import rank3Image from '../assets/rankings/rank-3-pink-lover.png'

// 백엔드가 이미지를 내려주지 않으므로 순위별로 매칭할 데모 이미지 (Figma 255:13846~255:13848)
const RANK_IMAGES = {
  1: rank1Image,
  2: rank2Image,
  3: rank3Image,
}

// 백엔드 랭킹 데이터가 비어있을 때 노출할 데모 조합
const FALLBACK_RANKINGS = [
  {
    rank: 1,
    title: '미드나잇 앰버 앙상블',
    description:
      '깊은 밤의 기품을 닮은 다크 네이비와 부귀의 기원을 담은 호박 팬던트, 정교한 귀도래 매듭으로 완성한 모던 클래식 노리개.',
    creator: 'ARTISAN_LEE',
    decoration_name: '호박 팬던트',
    knot_name: '귀도리 매듭',
    tassel_count: 1,
  },
  {
    rank: 2,
    title: '미니멀리스트 비취 링',
    description: '순백의 비취를 돋보이게 하는 연한 골드 노리개.',
    creator: 'SEOUL_CRAFTS',
    decoration_name: '호박보석',
    knot_name: '삼정자 매듭',
    tassel_count: 1,
  },
  {
    rank: 3,
    title: '핑크러버 노리개',
    description: '붉은 색 보석이 돋보이는 핑크 노리개.',
    creator: 'HERITAGE_WEAVER',
    decoration_name: '호박보석',
    knot_name: '매미 매듭',
    tassel_count: 1,
  },
]

function withDemoImage(combination) {
  return { ...combination, image: combination.image || RANK_IMAGES[combination.rank] }
}

export default function PopularCombinations() {
  const [rankings, setRankings] = useState([])
  const [likedRanks, setLikedRanks] = useState([])
  const [selectedRank, setSelectedRank] = useState(null)

  useEffect(() => {
    getRankings()
      .then((data) => setRankings((data && data.length > 0 ? data : FALLBACK_RANKINGS).map(withDemoImage)))
      .catch(() => setRankings(FALLBACK_RANKINGS.map(withDemoImage)))
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
          {rankings.map(({ rank, title, description, creator, image }) => {
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
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className={`combination-card__image combination-card__image--rank-${rank}`}
                    />
                  )}
                  <span
                    className={`combination-card__rank${rank === 1 ? ' combination-card__rank--top' : ''}`}
                  >
                    {rank}
                  </span>
                </div>
                <div className="combination-card__body">
                  <span
                    className={`combination-card__badge${rank === 1 ? '' : ' combination-card__badge--hidden'}`}
                  >
                    인기
                  </span>
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
