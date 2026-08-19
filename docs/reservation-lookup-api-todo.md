# 비회원 예약 확인 — API 미정

`src/pages/ReservationLookup.jsx` (`/reservation/lookup`)는 Figma 디자인(node 491:8211)대로 UI만 구현되어 있다.
`RESERVATION_01` 명세에는 예약 생성(`POST /api/reservations/`)만 있고, 비회원이 이메일+비밀번호로
자신의 예약을 조회하는 엔드포인트가 없어서 "예약 확인하기" 버튼은 현재 안내 메시지만 띄우는 스텁이다.

필요한 것: 비회원 예약 조회 엔드포인트 (예: `POST /api/reservations/guest-lookup/`,
요청 `{ "guest_id": "...", "guest_password": "..." }`, 응답으로 해당 게스트의 예약 목록 또는 상세).
엔드포인트가 정해지면 `src/api/reservations.js`에 조회 함수를 추가하고 `ReservationLookup.jsx`의
`handleSubmit`을 실제 API 호출로 교체하면 된다.
