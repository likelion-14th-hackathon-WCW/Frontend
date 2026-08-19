# 마이페이지 — 미구현 프론트 / API 연동 TODO

`src/pages/MyPage.jsx`는 "프로필 개요" 단일 화면만 있고, 사이드바 탭(예약 내역/저장된 디자인/소유권/위시리스트/계정 설정)은
클릭 전환이 구현되어 있지 않다. 아래 엔드포인트들은 이번 작업에서 대응하는 프론트 UI가 없어 연동하지 않았다.

## 프로필 수정 — `PATCH /auth/me/nickname/`
- multipart/form-data (`nickname`, `name`, `phone`, `profile_image` 파일)
- "프로필 수정" 버튼은 현재 스텁. 닉네임/이름/연락처 입력 폼 + 이미지 업로드 UI 필요 (모달 or `/mypage/edit` 페이지).

## 예약 내역 전체 화면 — `GET /auth/me/reservations/`
- 개요 화면엔 최신 2건만 표시 중 (`getMyReservations` 재사용 가능).
- "예약 내역" 탭 전용 리스트 화면 필요.

## 예약 변경 — `PATCH /auth/me/reservations/{id}/`
- 요청 `{ "reserved_at": "..." }`, 응답 status가 "변경"으로 바뀐 예약 객체.
- 예약 항목별 "변경" 액션(날짜/시간 재선택 UI) 없음.

## 예약 취소 — `DELETE /auth/me/reservations/{id}/`
- 예약 항목별 "취소" 버튼/확인 다이얼로그 없음.

## 저장된 노리개 디자인 상세 — `GET /auth/me/items/{id}/`
- 개요 화면 타임라인은 목록(`GET /auth/me/items/`)만 사용.
- 카드 클릭 시 상세 보기(디자인 구성 knot/tassel/decoration, wish_keyword, symbol_reason 등) 화면 없음.

## 소유권 등록 — `POST /auth/me/ownerships/`
- 요청 `{ "product": id, "serial_no": "..." }`, 실패 시 400 `{ "serial_no": [...] }`.
- "새 노리개 등록 +" 버튼은 현재 스텁. product 선택 + 시리얼번호 입력 폼 필요.
- product 목록을 가져오는 엔드포인트가 이 명세엔 없음 — 상품 선택 UI를 만들려면 별도 확인 필요.

## 소유권 상세 — 레지스트리 카드의 "자세히" 버튼
- 개요 화면은 `GET /auth/me/ownerships/`의 첫 항목만 표시.
- 전체 목록 + 상세 화면 없음.

## 위시리스트 — `GET/POST/DELETE /auth/me/wishlist/`
- 사이드바에 메뉴만 있고 화면 자체가 없음. 목록 표시, 등록(knot/tassel/decoration 조합 선택), 삭제 UI 모두 필요.

## 계정 설정
- 사이드바 메뉴만 있고 대응 화면 없음. 어떤 설정 항목이 필요한지(비밀번호 변경, 회원 탈퇴 `/auth/withdraw/` 연결 등) 기획 확인 필요.
