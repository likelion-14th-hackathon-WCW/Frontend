import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__heading">전통의 미, 현대의 럭셔리로 태어나다</h1>
        <p className="hero__description">
          맞춤형 장인정신을 통해 현대적으로 재해석된 한국 전통 장신구의 우아함을 경험해보세요.
        </p>
        <a href="/make" className="hero__cta">
          나만의 노리개 만들기
        </a>
      </div>
    </section>
  )
}
