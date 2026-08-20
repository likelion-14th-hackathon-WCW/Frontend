# 비회원 예약 확인 — API 미정

`src/pages/ReservationLookup.jsx` (`/reservation/lookup`)와 그 결과 화면인
`GuestReservationDetail`(`/reservation/lookup/detail`, Figma node 491:7701),
`GuestReservationCancel`(`/reservation/lookup/cancel`, Figma node 491:7864 / 491:7935)는
UI만 구현되어 있다. `RESERVATION_01` 명세에는 예약 생성(`POST /api/reservations/`)만 있고,
비회원이 이메일+비밀번호로 자신의 예약을 조회/취소하는 엔드포인트가 없어서
"예약 확인하기" 버튼은 목업 예약 데이터를 그대로 상세 화면에 넘기는 스텁이고,
취소 화면의 "예약 취소하기"도 실제 취소 요청 없이 조회 화면으로 돌아가기만 한다.

필요한 것:
- 비회원 예약 조회 엔드포인트 (예: `POST /api/reservations/guest-lookup/`,
  요청 `{ "guest_id": "...", "guest_password": "..." }`, 응답으로 해당 게스트의 예약 상세).
- 비회원 예약 취소 엔드포인트 (예: `POST /api/reservations/guest-cancel/`, 취소 사유 포함).

엔드포인트가 정해지면 `src/api/reservations.js`에 조회/취소 함수를 추가하고
`ReservationLookup.jsx`의 `handleSubmit`과 `GuestReservationCancel.jsx`의 `handleCancel`을
실제 API 호출로 교체하면 된다.
