// ponytail: mock reservation number — real issuance is backend/separate-repo's job
export function generateReservationNumber(year) {
  const code = String(Math.floor(1000 + Math.random() * 9000))
  return `MCM-${year}-${code}`
}
