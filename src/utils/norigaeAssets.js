const KNOT_KEYS = {
  1: 'maemi',
  2: 'samjeongja',
  3: 'dongsimgyeol',
  4: 'janggu',
  5: 'saengjjok',
  6: 'guidorae',
  maemi: 'maemi',
  samjeongja: 'samjeongja',
  dongsimgyeol: 'dongsimgyeol',
  janggu: 'janggu',
  saengjjok: 'saengjjok',
  guidorae: 'guidorae',
  '매미': 'maemi',
  '매미 매듭': 'maemi',
  '삼정자': 'samjeongja',
  '삼정자 매듭': 'samjeongja',
  '동심결': 'dongsimgyeol',
  '동심결 매듭': 'dongsimgyeol',
  '장구': 'janggu',
  '장구 매듭': 'janggu',
  '생쪽': 'saengjjok',
  '생쪽 매듭': 'saengjjok',
  '귀도래': 'guidorae',
  '귀도래 매듭': 'guidorae',
}

const DECO_KEYS = {
  7: 'mugunghwa',
  8: 'crane',
  9: 'amber',
  10: 'whale',
  11: 'butterfly',
  12: 'lotus',
  mugunghwa: 'mugunghwa',
  crane: 'crane',
  amber: 'amber',
  whale: 'whale',
  butterfly: 'butterfly',
  lotus: 'lotus',
  '무궁화': 'mugunghwa',
  '학': 'crane',
  '호박': 'amber',
  '호박보석': 'amber',
  '고래': 'whale',
  '나비': 'butterfly',
  '연꽃': 'lotus',
}

const TASSEL_COUNTS = {
  13: 1,
  14: 2,
  15: 3,
  1: 1,
  2: 2,
  3: 3,
  '1개': 1,
  '2개': 2,
  '3개': 3,
  '1봉': 1,
  '2봉': 2,
  '3봉': 3,
}

const COLOR_MAP = {
  '#17216E': 'navy',
  '#FEB9E3': 'pink',
  '#FFC95F': 'yellow',
  '#369F39': 'green',
  '#F37E7E': 'coral',
  '#1E293B': 'navy',
  '#EC4899': 'pink',
  '#EAB308': 'yellow',
  '#22C55E': 'green',
  '#F97316': 'coral',
  navy: 'navy',
  pink: 'pink',
  yellow: 'yellow',
  green: 'green',
  coral: 'coral',
  '네이비': 'navy',
  '핑크': 'pink',
  '노랑': 'yellow',
  '초록': 'green',
  '코랄': 'coral',
}

const COMBO_MODULES = import.meta.glob('../assets/editor-combo/*.svg', { eager: true, import: 'default' })
const DECO_MODULES = import.meta.glob('../assets/editor-items/deco-*.svg', { eager: true, import: 'default' })

const COMBO_ASSETS = {}
for (const path in COMBO_MODULES) {
  const name = path.split('/').pop().replace('.svg', '')
  COMBO_ASSETS[name] = COMBO_MODULES[path]
}

const DECO_ASSETS = {}
for (const path in DECO_MODULES) {
  const name = path.split('/').pop().replace('.svg', '').replace(/^deco-/, '')
  DECO_ASSETS[name] = DECO_MODULES[path]
}

export function buildNorigaeData(itemOrReservation) {
  if (!itemOrReservation) return null

  if (itemOrReservation.knotImage && itemOrReservation.decorationImage && itemOrReservation.tasselImage) {
    return {
      ...itemOrReservation,
      tasselCount: itemOrReservation.tasselCount ?? 1,
    }
  }

  const rawKnot = itemOrReservation.knot_id ?? itemOrReservation.knot ?? itemOrReservation.knot_name
  const knotVal = typeof rawKnot === 'object' && rawKnot !== null ? (rawKnot.id ?? rawKnot.name ?? rawKnot.pk) : rawKnot
  const knotKey = KNOT_KEYS[knotVal] || 'maemi'

  const rawDeco = itemOrReservation.decoration_id ?? itemOrReservation.decoration ?? itemOrReservation.decoration_name
  const decoVal = typeof rawDeco === 'object' && rawDeco !== null ? (rawDeco.id ?? rawDeco.name ?? rawDeco.pk) : rawDeco
  const decoKey = DECO_KEYS[decoVal] || 'mugunghwa'

  const rawTassel = itemOrReservation.tassel_id ?? itemOrReservation.tassel ?? itemOrReservation.tassel_count ?? itemOrReservation.tassel_name
  const tasselVal = typeof rawTassel === 'object' && rawTassel !== null ? (rawTassel.id ?? rawTassel.count ?? rawTassel.name ?? rawTassel.pk) : rawTassel
  const tasselCount = TASSEL_COUNTS[tasselVal] || 1

  const rawColor = itemOrReservation.color
  const colorVal = typeof rawColor === 'object' && rawColor !== null ? (rawColor.hex ?? rawColor.name ?? rawColor.code) : rawColor
  const colorKey = COLOR_MAP[colorVal] || 'navy'

  const knotImage = COMBO_ASSETS[`knot-${knotKey}-${colorKey}`]
  const decorationImage = DECO_ASSETS[decoKey]
  const tasselImage = COMBO_ASSETS[`tassel-${tasselCount}-${colorKey}`]

  if (knotImage && decorationImage && tasselImage) {
    return {
      knotImage,
      decorationImage,
      tasselImage,
      tasselCount,
      title: itemOrReservation.title,
    }
  }

  return null
}
