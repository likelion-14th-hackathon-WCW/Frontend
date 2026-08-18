import { useEffect, useRef, useState } from 'react'
import './StoreMap.css'
import { loadKakaoMapSdk } from '../utils/loadKakaoMapSdk.js'

// 하드코딩: 매장 좌표 지오코딩 전 지도 기본 중심(서울 시청)
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }
const DEFAULT_LEVEL = 12
const FOCUS_LEVEL = 3

export default function StoreMap({ stores, selectedStoreId }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const infoWindowRef = useRef(null)
  const selectedStoreIdRef = useRef(selectedStoreId)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    selectedStoreIdRef.current = selectedStoreId
  }, [selectedStoreId])

  function focusStore(kakao, store, marker) {
    const map = mapRef.current
    if (!map) return
    map.setLevel(FOCUS_LEVEL)
    map.panTo(marker.getPosition())

    if (!infoWindowRef.current) {
      infoWindowRef.current = new kakao.maps.InfoWindow({ removable: false })
    }
    // 툴팁(InfoWindow) 라벨도 클릭 시 마커와 동일하게 카카오맵 장소 페이지로 이동
    const label = store.kakaoUrl
      ? `<a href="${store.kakaoUrl}" target="_blank" rel="noopener noreferrer" style="display:block;padding:6px 10px;font-size:12px;white-space:nowrap;color:#1a1a1a;text-decoration:none;">${store.name}</a>`
      : `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${store.name}</div>`
    infoWindowRef.current.setContent(label)
    infoWindowRef.current.open(map, marker)
  }

  useEffect(() => {
    let cancelled = false

    loadKakaoMapSdk()
      .then((kakao) => {
        if (cancelled || !containerRef.current) return

        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: DEFAULT_LEVEL,
        })
        mapRef.current = map

        const geocoder = new kakao.maps.services.Geocoder()

        stores.forEach((store) => {
          geocoder.addressSearch(store.address, (result, resultStatus) => {
            if (cancelled) return
            if (resultStatus !== kakao.maps.services.Status.OK || !result[0]) return

            const position = new kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))
            const marker = new kakao.maps.Marker({ map, position, title: store.name, clickable: true })
            markersRef.current[store.id] = marker

            // 마커 클릭 시 해당 매장의 카카오맵 장소 페이지를 새 탭으로 오픈
            if (store.kakaoUrl) {
              kakao.maps.event.addListener(marker, 'click', () => {
                window.open(store.kakaoUrl, '_blank', 'noopener,noreferrer')
              })
            }

            // 지오코딩은 비동기라 마커가 언제 만들어질지 모르니, 응답이 도착한 시점에
            // 그게 현재 선택된 매장이면 바로 포커스(초기 선택 매장 포함)
            if (store.id === selectedStoreIdRef.current) {
              focusStore(kakao, store, marker)
            }
          })
        })

        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        setStatus('error')
        setErrorMessage(error.message)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (status !== 'ready') return
    const marker = markersRef.current[selectedStoreId]
    const store = stores.find((item) => item.id === selectedStoreId)
    if (!marker || !store || !window.kakao) return
    focusStore(window.kakao, store, marker)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStoreId, status])

  return (
    <div className="store-map">
      <div ref={containerRef} className="store-map__canvas" />
      {status === 'loading' && <div className="store-map__overlay">지도를 불러오는 중...</div>}
      {status === 'error' && (
        <div className="store-map__overlay store-map__overlay--error">
          지도를 불러오지 못했습니다.
          <br />
          {errorMessage}
        </div>
      )}
    </div>
  )
}
