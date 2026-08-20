import { useEffect, useState } from 'react'
import './PopularCombinations.css'
import heartIcon from '../assets/heart-icon.svg'
import heartIconFilled from '../assets/heart-icon-filled.svg'
import CombinationDetailModal from './CombinationDetailModal.jsx'
import { getRankings } from '../api/rankings.js'
import { getMyWishlist, addToWishlist, deleteWishlist } from '../api/wishlist.js'

import rank1Image from '../assets/rankings/rank-1-midnight-amber.png'
import rank2Image from '../assets/rankings/rank-2-minimal-jade.png'
import rank3Image from '../assets/rankings/rank-3-pink-lover.png'

// 백엔드가 이미지를 내려주지 않을 경우 대비 순위별 매칭 이미지
const RANK_IMAGES = {
  1: rank1Image,
  2: rank2Image,
  3: rank3Image,
}

// 백엔드 데이터가 비어있을 때 사용할 데모 데이터
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
  const [likedRanks, setLikedRanks] = useState([]) // 화면 표시용 (rank 또는 item_id 저장)
  const [wishlistMap, setWishlistMap] = useState({}) // rank/id -> wishlist_id 매핑용
  const [selectedRank, setSelectedRank] = useState(null)

  useEffect(() => {
    // 1. Ranking 목록 불러오기 (이미지 바인딩 포함)
    getRankings()
      .then((data) => {
        const list = data && data.length > 0 ? data : FALLBACK_RANKINGS
        setRankings(list.map(withDemoImage))
      })
      .catch(() => setRankings(FALLBACK_RANKINGS.map(withDemoImage)))

    // 2. 위시리스트 불러와 하트 상태 및 wishlist_id 매핑 동기화
    getMyWishlist()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data || []

        const likedIds = list.map((item) => item.item_id || item.rank || item.id)
        setLikedRanks(likedIds)

        const map = {}
        list.forEach((item) => {
          const key = item.item_id || item.rank || item.id
          map[key] = item.id
        })
        setWishlistMap(map)
      })
      .catch((err) => console.error('위시리스트 조회 실패:', err))
  }, [])

  async function toggleLike(combination) {
    if (!combination) return

    const itemId = combination.id || combination.item_id
    const targetKey = itemId || combination.rank
    const isLiked = likedRanks.includes(targetKey) || likedRanks.includes(combination.rank)

    // UI 즉시 반영 (Optimistic Update)
    setLikedRanks((current) =>
      isLiked ? current.filter((liked) => liked !== targetKey && liked !== combination.rank) : [...current, targetKey]
    )

    try {
      if (isLiked) {
        // 위시리스트 삭제
        const wishlistId = wishlistMap[targetKey] || targetKey
        await deleteWishlist(wishlistId)

        setWishlistMap((prev) => {
          const next = { ...prev }
          delete next[targetKey]
          return next
        })
      } else {
        // 위시리스트 추가
        const payload = {
          ...(itemId && { item_id: itemId }),
          knot: combination.knot || combination.knot_id || 1,
          tassel: combination.tassel || combination.tassel_id || 1,
          decoration: combination.decoration || combination.decoration_id || 1,
          title: combination.title || '인기 노리개 조합',
          description: combination.description || '',
        }

        const res = await addToWishlist(payload)
        const newId = res?.id || res?.data?.id || targetKey
        setWishlistMap((prev) => ({ ...prev, [targetKey]: newId }))
      }
    } catch (error) {
      console.error('위시리스트 토글 실패:', error)
      // 실패 시 상태 복구
      setLikedRanks((current) =>
        isLiked ? [...current, targetKey] : current.filter((liked) => liked !== targetKey)
      )
      alert('위시리스트 반영에 실패했습니다.')
    }
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
          {rankings.map((combination) => {
            const { rank, title, description, creator, image } = combination
            const cardKey = combination.id || combination.item_id || rank
            const liked = likedRanks.includes(cardKey) || likedRanks.includes(rank)

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
                        toggleLike(combination)
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
        liked={
          selectedRank !== null &&
          (likedRanks.includes(selectedCombination?.id) || likedRanks.includes(selectedRank))
        }
        onToggleLike={() => toggleLike(selectedCombination)}
        onClose={() => setSelectedRank(null)}
      />
    </section>
  )
}