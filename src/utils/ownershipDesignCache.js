// ponytail: /auth/me/ownerships/ 목록 응답에 노리개 디자인(제목/파츠/사진) 정보가 없어
// product 필드로 items와 역매칭해야 하는데, 그 매칭이 백엔드 스키마에 따라 깨지기 쉽다.
// 대신 소유권 신청 성공 시점에 이미 알고 있는 디자인 정보를 응답으로 받은 ownership id에
// 바로 묶어 저장해두고, 조회 화면에서는 이 캐시를 최우선으로 사용한다.
const STORAGE_KEY = 'wcw_ownership_design_cache';

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function cacheOwnershipDesign(ownershipId, design) {
  if (ownershipId == null || !design) return;
  const cache = readCache();
  cache[String(ownershipId)] = {
    title: design.title || design.name || '',
    knot: design.knot ?? design.knot_id,
    tassel: design.tassel ?? design.tassel_id,
    tassel_count: design.tassel_count,
    decoration: design.decoration ?? design.decoration_id,
    color: design.color,
    image: design.image_url || design.thumbnail || '',
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // 저장 실패는 무시 (프리뷰가 안 나올 뿐 기능엔 지장 없음)
  }
}

export function getOwnershipDesign(ownershipId) {
  if (ownershipId == null) return null;
  return readCache()[String(ownershipId)] || null;
}
