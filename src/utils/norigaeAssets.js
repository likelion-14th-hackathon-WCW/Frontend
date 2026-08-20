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

const KNOT_NAME_MAP = {
  1: '매미 매듭',
  2: '삼정자 매듭',
  3: '동심결 매듭',
  4: '장구 매듭',
  5: '생쪽 매듭',
  6: '귀도래 매듭',
  maemi: '매미 매듭',
  samjeongja: '삼정자 매듭',
  dongsimgyeol: '동심결 매듭',
  janggu: '장구 매듭',
  saengjjok: '생쪽 매듭',
  guidorae: '귀도래 매듭',
}

const DECO_NAME_MAP = {
  7: '무궁화',
  8: '학',
  9: '호박보석',
  10: '고래',
  11: '나비',
  12: '연꽃',
  mugunghwa: '무궁화',
  crane: '학',
  amber: '호박보석',
  whale: '고래',
  butterfly: '나비',
  lotus: '연꽃',
}

const TASSEL_NAME_MAP = {
  13: '1개 (단봉)',
  14: '2개 (쌍봉)',
  15: '3개 (삼봉)',
  1: '1개 (단봉)',
  2: '2개 (쌍봉)',
  3: '3개 (삼봉)',
}

const COLOR_NAME_MAP = {
  '#17216E': '네이비',
  '#FEB9E3': '핑크',
  '#FFC95F': '옐로우',
  '#369F39': '그린',
  '#F37E7E': '코랄',
  '#1E293B': '네이비',
  '#EC4899': '핑크',
  '#EAB308': '옐로우',
  '#22C55E': '그린',
  '#F97316': '코랄',
  navy: '네이비',
  pink: '핑크',
  yellow: '옐로우',
  green: '그린',
  coral: '코랄',
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

export function isSeasonalNorigae(itemOrReservation) {
  if (!itemOrReservation) return false
  if (itemOrReservation.is_seasonal || itemOrReservation.isSeasonal || itemOrReservation.season) return true

  const rawKnot = itemOrReservation.knot_id ?? itemOrReservation.knot ?? itemOrReservation.knot_name
  const knotVal = typeof rawKnot === 'object' && rawKnot !== null ? (rawKnot.id ?? rawKnot.name ?? rawKnot.pk) : rawKnot
  if (knotVal === 1 || knotVal === '1' || knotVal === 'maemi' || knotVal === '매미 매듭' || knotVal === '매미') return true

  const rawDeco = itemOrReservation.decoration_id ?? itemOrReservation.decoration ?? itemOrReservation.decoration_name
  const decoVal = typeof rawDeco === 'object' && rawDeco !== null ? (rawDeco.id ?? rawDeco.name ?? rawDeco.pk) : rawDeco
  if (
    decoVal === 7 ||
    decoVal === '7' ||
    decoVal === 'mugunghwa' ||
    decoVal === '무궁화' ||
    decoVal === 8 ||
    decoVal === '8' ||
    decoVal === 'crane' ||
    decoVal === '학'
  )
    return true

  const rawColor = itemOrReservation.color
  const colorVal = typeof rawColor === 'object' && rawColor !== null ? (rawColor.hex ?? rawColor.name ?? rawColor.code) : rawColor
  if (colorVal === '#F37E7E' || colorVal === 'coral' || colorVal === '코랄') return true

  return false
}

export function getNorigaeComponentNames(item) {
  if (!item) return { knotName: '', decoName: '', tasselName: '', colorName: '' }

  const rawKnot = item.knot_id ?? item.knot ?? item.knot_name
  const knotVal = typeof rawKnot === 'object' && rawKnot !== null ? (rawKnot.id ?? rawKnot.name ?? rawKnot.pk) : rawKnot
  const knotName = typeof knotVal === 'string' && isNaN(Number(knotVal)) ? knotVal : (KNOT_NAME_MAP[knotVal] || '매미 매듭')

  const rawDeco = item.decoration_id ?? item.decoration ?? item.decoration_name
  const decoVal = typeof rawDeco === 'object' && rawDeco !== null ? (rawDeco.id ?? rawDeco.name ?? rawDeco.pk) : rawDeco
  const decoName = typeof decoVal === 'string' && isNaN(Number(decoVal)) ? decoVal : (DECO_NAME_MAP[decoVal] || '무궁화')

  const rawTassel = item.tassel_id ?? item.tassel ?? item.tassel_count ?? item.tassel_name
  const tasselVal = typeof rawTassel === 'object' && rawTassel !== null ? (rawTassel.id ?? rawTassel.count ?? rawTassel.name ?? rawTassel.pk) : rawTassel
  const tasselName = typeof tasselVal === 'string' && isNaN(Number(tasselVal)) ? tasselVal : (TASSEL_NAME_MAP[tasselVal] || '1개')

  const rawColor = item.color
  const colorVal = typeof rawColor === 'object' && rawColor !== null ? (rawColor.hex ?? rawColor.name ?? rawColor.code) : rawColor
  const colorName = COLOR_NAME_MAP[colorVal] || (typeof colorVal === 'string' ? colorVal : '네이비')

  return { knotName, decoName, tasselName, colorName }
}

export function buildNorigaeData(itemOrReservation) {
  if (!itemOrReservation) return null

  const isSeasonal = isSeasonalNorigae(itemOrReservation)

  if (itemOrReservation.knotImage && itemOrReservation.decorationImage && itemOrReservation.tasselImage) {
    return {
      ...itemOrReservation,
      tasselCount: itemOrReservation.tasselCount ?? 1,
      isSeasonal: itemOrReservation.isSeasonal ?? isSeasonal,
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

  // ▼▼▼ 디버그 로그 (원인 확인 후 지워도 됩니다) ▼▼▼
  console.log('찾으려는 키:', {
    knotKey: `knot-${knotKey}-${colorKey}`,
    decoKey,
    tasselKey: `tassel-${tasselCount}-${colorKey}`,
  })
  console.log('실제 보유한 COMBO_ASSETS 키 목록:', Object.keys(COMBO_ASSETS))
  console.log('실제 보유한 DECO_ASSETS 키 목록:', Object.keys(DECO_ASSETS))
  console.log('찾은 결과:', { knotImage, decorationImage, tasselImage })
  // ▲▲▲ 디버그 로그 끝 ▲▲▲

  if (knotImage && decorationImage && tasselImage) {
    return {
      knotImage,
      decorationImage,
      tasselImage,
      tasselCount,
      title: itemOrReservation.title,
      isSeasonal,
      seasonTag: itemOrReservation.seasonTag || itemOrReservation.season_tag || '여름 시즌',
    }
  }

  return null
}
