import './CustomerCenter.css'
import LegalSideNav from '../components/LegalSideNav.jsx'

const MCM_CONTACT_URL =
  'https://kr.mcmworldwide.com/ko_KR/contactus?srsltid=AfmBOoojGYYlpJ713SaUtmvGT5th90RnRZzch89UcsNffWNnmbfGRWOW'

export default function CustomerCenter() {
  return (
    <div className="customer-center">
      <LegalSideNav active="고객센터" />

      <main className="customer-center__content">
        <h1 className="customer-center__title">고객센터</h1>
        <p className="customer-center__desc">
          서비스 이용 중 궁금한 점이나 불편한 점이 있으신가요? 문의, 상담, 반품/교환 등 고객 지원과 관련된 자세한 안내는 MCM 공식
          고객센터에서 확인하실 수 있습니다.
        </p>
        <a className="customer-center__link" href={MCM_CONTACT_URL} target="_blank" rel="noopener noreferrer">
          MCM 고객센터 바로가기
        </a>
      </main>
    </div>
  )
}
