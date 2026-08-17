import { useState } from 'react'
import './PopularCombinations.css'
import heartIcon from '../assets/heart-icon.svg'
import heartIconFilled from '../assets/heart-icon-filled.svg'
import CombinationDetailModal from './CombinationDetailModal.jsx'

// 하드코딩: 카드 목록 + 상세 모달용 확장 정보. 추후 인기 조합 API 데이터로 대체 예정
// description: 카드 목록용 한 줄 요약 / modalDescription: 상세 모달용 전체 설명(Figma 시안 328:8700 문구 기준)
const combinations = [
  {
    rank: 1,
    badge: '인기',
    title: '미드나잇 앰버 앙상블',
    description: '호박 펜던트가 돋보이는 네이비 비단 매듭.',
    modalDescription:
      '호박 펜던트와 네이비 비단 매듭이 조화를 이루는 프리미엄 조합입니다. 전통의 깊은 색감과 현대적인 세련미를 동시에 느낄 수 있습니다.',
    author: '@ARTISAN_LEE 님 제작',
    price: '₩320,000',
    components: {
      ornament: '미드나잇 호박 펜던트',
      knot: '네이비 실크 나비 매듭',
      tassel: '다크 네이비 비단 술',
    },
  },
  {
    rank: 2,
    title: '미니멀리스트 비취 링',
    description: '순백의 비취를 돋보이게 하는 연한 골드 실.',
    modalDescription:
      '순백의 비취 장식과 연한 골드 실이 어우러진 미니멀 조합입니다. 과하지 않은 절제된 디자인으로 어떤 가방에도 자연스럽게 어울립니다.',
    author: '@SEOUL_CRAFTS 님 제작',
    price: '₩280,000',
    components: {
      ornament: '순백 비취 링 장식',
      knot: '연한 골드 나비 매듭',
      tassel: '아이보리 실크 술',
    },
  },
  {
    rank: 3,
    title: '봄의 궁궐 모티브',
    description: '산호 장식이 있는 에메랄드와 마젠타 끈.',
    modalDescription:
      '산호 장식과 에메랄드, 마젠타 끈이 어우러져 봄 궁궐의 화려함을 표현한 조합입니다. 화사한 색 대비로 포인트 아이템을 찾는 분께 추천합니다.',
    author: '@HERITAGE_WEAVER 님 제작',
    price: '₩350,000',
    components: {
      ornament: '산호 모티브 장식',
      knot: '에메랄드 국화 매듭',
      tassel: '마젠타 비단 술',
    },
  },
]

export default function PopularCombinations() {
  const [likedRanks, setLikedRanks] = useState([])
  const [selectedRank, setSelectedRank] = useState(null)

  function toggleLike(rank) {
    setLikedRanks((current) =>
      current.includes(rank) ? current.filter((liked) => liked !== rank) : [...current, rank],
    )
  }

  const selectedCombination = combinations.find((combination) => combination.rank === selectedRank) ?? null

  return (
    <section className="popular-combinations">
      <div className="popular-combinations__heading">
        <h2 className="popular-combinations__title">인기 조합</h2>
        <p className="popular-combinations__description">
          우리 커뮤니티가 제작한 가장 인기 있는 노리개 디자인을 발견하고 한정 생산을 고려해보세요.
        </p>
      </div>
      <div className="popular-combinations__list">
        {combinations.map(({ rank, badge, title, description, author }) => {
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
                <span
                  className={`combination-card__badge${badge ? '' : ' combination-card__badge--hidden'}`}
                >
                  {badge || '인기'}
                </span>
                <h3 className="combination-card__title">{title}</h3>
                <p className="combination-card__description">{description}</p>
                <div className="combination-card__footer">
                  <span className="combination-card__author">{author}</span>
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

      <CombinationDetailModal
        combination={selectedCombination}
        liked={selectedRank !== null && likedRanks.includes(selectedRank)}
        onToggleLike={() => toggleLike(selectedRank)}
        onClose={() => setSelectedRank(null)}
      />
    </section>
  )
}
