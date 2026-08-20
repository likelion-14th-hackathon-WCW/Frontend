export function formatReservationNumber(reservation) {
  if (!reservation) return ''
  const id = reservation.id ?? reservation.reservation_id
  return reservation.reservation_number || (id != null ? `MCM-${id}` : '')
}
