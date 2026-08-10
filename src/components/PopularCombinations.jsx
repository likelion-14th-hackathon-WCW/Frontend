import './PopularCombinations.css'
import heartIcon from '../assets/heart-icon.svg'

const combinations = [
  {
    rank: 1,
    badge: '트렌딩',
    title: '미드나잇 앰버 앙상블',
    description: '호박 펜던트가 돋보이는 네이비 비단 매듭.',
    author: '@ARTISAN_LEE 님 제작',
  },
  {
    rank: 2,
    title: '미니멀리스트 비취 링',
    description: '순백의 비취를 돋보이게 하는 연한 골드 실.',
    author: '@SEOUL_CRAFTS 님 제작',
  },
  {
    rank: 3,
    title: '봄의 궁궐 모티브',
    description: '산호 장식이 있는 에메랄드와 마젠타 끈.',
    author: '@HERITAGE_WEAVER 님 제작',
  },
]

export default function PopularCombinations() {
  return (
    <section className="popular-combinations">
      <div className="popular-combinations__heading">
        <h2 className="popular-combinations__title">인기 조합</h2>
        <p className="popular-combinations__description">
          우리 커뮤니티가 제작한 가장 인기 있는 노리개 디자인을 발견하고 한정 생산을 고려해보세요.
        </p>
      </div>
      <div className="popular-combinations__list">
        {combinations.map(({ rank, badge, title, description, author }) => (
          <article className="combination-card" key={rank}>
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
                {badge || '트렌딩'}
              </span>
              <h3 className="combination-card__title">{title}</h3>
              <p className="combination-card__description">{description}</p>
              <div className="combination-card__footer">
                <span className="combination-card__author">{author}</span>
                <button className="combination-card__like" type="button" aria-label="좋아요">
                  <img src={heartIcon} alt="" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
