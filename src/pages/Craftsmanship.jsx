import './Craftsmanship.css'
import heroImg from '../assets/craftsmanship/hero.png'
import philosophyImg from '../assets/craftsmanship/philosophy.png'
import step1Img from '../assets/craftsmanship/step1.png'
import step2Img from '../assets/craftsmanship/step2.png'
import step3Img from '../assets/craftsmanship/step3.png'

const SIDE_LINKS = [
  { label: '온라인 서비스 이용 약관', href: '#' },
  { label: '개인정보 처리방침', href: '#' },
  { label: '장인정신', href: '/craftsmanship' },
  { label: '고객센터', href: '#' },
]

const STEPS = [
  {
    number: 1,
    color: '#d48c46',
    image: step1Img,
    title: '비단과 옥의 조화',
    description: '최고급 실크와 천연 옥을 엄선하여 색상의 조화와 질감을 결정하는 첫 단계입니다.',
  },
  {
    number: 2,
    color: '#bf3341',
    image: step2Img,
    title: '명장의 손길',
    description: '수십 년 경력의 매듭장의 섬세한 손끝에서 수백 번의 교차를 통해 견고한 형태가 완성됩니다.',
    offset: true,
  },
  {
    number: 3,
    color: '#128181',
    image: step3Img,
    title: '완성된 유산',
    description: '술을 다듬고 최종 검수를 거쳐, 세대를 이어갈 현대적 감각의 헤리티지 피스가 탄생합니다.',
  },
]

export default function Craftsmanship() {
  return (
    <div className="craftsmanship">
      <aside className="craftsmanship__sidebar">
        {SIDE_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`craftsmanship__side-link${link.label === '장인정신' ? ' craftsmanship__side-link--active' : ''}`}
          >
            {link.label}
          </a>
        ))}
      </aside>

      <main className="craftsmanship__content">
        <section className="craftsmanship__hero">
          <h1 className="craftsmanship__hero-title">
            MCM의 장인정신,
            <br />
            노리개로 피어나다
          </h1>
          <img className="craftsmanship__hero-image" src={heroImg} alt="장인이 노리개를 만드는 모습" />
        </section>

        <section className="craftsmanship__philosophy">
          <img className="craftsmanship__philosophy-image" src={philosophyImg} alt="완성된 노리개" />
          <div className="craftsmanship__philosophy-text">
            <h2 className="craftsmanship__philosophy-title">'짓다' 철학</h2>
            <p>
              MCM의 모던 럭셔리는 한국의 전통적인 수공예 기술과 만나 새로운 예술 작품으로 탄생합니다. 우리는 단순한 장식품을 넘어서,
              '짓다(Jitda)'라는 깊은 철학을 바탕으로 하나의 세계를 직조합니다.
            </p>
            <p>
              시간의 흐름 속에서도 변치 않는 가치를 담아내기 위해, 명장의 손끝에서 시작되는 모든 과정은 극도의 세밀함과 정성을 요구합니다.
              과거의 유산이 현대의 라이프스타일과 조화롭게 어우러지는 순간을 경험해보십시오.
            </p>
          </div>
        </section>

        <section className="craftsmanship__process">
          <div className="craftsmanship__process-heading">
            <h2>제작 과정</h2>
            <p>완벽을 향한 세 가지 여정</p>
          </div>

          <div className="craftsmanship__steps">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className={`craftsmanship__step${step.offset ? ' craftsmanship__step--offset' : ''}`}
              >
                <div className="craftsmanship__step-image-wrap">
                  <img src={step.image} alt={step.title} />
                  <span className="craftsmanship__step-number" style={{ backgroundColor: step.color }}>
                    {step.number}
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
