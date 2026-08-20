// ponytail: 백엔드가 위시리스트 조회 시 title/image를 안정적으로 돌려주지 않아,
// 홈 인기조합에서 하트를 누른 시점의 원본 데이터(제목/이미지)를 로컬에 남겨뒀다가
// 마이페이지 위시리스트에서 knot/tassel/decoration 조합으로 다시 매칭해 보여준다.
const STORAGE_KEY = 'wcw_wish_source_cache';

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function wishSourceKey(parts) {
  if (!parts) return '';
  const knot = parts.knot ?? parts.knot_id ?? parts.knot_name;
  const tassel = parts.tassel ?? parts.tassel_id ?? parts.tassel_count ?? parts.tassel_name;
  const decoration = parts.decoration ?? parts.decoration_id ?? parts.decoration_name;
  return `${knot}_${tassel}_${decoration}`;
}

export function cacheWishSource(parts, { title, image, creator }) {
  const key = wishSourceKey(parts);
  if (!key) return;
  const cache = readCache();
  cache[key] = { title, image, creator };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // 저장 실패는 무시 (미리보기 정보가 없어도 기능엔 지장 없음)
  }
}

export function getWishSource(parts) {
  const key = wishSourceKey(parts);
  if (!key) return null;
  return readCache()[key] || null;
}
