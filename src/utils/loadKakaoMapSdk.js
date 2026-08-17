let sdkPromise = null

// 카카오맵 JS SDK를 동적으로 로드(npm 패키지가 아니라 공식 CDN 스크립트 방식).
// autoload=false로 받아온 뒤 kakao.maps.load로 초기화해야 지도 렌더링 타이밍이 안정적임.
// 앱 전체에서 한 번만 로드하도록 프로미스를 캐싱.
export function loadKakaoMapSdk() {
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY

    if (!appKey) {
      reject(new Error('VITE_KAKAO_MAP_APP_KEY가 설정되지 않았습니다. .env 파일에 카카오맵 JS 키를 입력해주세요.'))
      return
    }

    if (window.kakao?.maps) {
      resolve(window.kakao)
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`
    script.async = true
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    script.onerror = () => reject(new Error('카카오맵 SDK를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })

  return sdkPromise
}
