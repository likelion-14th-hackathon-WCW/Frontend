// ponytail: 백엔드가 관계 필드를 raw id 또는 { id, ... } 객체로 섞어 내려줄 때가 있어
// 항상 id만 뽑아 비교한다. 이게 없으면 product 필드가 객체로 오는 순간 매칭이 조용히 실패한다.
function toId(value) {
  if (value == null) return null;
  if (typeof value === 'object') return value.id ?? value.pk ?? null;
  return value;
}

// 소유권(ownership)의 product와 저장된 노리개 디자인(item)의 product/product_id를
// 매칭해 원본 디자인을 찾는다. 못 찾으면 null.
export function findDesignForOwnership(items, ownership) {
  const productId = toId(ownership?.product);
  if (productId == null || !Array.isArray(items)) return null;
  return items.find((design) => toId(design.product ?? design.product_id) === productId) || null;
}
